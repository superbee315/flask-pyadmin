'''
Created on 2021年5月6日

@author: 40215
'''
from flask import Flask
from .extensions import db, login_manager, api, cors, csrf
from pyadmin.admin import bp_admin, bp_general
from dotenv import load_dotenv

def create_app():
    load_dotenv(verbose=True)
    app = Flask(__name__.split('.')[0])
    # 加载配置
    app.config.from_object('pyadmin.config.DevelopmentConfig')
    
    register_extensions(app)
    register_blueprints(app)
    return app


def register_extensions(app):
    """ Register Flask extensions. """
    db.init_app(app)
    login_manager.init_app(app)
    api.init_app(app)
    cors.init_app(app)      # 跨域配置
    csrf.init_app(app)      # 跨域攻击


def register_blueprints(app):
    """ Register Flask BluePrints """
    app.register_blueprint(bp_admin)
    app.register_blueprint(bp_general)
