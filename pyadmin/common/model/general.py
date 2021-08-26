# coding=utf-8
''''
Created on 2021年6月23日

@author: zeng
'''
from pyadmin.extensions import db
from .base import PkModel
from flask import current_app

class Config(PkModel):
    __tablename__ = "config"

    name = db.Column('name', db.String(length=30), default='', server_default='', comment="变量名")
    group = db.Column('group', db.String(length=30), default='', server_default='', comment="分组")
    title = db.Column('title', db.String(length=100), default='', server_default='', comment="变量标题")
    tip = db.Column('tip', db.String(length=100), default='', server_default='', comment="变量描述")
    type = db.Column('type', db.String(length=30), default='', server_default='', comment="类型")
    value = db.Column('value', db.Text, default='', server_default='',  comment='变量值')
    content = db.Column('content', db.Text, default='', server_default='', comment='变量字典数据')
    rule = db.Column('rule', db.String(length=100), default='', server_default='', comment="验证规则")
    extend = db.Column('extend', db.String(length=255), default='', server_default='', comment='扩展属性')

    @staticmethod
    def query_by_name(name):
        return Config.query.filter(Config.name == name).first()

    @staticmethod
    def decode(text):
        # '''
        # 将字符串解析成字典
        # :param text： 字符串
        # '''

        # contents = text.split()
        # _dict = {}
        # for content in contents:
        #     if content.find("|") != -1:
        #         item = content.split('|')
        #         _dict[item[0]] = item[1];
        # return _dict
        '''
        将字符串解析成数组字典
        :param text： 字符串
        '''
        contents = text.split()
        options = []
        for content in contents:
            if content.find("|") != -1:
                item = content.split('|')
                options.append({ "label": item[0], "value": item[1]})
        return options

    @staticmethod
    def allowed_file(filename):
        '''
        文件后缀名检查
        :param filename： 文件名
        '''
        return '.' in filename and \
               filename.rsplit('.', 1)[1] in current_app.config['ALLOWED_EXTENSIONS']

    def __repr__(self):
        return 'Config: {id: %s,name: %s,group: %s}' % (self.id, self.name, self.group)

class Attachment(PkModel):
    __tablename__ = "attachment"

    admin_id = db.Column(db.Integer, nullable=False, server_default='0', comment='管理员ID')
    user_id = db.Column(db.Integer, nullable=False, server_default='0', comment='会员ID')
    url = db.Column(db.String(length=255), default='', server_default='', comment="物理路径")
    imagewidth = db.Column(db.String(length=30), default='', server_default='', comment="宽度")
    imageheight = db.Column(db.String(length=30), default='', server_default='', comment="高度")
    imagetype = db.Column(db.String(length=30), default='', server_default='', comment="图片类型")
    imageframes = db.Column(db.Integer, nullable=False, server_default='0', comment='图片帧数')
    filesize = db.Column(db.Integer, nullable=False, server_default='0', comment='文件大小')
    mimetype = db.Column(db.String(length=100), default='', server_default='', comment="mime类型")
    extparam = db.Column(db.String(length=255), default='', server_default='', comment='透传数据')
    createtime = db.Column(db.Integer, nullable=False, server_default='0', comment='创建日期')
    updatetime = db.Column(db.Integer, nullable=False, server_default='0', comment='更新时间')
    uploadtime = db.Column(db.Integer, nullable=False, server_default='0', comment='上传时间')
    storage = db.Column(db.String(length=100), default='', server_default='', comment="存储位置")
    sha1 = db.Column(db.String(length=40), default='', server_default='', comment="文件 sha1编码")

    @staticmethod
    def query_by_sha1(hash):
        return Config.query.filter(Attachment.sha1 == hash).first()

    def __repr__(self):
        return 'Attachment: {id: %s,url: %s}' % (self.id, self.url)
