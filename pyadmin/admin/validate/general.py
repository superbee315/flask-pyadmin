'''
Created on 2021年6月23日

@author: zeng
'''
from wtforms import StringField, IntegerField, Field
from wtforms.validators import DataRequired, Length,AnyOf
from . import RequestBaseForm

class ConfigForm(RequestBaseForm):
    name = StringField('name', validators=[Length(max=30, min=3, message="请填写3到30个字符"),
                                                   DataRequired(message="变量名不能为空")])
    title = StringField('title', validators=[DataRequired(message="变量标题不能为空")])
    type = StringField('type', validators=[DataRequired(message="类型不能为空"), AnyOf('string,text,editor,number,date,time,\
                                                                                      datatime,select,selects,image,images,\
                                                                                      file,files,switch,checkbox,radio,\
                                                                                      array,custom','类型错误')])
    group = StringField('group', validators=[DataRequired(message="分组不能为空")])