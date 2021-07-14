# coding=utf-8

from flask import request
from flask_wtf import Form

class RequestBaseForm(Form):
    # 解析请求参数
    def __init__(self, *args, **kwargs):
        # todo 做个处理,如果请求进来的请求时form参数则else,如果是json则进行下列操作
        if "application/json" in request.headers.get("Content-Type"):
            data = request.get_json(silent=True)
        else:
            # application/x-www-form-urlencoded    or    multipart/form-data
            data = request.form.to_dict()
            
        args = request.args.to_dict()
        
        super(RequestBaseForm, self).__init__(data=data, *args, **kwargs)

    # 对验证错误的参数抛出异常
    def validate_for_api(self):
        valid = super(RequestBaseForm, self).validate()
        if not valid:
            # todo 这里做一个返回,code,msg,data 错误返回  ???
            
            raise JsonValidateErr(msg=self.errors)
            # pass
            # return False

        return self
    
    
    
# class jsonValidateErr(BaseException):
class JsonValidateErr(Exception):
    """this is user's Exception for check the length of name """

    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        return str(self.msg)
    