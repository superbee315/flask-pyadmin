"""
配置文件
Created on 2021年5月6日

@author: 40215
"""
import os

class BaseConfig():
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'some sercret words')
    # 数据库连接池
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY', 'mysql://root:root@139.186.154.72:3306/pyadmin?charset=utf8mb4')
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    # 自动提交事务
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    JWT_SECRET = os.getenv('JWT_SECRET', 'sdfdstioermvc')
    JWT_EXPIRE_DAY = 30
    #文件上传配置
    UPLOAD_FOLDER = '\\pyadmin\\public\\uploads'
    ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB


class ProductionConfig(BaseConfig):
    pass


class DevelopmentConfig(BaseConfig):
    JSON_AS_ASCII = False
    DEBUG = True
    TESTING = True
    SQLALCHEMY_ECHO = True
    WTF_CSRF_CHECK_DEFAULT = False

