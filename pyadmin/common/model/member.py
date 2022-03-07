# coding=utf-8
''''
Created on 2021年9月6日

@author: zeng
'''
import hashlib
from pyadmin.extensions import db
from .base import PkModel
from . import CurrentTime
from werkzeug.security import gen_salt
from flask_login import UserMixin
import time, enum


class UserEnum(enum.Enum):
    '''
    用户状态
    '''
    normal, locked = 'normal', 'locked'


class GenderEnum(enum.Enum):
    '''
    性别
    '''
    female, male = 0, 1


class TypeEnum(enum.Enum):
    '''
    menu为菜单,file为权限节点
    '''
    menu, file = 'menu', 'file'

class Unit(PkModel):
    '''
    单位管理模型
    '''
    __tablename__ = "py_unit"

    name = db.Column('name', db.String(length=255), default='', server_default='', comment="企业名称")
    legalman = db.Column('legalman', db.String(length=64), default='', server_default='', comment="法人代表")
    businessNo = db.Column('business_no', db.String(length=64), default='', server_default='', comment="工商登记号")
    centralTax = db.Column('central_tax', db.String(length=64), default='', server_default='', comment="国税税号")
    landTax = db.Column('land_tax', db.String(length=64), default='', server_default='', comment="地税税号")
    nature = db.Column('nature', db.Integer, comment='单位性质', index=True, default=1)
    foundingtime = db.Column('foundingtime', db.Date, comment='成立时间', index=True, default=0)
    job = db.Column('job', db.String(length=255), default='', server_default='', comment="行业分类")
    jobnum = db.Column('jobnum', db.Integer, comment='职工人数', index=True, default=0)
    partynum = db.Column('partynum', db.Integer, comment='党员数', index=True, default=0)
    tel = db.Column('tel', db.String(length=64), default='', server_default='', comment="电话")
    fax = db.Column('fax', db.String(length=64), default='', server_default='', comment="传真")
    zipcode = db.Column('zipcode', db.String(length=64), default='', server_default='', comment="邮编")
    address = db.Column('address', db.String(length=255), default='', server_default='', comment="地址")
    culturalnum = db.Column('culturalnum', db.Integer, comment='大专以上文化人数', index=True, default=0)
    laidnum = db.Column('laidnum', db.Integer, comment='安置下岗人数', index=True, default=0)
    partyCase = db.Column('party_case', db.String(length=255), default='', server_default='', comment="党、团工会情况")
    web = db.Column('web', db.String(length=255), default='', server_default='', comment="网站")
    email = db.Column('email', db.String(length=64), default='', server_default='', comment="电子邮箱")
    technology = db.Column('technology', db.Integer, comment='高新技术企业认证', index=True, default=0)
    technologyDept = db.Column('technology_dept', db.String(length=255), default='', server_default='', comment="高新技术企业认证认证部门")
    foreignTrade = db.Column('foreign_trade', db.Integer, comment='外贸自营进出口权', index=True, default=0)
    foreignTradeDept = db.Column('foreign_trade_dept', db.String(length=255), default='', server_default='', comment="外贸自营进出口权批准部门")
    quality = db.Column('quality', db.Integer, comment='质量管理、质量保证系列认证标准', index=True, default=0)
    qualityDept = db.Column('quality_dept', db.String(length=255), default='', server_default='', comment="质量管理、质量保证系列认证标准认证部门")
    regMoney = db.Column('reg_money', db.Float, comment='注册资金（万元）', index=True, default=0)
    money = db.Column('money', db.Float, comment='资产（万元）', index=True, default=0)
    ownerMoney = db.Column('owner_money', db.Float, comment='所有者权益（万元）', index=True, default=0)
    sellMoney = db.Column('sell_money', db.Float, comment='销售收入（万元）', index=True, default=0)
    product = db.Column('product', db.String(length=255), default='', server_default='', comment="主要经营项目")
    level = db.Column('level', db.String(length=128), default='', server_default='', comment="行政级别")
    area = db.Column('area', db.String(length=128), default='', server_default='', comment="所属地区")
    parent = db.Column('parent', db.String(length=128), default='', server_default='', comment="上级单位")
    createtime = db.Column('createtime', db.Integer, default=CurrentTime.now_time(), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=CurrentTime.now_time(), comment='更新时间')
    deletetime = db.Column('deletetime', db.Integer, comment='删除时间', index=True, default=0)

    def __repr__(self):
        return 'unit: {id: %s, name: %s, foreignTrade: %s}' % (self.id, self.name, self.foreignTrade)

