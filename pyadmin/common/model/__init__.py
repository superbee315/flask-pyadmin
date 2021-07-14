import enum 
import time as _time
from pyadmin.extensions import db
from datetime import date, time, datetime as cdatetime
from sqlalchemy import DateTime, Numeric, Date, Time
from sqlalchemy.orm.query import Query
from werkzeug.local import LocalProxy
from pymysql.converters import convert_datetime

def queryToDict(models):
    '''
    sqlAchemy查询到的object转成array
    :param models
    '''
    if not models:
        return models    
    
    if isinstance(models, list):
        if isinstance(models[0], db.Model):
            lst = []
            for model in models:
                gen = model_to_dict(model)
                dit = dict((g[0], g[1]) for g in gen)
                lst.append(dit)
            return lst    
        else: 
            res = result_to_dict(models)    
            return res    
    else:
        if isinstance(models, db.Model):
            gen = model_to_dict(models)
            dit = dict((g[0],g[1]) for g in gen)
            return dit
        elif isinstance(models, LocalProxy):
            res = {}
            for k, v in models.__dict__.items():
                if k[0] == '_': continue
                res[k] = v
            return res
        else:
            res = dict(zip(models.keys(), models))
            
            return res
              
#当结果为result对象列表时，result有key()方法                
def result_to_dict(results):
    res = [dict(zip(r.keys(), r) for r in results)]
    #这里r为一个字典，对象传递直接改变字典属性
    for r in res:
        pass
    return res
                
def model_to_dict(model):
    for col in model.__table__.columns:
        _name = col.name
        _type = col.type
        
        if not hasattr(model, _name): continue
        _val = getattr(model, col.name)
        
        if isinstance(_type, DateTime):
            value = convert_datetime(_val)
        elif isinstance(_type, Numeric):
            value = float(_val)
        elif isinstance(_val, enum.Enum):
            value = _val.value
        else:
            value = _val    # 判断枚举
            
        yield (_name, value)    
        
def find_datetime(value):
    for v in value:
        if (isinstance(value[v], cdatetime)):
            value[v] = convert_datetime(value[v])   #这里原理类似，修改的字典对象，不用返回即可修改        
            
def convert_datetime(value):
    if value:
        if isinstance(value, (DateTime, cdatetime)):
            return value.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(value, (date, Date)):
            return value.strftime("%Y-%m-%d")
        elif(isinstance(value,(Time,time))):
            return value.strftime("%H:%M:%S")
    else:
        return ""

class CurrentTime():
    '''
    获取当前时间
    '''
    def now_time(self):
        return int(_time.time())