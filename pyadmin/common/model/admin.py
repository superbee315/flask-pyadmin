# coding=utf-8
''''
Created on 2021年5月6日

@author: 40215
'''
import time, enum, hashlib
from flask_login import UserMixin
from pyadmin.extensions import db
from .base import PkModel, Model
from werkzeug.security import gen_salt
from . import CurrentTime

class UserEnum(enum.Enum):
    '''
    用户状态
    '''
    normal = 'normal'
    locked = 'locked'
    
class TypeEnum(enum.Enum):
    '''
    menu为菜单,file为权限节点
    '''
    menu = 'menu'
    file = 'file'
    
class Admin(PkModel, UserMixin):
    __tablename__ = "admin"
    
    username = db.Column(db.String(length=32), nullable=False, unique=True, server_default='', comment="用户名")
    nickname = db.Column(db.String(length=50), nullable=False, server_default='', comment="昵称")
    pwd = db.Column('password', db.String(length=255), nullable=False, server_default='', comment="密码")
    salt = db.Column(db.String(length=30), nullable=False, server_default='', comment="密码盐")
    avatar = db.Column(db.String(length=128), nullable=False, server_default='', comment='头像')
    email = db.Column(db.String(length=128), nullable=False, server_default='', comment='邮箱')
    loginip = db.Column(db.String(length=50), nullable=False, server_default='', comment='登录ip')
    logintime = db.Column(db.Integer, default=CurrentTime().now_time(), comment='登录时间')
    loginfailure = db.Column(db.Integer, nullable=False, server_default='0', comment='登录ip')
    token = db.Column(db.String(length=50), nullable=False, server_default='', comment='Session标识')
    status = db.Column(db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')
    createtime = db.Column(db.Integer, default=CurrentTime().now_time(), comment='创建时间')
    updatetime = db.Column(db.Integer, default=CurrentTime().now_time(), comment='更新时间')
    
    @staticmethod
    def query_by_username(username):
        return Admin.query.filter(Admin.username == username).first()

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute!")
    
    @password.setter
    def password(self, password:str):
        """生成密码"""
        if password:
            # 生成加密盐
            self.salt = gen_salt(6)
            # MD5方法加密密码
            m = hashlib.md5()
            m.update(password.encode(encoding='UTF-8'))
            _pwd = m.hexdigest() 
            # 加盐后再加密
            _pwd += self.salt
            m = hashlib.md5()
            m.update(_pwd.encode(encoding='UTF-8'))
            self.pwd = m.hexdigest()

    def verify_password(self, password:str):
        """验证密码"""
        if password:
            # MD5方法加密密码
            m = hashlib.md5()
            m.update(password.encode(encoding='UTF-8'))
            _pwd = m.hexdigest()
            # 加盐后再加密
            _pwd += self.salt
            m = hashlib.md5()
            m.update(_pwd.encode(encoding='UTF-8'))
            
            return self.pwd == m.hexdigest() 
        return False
    
    @property
    def is_active(self):
        if self.status != UserEnum.normal:
            return False
        return True
    
    def __repr__(self):
        return 'Admin: {id: %s, username: %s, nickname: %s, email: %s}' % (self.id, self.username, self.nickname, self.email)
    
class AdminLog(PkModel):
    __tablename__ = "admin_log"
    
    admin_id = db.Column('admin_id', db.Integer, nullable=False, comment="管理员ID")
    username = db.Column('username', db.String(length=30), default='', server_default='', comment="管理员名字")
    url = db.Column('url', db.String(length=1500), default='', server_default='', comment="操作页面")
    title = db.Column('title', db.String(length=100), default='', server_default='', comment="日志标题")
    content = db.Column('content', db.Text, nullable=False, comment='内容')
    ip = db.Column('ip', db.String(length=50), default='', server_default='', comment='IP')
    logintime = db.Column('logintime', db.Integer, default=time.time, comment='登录时间')
    useragent = db.Column('useragent', db.String(length=255), default='', server_default='', comment='User-Agent')
    createtime = db.Column('createtime', db.Integer, default=time.time, comment='操作时间')
    
    def __repr__(self):
        return 'Admin_log: {admin_id: %s,title: %s}' % (self.admin_id, self.title)

class AuthRule(PkModel):
    __tablename__ = "auth_rule"
    
    type = db.Column('type', db.Enum(TypeEnum), default='file', server_default='file', comment='menu为菜单,file为权限节点')
    pid = db.Column('pid', db.Integer, comment='父ID', index=True, default=0)
    name = db.Column('name', db.String(length=100), nullable=False, unique=True, default='', server_default='', comment='规则名称')
    title = db.Column('title', db.String(length=50), nullable=False, default='', server_default='', comment='规则标题')
    url = db.Column('url', db.String(length=127), nullable=False, default='', server_default='', comment='菜单路径')
    icon = db.Column('icon', db.String(length=50), nullable=True, default='', server_default='', comment='图标')
    condition = db.Column('condition', db.String(length=255), nullable=False, default='', server_default='', comment='条件')
    remark = db.Column('remark', db.String(length=255), nullable=True, default='', server_default='', comment='备注')
    ismenu = db.Column('ismenu', db.Boolean, nullable=False, default=False, server_default='0', comment='是否为菜单')
    createtime = db.Column('createtime', db.Integer, default=time.time, comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=time.time, comment='更新时间')
    weigh = db.Column('weigh', db.Integer, default=0, nullable=False, comment='权重')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')

    @staticmethod
    def query_by_name(name):
        return AuthRule.query.filter(AuthRule.name == name).first()
  
    def __repr__(self):
        return 'auth_rule: {id: %s, name: %s}' % (self.id,self.name)  
    
class AuthGroup(PkModel):
    __tablename__ = "auth_group"
    
    pid = db.Column('pid', db.Integer, comment='父组别', index=True, default=0)
    name = db.Column('name', db.String(length=100), nullable=False, unique=True, default='', server_default='', comment='组名')
    rules = db.Column('rules', db.Text, nullable=False, default='', server_default='', comment='规则ID')
    createtime = db.Column('createtime', db.Integer, default=time.time, comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=time.time, comment='更新时间')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')
    
    def __repr__(self):
        return 'auth_group: {id: %s,%s}' % (self.id,self.name)

class AuthGroupAccess(Model):
    __tablename__ = "auth_group_access"
    
    uid = db.Column('uid', db.Integer, primary_key=True, comment='会员ID', index=True)
    group_id = db.Column('group_id', db.Integer, primary_key=True, comment='级别ID', index=True)
    
    def __repr__(self):
        return 'auth_group_access: {uid: %s, %s}' % (self.uid,self.group_id)
  
  