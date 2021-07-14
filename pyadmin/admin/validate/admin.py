'''
Created on 2021年6月7日

@author: 40215
'''
from wtforms import StringField, IntegerField, Field
from wtforms.validators import DataRequired, Length, Optional, NumberRange, InputRequired, Email
from . import RequestBaseForm

class LoginForm(RequestBaseForm):
    username = StringField('username', validators=[Length(max=20, min=1, message="用户名长度需在1-20个字符间"),
                                                   DataRequired(message="用户名不能为空")])
    password = StringField('password', validators=[Length(max=20, min=3, message="密码长度需在3-20个字符间"),
                                                   DataRequired(message="密码不能为空")])
    
class RegisterForm(LoginForm):
    nickname = StringField('nickname', validators=[Length(max=50, min=1, message="password长度需在1-50个字符间"), DataRequired()])
    salt = StringField('salt', validators=[Length(max=50, min=3, message="salt长度需在3-50个字符间"), DataRequired()])
    avatar = StringField('avatar', validators=[Length(max=128, message="头像格式错误"), DataRequired()])
    email = StringField('email', validators=[Length(max=128, message="email格式错误"), DataRequired()])

class AdminForm(RequestBaseForm):
    username = StringField('username', validators=[Length(max=12, min=3, message="请填写3-12位数字、字母、下划线"),
                                                   DataRequired(message="用户名不能为空")])
    password = StringField('password', validators=[Length(max=16, min=6, message="请填写6-16位字符，不能包含空格"),
                                                   DataRequired(message="密码不能为空")])
    groups = Field('groups', validators=[DataRequired(message="所属组别不能为空")])
    email = StringField('email', validators=[DataRequired(message="Email不能为空"), Email(message='请填写有效的邮箱')])
    nickname = StringField('nickname', validators=[DataRequired(message="昵称不能为空")])

class AdminDetailForm(RequestBaseForm):
    username = StringField('username', validators=[Length(max=12, min=3, message="请填写3-12位数字、字母、下划线"),
                                                   Optional(strip_whitespace=False),
                                                   DataRequired(message="用户名不能为空")])
    password = StringField('password', validators=[Length(max=16, min=6, message="请填写6-16位字符，不能包含空格"),
                                                   Optional(strip_whitespace=False),
                                                   DataRequired(message="密码不能为空")])
    groups = Field('groups', validators=[Optional(strip_whitespace=False),
                                         DataRequired(message="所属组别不能为空")])
    email = StringField('email', validators=[Optional(strip_whitespace=False),
                                             Email(message='请填写有效的邮箱'),
                                             DataRequired(message="Email不能为空")])
    nickname = StringField('nickname', validators=[Optional(strip_whitespace=False),
                                                   DataRequired(message="昵称不能为空")])

class GroupForm(RequestBaseForm):
    name = StringField('name', validators=[DataRequired(message="名称不能为空")])
    pid = IntegerField('pid', validators=[InputRequired(message="父级ID不能为空"),
                                          NumberRange(min=1,message='父级ID需大于0')])

class GroupDetailForm(RequestBaseForm):
    name = StringField('name', validators=[Optional(strip_whitespace=False),
                                           DataRequired(message="名称不能为空")])
    pid = IntegerField('pid', validators=[Optional(strip_whitespace=False),
                                          InputRequired(message="父级ID不能为空"),
                                          NumberRange(min=1,message='父级ID需大于0')])

class RuleForm(RequestBaseForm):
    name = StringField('name', validators=[DataRequired(message="规则不能为空")])
    title = StringField('title', validators=[DataRequired(message="标题不能为空")])
    weigh = IntegerField('weigh', validators=[InputRequired(message="权重不能为空")])

class RuleDetailForm(RequestBaseForm):
    name = StringField('name', validators=[Optional(strip_whitespace=False),
                                           DataRequired(message="规则不能为空")])
    title = StringField('title', validators=[Optional(strip_whitespace=False),
                                             DataRequired(message="标题不能为空")])
    weigh = IntegerField('weigh', validators=[Optional(strip_whitespace=False),
                                              InputRequired(message="权重不能为空")])

