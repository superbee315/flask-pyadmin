import json, time, urllib, numpy
from functools import wraps
from flask import Blueprint, jsonify, helpers, request, g
from flask_restful import Api, Resource
from flask_login import login_user, logout_user
from pyadmin.app import login_manager, db
from pyadmin.common.library.authtoken import AuthToken, Auth
from pyadmin.common.model.admin import Admin, AuthGroup, UserEnum, AuthGroupAccess, AuthRule

bp_admin = Blueprint('admin', __name__, url_prefix='/admin')
bp_general = Blueprint('admin/general', __name__, url_prefix='/admin/general')

admin = Api(bp_admin)
general = Api(bp_general)

def access_view(func):
    '''
    判断用户是否有权限
    '''
    @wraps(func)
    def decorator(*args, **kwargs):
        _result = {
            'msg':'no permission',
            'time': int(time.time()),
            'code': 0,
            'data': ''
        }
        
        try:
            if not Auth().check(g.admin.id):
                return helpers.make_response(jsonify(_result), 403) 
            
            return func(*args, **kwargs)
        except Exception as e:
            _result['msg'] = 'system error, ask administrator'
            _result['data'] = {
                'err_type': e.__class__.__name__,
                'err_content': str(e),
            }
            
            return helpers.make_response(jsonify(_result), 403)
        
    return decorator

def loop_get_children(group_list, _id):
    '''
    递归查询管理组内容
    :param group_list 所有列表信息
    :param _id 要查询的内容id
    '''
    data = []
    for group in group_list:
        if group.pid == _id:
            data.append(group)
            loop = loop_get_children(group_list, group.id)
            data.extend(loop)
            
    return data

class Backend(Resource):
    auth = None
    model = None
    token = None
    
    def __init__(self):
        self.auth = Auth()
        
    def login(self, username:str, password:str):
        '''
        用户登陆
        :param username: 用户名
        :param password: 密码
        '''
        admin = self.model.query_by_username(username)
        if not admin:
            return False
        
        if not admin.is_active:
            return False
        
        if not admin.verify_password(password):
            return False
        
        login_user(admin)
        self.jwt = AuthToken.encode(admin.id, admin.username)
        
        return True
        
    def logout(self):
        '''
        用户退出
        '''
        logout_user()
    
    def success(self, msg='OK', data={} or [], code=1):
        return self.__result(msg, data, code)

    def error(self, msg="Errors", data={} or [], code=0):
        return self.__result(msg, data, code)

    def __result(self, msg, data, code):
        res = {
            "time": int(time.time()),
            "code": code, 
            "msg": msg,
            "result": data,
        }
        
        return jsonify(res)

    
    def get_children_group_ids(self, withself=False, pid=-1):
        '''
        取出当前管理员所拥有权限的分组或根据父组别id取出其所有子组别id
        :param withself： 是否不包含当前所在的分组
        :param pid： 不传值时为查询当前管理员所拥有权限的分组，此时默认值为-1
                     传值时则将所传值作为父组别id，取出其所有子组别id
        '''
        if pid>0:
            groups = db.create_scoped_session(). \
                query(AuthGroup). \
                filter(AuthGroup.id == pid). \
                all()
        else:
            groups = self.auth.getGroups(g.admin.id)

        # 取出所有分组
        group_list = db.create_scoped_session().\
        query(AuthGroup).filter(AuthGroup.status == UserEnum.normal).\
        all()
                
        obj_list = []
        for group in groups:
            if group.rules == '*' :
                obj_list = group_list
                break
            gps = loop_get_children(group_list, group.id)
            if not withself:
                obj_list.append(group)
            obj_list.extend(gps)
            
        childrenGroupIds = [_g.id for _g in obj_list]
        return childrenGroupIds
    
    def get_children_admin_ids(self, withself=False):
        '''
        取出当前管理员所拥有权限的管理员
        :param withself： 是否包含自身
        '''
        childrenAdminIds = []
        if not self.is_super_admin():
            groupIds = self.get_children_group_ids()
            authGroupList = db.create_scoped_session().\
                            query(AuthGroup, AuthGroupAccess).\
                            join(AuthGroup, AuthGroup.id == AuthGroupAccess.group_id).\
                            filter(AuthGroupAccess.group_id.in_(groupIds)).\
                            all()
            childrenAdminIds = [auth.AuthGroupAccess.uid for auth in authGroupList]
        else: 
            authGroupList = db.create_scoped_session().query(Admin).all()
            childrenAdminIds = [a.id for a in authGroupList]
        
        if withself:
            if g.admin.id not in childrenAdminIds:
                childrenAdminIds.append(g.admin.id)
        else:
            childrenAdminIds = numpy.setdiff1d(childrenAdminIds, g.admin.id)
        
        return childrenAdminIds

    def get_children_rule_ids(self, pid, withself=True):
        '''
        根据菜单规则父组别id取出其所有子组别id
        :param withself： 是否包含自身
        :param pid： 父组别id
        '''
        rules = db.create_scoped_session(). \
            query(AuthRule). \
            filter(AuthRule.id == pid). \
            all()

        rule_list = db.create_scoped_session(). \
            query(AuthRule).filter(AuthRule.status == UserEnum.normal). \
            all()

        obj_list = []
        for rule in rules:
            gps = loop_get_children(rule_list, rule.id)
            if withself:
                obj_list.append(rule)
            obj_list.extend(gps)

        childrenRuleIds = [_g.id for _g in obj_list]
        return childrenRuleIds

        
    def is_super_admin(self):
        '''
        判断当前登陆用户是否为超级管理员
        '''
        return True if '*' in self.auth.getRuleIds(g.admin.id) else False
        
    
    def buildparam(self):
        '''
        生成查询所需要的条件,排序方式
        '''        
        _order = request.args.get('order', 'asc', type=str)
        _filter = request.args.get('filter', '{}', type=str)
        _op = request.args.get('op', '{}', type=str)
        offset = request.args.get('offset', 1, type=int)
        limit = request.args.get('limit', 999, type=int)
        sort = request.args.get('sort', 'id', type=str)