class Person(PkModel):
    '''
    个人管理模型
    '''
    __tablename__ = "py_person"

    name = db.Column('name', db.String(length=64), default='', server_default='', comment="姓名")
    gender = db.Column('gender', db.Integer, comment='性别', index=True, default=0)
    birthday = db.Column('birthday', db.Date, comment='出生年月', index=True, default='1111-11-11')
    origin = db.Column('origin', db.String(length=255), default='', server_default='', comment="籍贯")
    birthplace = db.Column('birthplace', db.String(length=255), default='', server_default='', comment="出生地")
    cardNo = db.Column('card_no', db.String(length=64), default='', server_default='', comment="身份证号码")
    nation = db.Column('nation', db.String(length=64), default='', server_default='', comment="民族")
    party = db.Column('party', db.Integer, comment='政治面貌', index=True, default=0)
    edu = db.Column('edu', db.String(length=64), default='', server_default='', comment="学历")
    title = db.Column('title', db.String(length=64), default='', server_default='', comment="职称")
    job = db.Column('job', db.String(length=64), default='', server_default='', comment="职务")
    address = db.Column('address', db.String(length=255), default='', server_default='', comment="地址")
    zipcode = db.Column('zipcode', db.String(length=64), default='', server_default='', comment="邮编")
    tel = db.Column('tel', db.String(length=64), default='', server_default='', comment="电话")
    mobile = db.Column('mobile', db.String(length=64), default='', server_default='', comment="手机")
    old = db.Column('old', db.String(length=128), default='', server_default='', comment="办企业前工作单位")
    peopleJob = db.Column('people_job', db.String(length=64), default='', server_default='', comment="人大职务")
    cppccJob = db.Column('cppcc_job', db.String(length=64), default='', server_default='', comment="政协职务")
    socialJob = db.Column('social_job', db.String(length=64), default='', server_default='', comment="社会职务")
    info = db.Column('info', db.String(length=255), default='', server_default='', comment="本人简历")
    company = db.Column('company', db.String(length=128), default='', server_default='', comment="所在单位")
    state = db.Column('state', db.Integer, comment='状态', index=True, default=0)
    createtime = db.Column('createtime', db.Integer, default=CurrentTime.now_time(), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=CurrentTime.now_time(), comment='更新时间')
    deletetime = db.Column('deletetime', db.Integer, comment='删除时间', index=True, default=0)

    def __repr__(self):
        return 'person: {id: %s,name: %s}' % (self.id, self.name)


class Family(PkModel):
    '''

    '''
    __tablename__ = "py_family"

    pid = db.Column('pid', db.Integer, comment='关联个人id', index=True, default=0)
    relation = db.Column('relation', db.String(length=64), default='', server_default='', comment="关系")
    name = db.Column('name', db.String(length=64), default='', server_default='', comment="姓名")
    age = db.Column('age', db.Integer, comment='年龄', index=True, default=0)
    company = db.Column('company', db.String(length=128), default='', server_default='', comment="工作单位")
    job = db.Column('job', db.String(length=64), default='', server_default='', comment="职务")
    createtime = db.Column('createtime', db.Integer, default=CurrentTime.now_time(), comment='创建时间')

    def __repr__(self):
        return 'family: {id: %s,name: %s}' % (self.id, self.name)

