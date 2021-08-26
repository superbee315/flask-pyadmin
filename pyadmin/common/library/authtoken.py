'''
Created on 2021年5月8日

@author: 40215
'''
import jwt, datetime, numpy
from . import synchronized
from flask import current_app, request
from sqlalchemy.orm import load_only
from sqlalchemy.sql.expression import desc
from pyadmin.extensions import db
from pyadmin.common.model import admin, queryToDict
from pyadmin.common.library.token.redis import RedisToken

class Token():
    _handler = None
    
    @staticmethod
    def init():
        '''
        自动初始化Token
        '''
        if Token._handler == None:
            Token._handler = RedisToken()
        
        return Token._handler

    @staticmethod
    def has(token:str, user_id:int):
        '''
        判断Token是否可用（check别名)
        :param token: Token
        :param user_id: 会员Id
        '''
        return Token.check(token, user_id)

    @staticmethod
    def check(token:str, user_id:int):
        '''
        判断Token是否可用
        :param token: Token
        :param user_id: 会员Id
        '''
        return Token.init().check(token, user_id)

    @staticmethod
    def get(token:str, default=None):
        '''
        获取Token
        :param token: Token
        :param default: 默认值
        '''
        data = Token.init().get(token) 
        return data if data else default
    
    @staticmethod
    def set(token:str, user_id:int):
        '''
        写入Token
        :param token: Token
        :param user_id: 储存数据
        '''
        return Token.init().set(token, user_id)
    
    @staticmethod
    def delete(token:str):
        '''
        删除Token
        :param token: Token
        '''
        return Token.init().delete(token)
    
    @staticmethod
    def clear(user_id:int):
        '''
        清除Token
        :param user_id: 会员Id
        '''
        return Token.init().clear(user_id)
        
class Jwt(object):
    '''
    jwt 验证器
    '''
    @classmethod
    def encode(cls, user_id:int, username:str, expiry=30, secret=None):
        '''
        生成jwt
        :param user_id: int 用户id  
        :param username: str 用户名称
        :param expiry: int 有效期(天数)
        :param secret: str 密钥
        :return: jwt
        '''
        if not secret:
            secret = current_app.config['JWT_SECRET']
            
        expiry = current_app.config['JWT_EXPIRE_DAY']
        
        try:
            _payload = {
                'id' : user_id,
                'username' : username,
                'iat' : datetime.datetime.utcnow(),
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=expiry),
            }
            
            payload = jwt.encode(_payload, secret, algorithm='HS256')
        except Exception as e:
            payload = e
        return payload
    
    @classmethod
    def decode(cls, token, secret=None):
        '''
        检验jwt
        :param token: str  jwt
        :param secret: str 密钥
        :return dict: payload
        '''
        if not secret:
            secret = current_app.config['JWT_SECRET']
        
        try:
            payload = jwt.decode(token, secret, algorithms=['HS256'])
        except jwt.exceptions.PyJWTError:
            payload = None
            
        return payload
    
class Auth(object):
    '''
    权限认证类
    '''
    instance = None 
    groups = {}
    rules = []
    rule_list = {}          # 用户对应的规则列表 {rule.name: {}}
    rule_check_list = {}
    
    @synchronized
    def __new__(cls, *args, **kwargs):
        """
        :type kwargs: object
        """
        if cls.instance is None:
            cls.instance = super().__new__(cls)
        return cls.instance
    
    def check(self, uid:int, rules=[], relation='or'):
        '''
        检查权限
        :param uid: 认证用户的id
        :param rules: 需要验证的规则列表（验证规则是endpoint.method 例如：Resource.__name__.lower + .request.method.lower）
        :param relation: 如果为 'or' 表示满足任一条规则即通过验证;如果为 'and'则表示需满足所有规则才能通过验证
        :param method: 访问接口方法
        '''
        if not rules:
            rule = '%s.%s' % (request.endpoint, request.method)
            rules = [rule.lower()]
            
        # 获取用户需要验证的所有有效规则列表
        rulelist = self.getCheckRuleList(uid)
        if '*' in rulelist:
            return True
        
        _list = []
        for key in rules:
            _list.append(True if key in rulelist else False)
            
        arr = numpy.array(_list)
        # 统计数组中是否存在一个/多个True
        if relation == 'or' and arr.any():
            return True
        # 统计数组中是否都是True
        if relation == 'and' and arr.all():
            return True
            
        return False

    def getGroups(self, uid):
        '''
        根据用户uid获取用户组,返回值为数组
        :param uid: 用户id
        :type uid int
        '''
        if uid in self.groups:
            return self.groups[uid]
        
        user_groups = db.create_scoped_session().\
        query(admin.AuthGroup, admin.AuthGroupAccess).\
        join(admin.AuthGroup, admin.AuthGroup.id == admin.AuthGroupAccess.group_id).\
        filter(admin.AuthGroupAccess.uid == uid).\
        filter(admin.AuthGroup.status == admin.UserEnum.normal).\
        all()
        
        self.groups[uid] = [x[0] for x in user_groups]
        return self.groups[uid]
    
    def getRuleList(self, uid:int):
        '''
        获得权限规则列表
        :param uid: 用户id
        '''
        if uid in self.rule_list:
            return self.rule_list[uid]
        
        # 读取用户规则节点
        ids = self.getRuleIds(uid)
        if not ids:
            self.rule_list[uid] = {}
            return None
        
        # 循环加入规则
        rulelist = {}
        if '*' in ids:
            rulelist['*'] = '*'
            
        rules = db.create_scoped_session().query(admin.AuthRule).\
        filter(admin.AuthRule.status == admin.UserEnum.normal).\
        filter(admin.AuthRule.id.in_(ids) if '*' not in ids else True).\
        filter(admin.AuthRule.ismenu == 1).\
        order_by(desc(admin.AuthRule.weigh)).\
        all()

        rules = queryToDict(rules)

        for rule in rules:
            rulelist[rule['name'].lower()] = rule

        self.rule_list[uid] = rulelist
        return rulelist

    def getRuleIds(self, uid:int):
        '''
        读取用户所属用户组
        :param uid: 用户id
        '''
        groups = self.getGroups(uid)
        ids = []
        for g in groups:
            rules = g.rules.strip(',')      # 去掉左右的字符
            ids.extend(rules.split(','))    # 数组相加
        
        return list(set(ids))

    def getCheckRuleList(self, uid:int):
        '''
        获得权限规则列表
        :param uid: 用户id
        '''
        if uid in self.rule_check_list:
            return self.rule_check_list[uid]
        
        # 读取用户规则节点
        ids = self.getRuleIds(uid)
        if not ids:
            self.rule_list[uid] = {}
            return {}

        # 循环加入规则
        rulelist = {}
        if '*' in ids:
            rulelist['*'] = '*'

        rules = db.create_scoped_session().query(admin.AuthRule). \
            filter(admin.AuthRule.id.in_(ids) if '*' not in ids else True). \
            order_by(desc(admin.AuthRule.weigh)).all()
        rules = queryToDict(rules)

        for rule in rules:
            rulelist[rule['name'].lower()] = rule

        self.rule_check_list[uid] = rulelist
        return rulelist
    
    def clear(self):
        '''
        删除缓存
        '''
        self.groups = {}
        self.rules = []
        self.rule_list = {}
        self.rule_check_list = {}

        return self
    
    
    
    