# -*- encoding: utf-8 -*-
"""
@Desc    :   
@File    :   user.py
@Time    :   2021/05/21 10:07:03
@Author  :   wang 
@Version :   1.0
"""

# here put the import lib

import time, enum
from flask_login import UserMixin
from pyadmin.extensions import db
from .base import PkModel, Model
from werkzeug.security import generate_password_hash, check_password_hash

class UserEnum(enum.Enum):
    '''
    性别
    '''
    normal = 'normal'
    locked = 'locked'

class GenderEnum(enum.Enum):
    '''
    性别
    '''
    female = 0
    male = 1
       
class TypeEnum(enum.Enum):
    '''
    menu为菜单,file为权限节点
    '''
    menu = 'menu'
    file = 'file'

class Ctime():
    def now_time(self):
        return int(time.time())
        
    
class User(PkModel, UserMixin):
    __tablename__ = "user"
    
    group_id = db.Column(db.Integer, length=10, nullable=False, comment='组别ID')
    username = db.Column(db.String(length=32), nullable=False, unique=True, server_default='', comment="用户名")
    nickname = db.Column(db.String(length=50), nullable=False, server_default='', comment="昵称")
    pwd = db.Column('password', db.String(length=255), nullable=False, server_default='', comment="密码")
    salt = db.Column(db.String(length=30), nullable=False, server_default='', comment="密码盐")
    avatar = db.Column(db.String(length=255), nullable=False, server_default='', comment='头像')
    email = db.Column(db.String(length=128), nullable=False, server_default='', comment='电子邮箱')
    level = db.Column(db.Integer, length=10, default=0, nullable=False, comment='等级')
    birthday = db.Column(db.Date, comment='生日')
    bio = db.Column(db.String(length=100), comment='格言')
    money = db.Column(db.DECIMAL(10, 2), nullable=False, default=0.00, comment='余额')
    score = db.Column(db.Integer, length=10, nullable=False, default=0, comment='积分')
    succession = db.Column(db.Integer, length=5, nullable=False, default=1, comment='连续登录天数')
    succession = db.Column(db.Integer, length=5, nullable=False, default=1, comment='最大连续登录天数')
    gender = db.Column(db.Enum(GenderEnum), default=0, comment='性别')
    mobile = db.Column(db.String(length=11), nullable=False, server_default='', comment='手机号')
    loginip = db.Column(db.String(length=50), nullable=False, server_default='', comment='登录IP')
    logintime = db.Column(db.Integer, default=Ctime().now_time(), comment='上次登录时间')
    loginfailure = db.Column(db.Integer, length=5, nullable=False, comment='失败次数')
    joinip = db.Column(db.String(length=50), nullable=False, server_default='', comment='加入IP')
    joinip =  db.Column(db.Integer, default=Ctime().now_time(), comment='加入时间')
    token = db.Column(db.String(length=50), nullable=False, server_default='', comment='Token')
    status = db.Column(db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')
    createtime = db.Column(db.Integer, default=Ctime().now_time(), comment='创建时间')
    updatetime = db.Column(db.Integer, default=Ctime().now_time(), comment='更新时间')
    verification = db.Column(db.String(length=255), default='', comment="验证")
    
    def __repr__(self):
        return 'User: {id: %s, username: %s, nickname: %s, salt: %s}' % (self.id, self.username, self.nickname, self.salt)

class UserGroup(PkModel, UserMixin):
    __tablename__ = "user_group"
    
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column('name', db.String(length=50), default='', server_default='', comment='组名')
    rules = db.Column('rules', db.Text, nullable=False, comment='权限节点')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=int(time.time()), comment='更新时间')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')

    
    def __repr__(self):
        return 'User_group: {id: %s,%s}' % (self.id,self.username)

class UserMoneyLog(PkModel, UserMixin):
    __tablename__ = "user_money_log"
    
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column('user_id', db.INTEGER(unsigned=True), default=0, nullable=False, comment='会员ID')
    money = db.Column('money', db.DECIMAL(10,2), default=0.00, nullable=False, comment='变更余额')
    before = db.Column('before', db.DECIMAL(10,2), default=0.00, nullable=False, comment='变更前余额')
    after = db.Column('after', db.DECIMAL(10,2), default=0.00, nullable=False, comment='变更后余额')
    memo = db.Column('memo', db.String(length=255), default='', server_default='', comment='备注')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')


    
    def __repr__(self):
        return 'user_money_log: {id: %s,%s}' % (self.id,self.user_id)
    

class UserRule(PkModel, UserMixin):
    __tablename__ = "user_rule"
    
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    pid = db.Column('pid', db.Integer, comment='父ID')
    name = db.Column('name', db.String(length=50), default='', server_default='', comment='名称')
    title = db.Column('title', db.String(length=50), default='', server_default='', comment='标题')
    remark = db.Column('remark', db.String(length=100), comment='备注')
    ismenu = db.Column('ismenu', db.TINYINT, default=1, comment='是否菜单')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=int(time.time()), comment='更新时间')
    weigh = db.Column('weigh', db.Integer, default=0, comment='权重')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')

    
    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id,self.name)

class UserScoreLog(PkModel, UserMixin):
    __tablename__ = "user_score_log"
    
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column('user_id', db.INTEGER(unsigned=True), default=0, nullable=False, comment='会员ID')
    score = db.Column('score', db.Integer, default='0', nullable=False, comment='变更积分')
    before = db.Column('before', db.Integer, default='0', nullable=False, comment='变更前积分')
    after = db.Column('after', db.Integer, default='0', nullable=False, comment='变更后积分')
    memo = db.Column('memo', db.String(length=255), default='', server_default='', comment='备注')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')

    
    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id,self.user_id)

class UserToken(PkModel, UserMixin):
    __tablename__ = "user_token"
    
    token = db.Column('token', db.String(length=50), primary_key=True, nullable=False, server_default='', comment='Token')
    user_id = db.Column('user_id', db.INTEGER(unsigned=True), default=0, nullable=False, comment='会员ID')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    expiretime = db.Column('expiretime', db.Integer, default=int(time.time()), comment='过期时间')

    
    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id,self.user_id)