#         search = request.args.get('search', '', type=str)
        
        # 计算偏移量 相当于分页
        offset = (int(offset) - 1) * int(limit)
        # 判断排序信息
        if hasattr(self.model, sort):
            if _order.lower() == 'desc':
                order = getattr(self.model, sort).desc()
            elif _order.lower() == 'asc':
                order = getattr(self.model, sort).asc()
            else:
                raise TypeError('order type error')    
        else:
            raise ValueError('[sort] model field not found field')    
        # 判断查询条件
        t_filter = json.loads(urllib.parse.unquote(_filter))
        op = json.loads(urllib.parse.unquote(_op))
        
        where = []        
        for k, v in t_filter.items():
            
            if hasattr(self.model, k):
                f = op[k] if k in op else '=' 

                if f == '=':
                    where.append(getattr(self.model, k) == ("%s" % v))
                elif f.lower() == 'like':
                    where.append(getattr(self.model, k).like("%{0}%".format(v)))
            else:
                raise ValueError('[where] model field not found field')
                
        return (order, offset, limit, where)
    
    @staticmethod
    @login_manager.unauthorized_handler
    def unauthorized():
        return helpers.make_response(Backend().error('Please login first'), 401)
    
    @staticmethod
    @login_manager.request_loader
    def load_admin_from_request(request):
        token = request.headers.get('Authorization')
        if not token:
            return None
        
        payload = AuthToken.decode(token)
        # 是否能找到数据
        if payload:
            # 先判断有效期
            if int(time.time()) > payload['exp']:
                return None
    
            admin = Admin().get_by_id(payload['id'])
            g.admin = admin
            Backend.jwt = token
        else:
            admin = None
        return admin
    
    @staticmethod
    @bp_admin.errorhandler(404)
    def not_found(err):
        """自定义的处理错误方法"""
    
        return "出现了404错误， 错误信息： \n\t %s" % err

from .views import admin
from .views import general