class User(PkModel):
    '''
    会员管理模型
    '''
    __tablename__ = "py_user"

    group_id = db.Column(db.Integer, default=0, nullable=False, comment='组别ID')
    username = db.Column(db.String(length=32), nullable=False, unique=True, server_default='', comment="用户名")
    nickname = db.Column(db.String(length=50), nullable=False, server_default='', comment="昵称")
    pwd = db.Column('password', db.String(length=255), nullable=False, server_default='', comment="密码")
    salt = db.Column(db.String(length=30), nullable=False, server_default='', comment="密码盐")
    avatar = db.Column(db.String(length=128), nullable=False, server_default='', comment='头像')
    email = db.Column(db.String(length=128), nullable=False, server_default='', comment='邮箱')
    tel = db.Column('tel', db.String(length=64), default='', server_default='', comment="电话")
    level = db.Column(db.Integer, default=0, nullable=False, comment='等级')
    birthday = db.Column(db.Date, default='1111-11-11', comment='生日')
    bio = db.Column(db.String(length=100), default='', comment='格言')
    money = db.Column(db.DECIMAL(10, 2), nullable=False, default=0.00, comment='余额')
    score = db.Column(db.Integer, nullable=False, default=0, comment='积分')
    succession = db.Column(db.Integer, nullable=False, default=1, comment='连续登录天数')
    maxsuccession = db.Column(db.Integer, nullable=False, default=1, comment='最大连续登录天数')
    gender = db.Column(db.Enum(GenderEnum), default='female', comment='性别')
    mobile = db.Column(db.String(length=11), nullable=False, server_default='', comment='手机号')
    loginip = db.Column(db.String(length=50), nullable=False, server_default='', comment='登录IP')
    logintime = db.Column(db.Integer, default=CurrentTime.now_time(), comment='上次登录时间')
    loginfailure = db.Column(db.Integer, default=0,nullable=False, comment='失败次数')
    joinip = db.Column(db.String(length=50), nullable=False, server_default='', comment='加入IP')
    token = db.Column(db.String(length=50), nullable=False, server_default='', comment='Token')
    status = db.Column(db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')
    type = db.Column('type', db.Integer, comment='1为单位，2为个人', index=True, default=1)
    fromId = db.Column('from_id', db.Integer, comment='该会员来源数据id', index=True, default=0)
    duty = db.Column('duty', db.Integer, comment='职务', index=True, default=0)
    jointime = db.Column('jointime', db.Date, comment='入会时间', index=True, default=0)
    nowDues = db.Column('now_dues', db.Integer, comment='当年会费 0未缴纳 1已缴纳', index=True, default=0)
    lastDues = db.Column('last_dues', db.Integer, comment='去年会费 0未缴纳 1已缴纳', index=True, default=0)
    nowMeeting = db.Column('now_meeting', db.Integer, comment='当年参会率', index=True, default=0)
    lastMeeting = db.Column('last_meeting', db.Integer, comment='去年参会率', index=True, default=0)
    isCheck = db.Column('is_check', db.Integer, comment='是否审核通过 0未通过 1通过', index=True, default=0)
    createtime = db.Column('createtime', db.Integer, default=CurrentTime.now_time(), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=CurrentTime.now_time(), comment='更新时间')
    deletetime = db.Column('deletetime', db.Integer, comment='删除时间', index=True, default=0)
    verification = db.Column(db.String(length=255), default='', comment="验证")

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute!")

    @staticmethod
    def query_by_username(username):
        return User.query.filter(User.username == username).first()

    @password.setter
    def password(self, password: str):
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

    def verify_password(self, password: str):
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

    def __repr__(self):
        return 'user: {id: %s,username: %s}' % (self.id, self.username)

class UserCheck(PkModel):
    '''
    会员审核模型
    '''
    __tablename__ = "py_user_check"

    uid = db.Column('uid', db.Integer, comment='会员id', index=True, default=0)
    reason = db.Column('reason', db.String(length=255), default='', server_default='', comment="原因")
    status = db.Column('status', db.Integer, comment='审核状态 0未通过 1通过', index=True, default=0)
    createtime = db.Column('createtime', db.Integer, default=CurrentTime.now_time(), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=CurrentTime.now_time(), comment='更新时间')
    deletetime = db.Column('deletetime', db.Integer, comment='删除时间', index=True, default=0)

    def __repr__(self):
        return 'User_check: {id: %s,uid: %s,reason: %s}' % (self.id, self.uid, self.reason)


class UserGroup(PkModel, UserMixin):
    '''
    会员用户组模型
    '''
    __tablename__ = "py_user_group"

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column('name', db.String(length=50), default='', server_default='', comment='组名')
    rules = db.Column('rules', db.Text, nullable=False, comment='权限节点', default='')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=int(time.time()), comment='更新时间')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')

    def __repr__(self):
        return 'User_group: {id: %s,%s}' % (self.id, self.username)


