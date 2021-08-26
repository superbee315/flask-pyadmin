'''
Created on 2021年5月6日

@author: 40215
'''
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_cors import CORS
from flask_wtf import CSRFProtect

db = SQLAlchemy()
api = Api()
cors = CORS()
csrf = CSRFProtect()