class UserMoneyLog(PkModel, UserMixin):
    '''
    会员余额日志模型
    '''
    __tablename__ = "py_user_money_log"

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column('user_id', db.INTEGER(), default=0, nullable=False, comment='会员ID')
    money = db.Column('money', db.DECIMAL(10, 2), default=0.00, nullable=False, comment='变更余额')
    before = db.Column('before', db.DECIMAL(10, 2), default=0.00, nullable=False, comment='变更前余额')
    after = db.Column('after', db.DECIMAL(10, 2), default=0.00, nullable=False, comment='变更后余额')
    memo = db.Column('memo', db.String(length=255), default='', server_default='', comment='备注')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')

    def __repr__(self):
        return 'user_money_log: {id: %s,%s}' % (self.id, self.user_id)


class UserRule(PkModel, UserMixin):
    '''
    会员菜单规则模型
    '''
    __tablename__ = "py_user_rule"

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    pid = db.Column('pid', db.Integer, comment='父ID', default=0)
    name = db.Column('name', db.String(length=50), default='', server_default='', comment='名称')
    title = db.Column('title', db.String(length=50), default='', server_default='', comment='标题')
    remark = db.Column('remark', db.String(length=100), comment='备注', default='')
    ismenu = db.Column('ismenu', db.Integer, default=1, comment='是否菜单')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    updatetime = db.Column('updatetime', db.Integer, default=int(time.time()), comment='更新时间')
    weigh = db.Column('weigh', db.Integer, default=0, comment='权重')
    status = db.Column('status', db.Enum(UserEnum), default='normal', server_default='normal', comment='状态')

    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id, self.name)


class UserScoreLog(PkModel, UserMixin):
    '''
    会员积分日志模型
    '''
    __tablename__ = "py_user_score_log"

    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column('user_id', db.INTEGER(), default=0, nullable=False, comment='会员ID')
    score = db.Column('score', db.Integer, default='0', nullable=False, comment='变更积分')
    before = db.Column('before', db.Integer, default='0', nullable=False, comment='变更前积分')
    after = db.Column('after', db.Integer, default='0', nullable=False, comment='变更后积分')
    memo = db.Column('memo', db.String(length=255), default='', server_default='', comment='备注')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')

    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id, self.user_id)


class UserToken(PkModel, UserMixin):
    '''
    会员登录Token模型
    '''
    __tablename__ = "py_user_token"

    token = db.Column('token', db.String(length=50), primary_key=True, nullable=False, server_default='',
                      comment='Token')
    user_id = db.Column('user_id', db.INTEGER(), default=0, nullable=False, comment='会员ID')
    createtime = db.Column('createtime', db.Integer, default=int(time.time()), comment='创建时间')
    expiretime = db.Column('expiretime', db.Integer, default=int(time.time()), comment='过期时间')

    def __repr__(self):
        return 'user_rule: {id: %s,%s}' % (self.id, self.user_id)