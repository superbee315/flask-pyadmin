'''
Created on 2021年9月6日

@author: zeng
'''
from wtforms import StringField, IntegerField, DateField, DecimalField
from wtforms.validators import DataRequired, InputRequired, NumberRange, Optional, Length, ValidationError, Email, URL
from . import RequestBaseForm

class UnitForm(RequestBaseForm):
    name = StringField('name', validators=[DataRequired(message="企业名称不能为空")])
    legalman = StringField('legalman', validators=[DataRequired(message="法人代表不能为空")])
    businessNo = StringField('business_no', validators=[DataRequired(message="工商登记号不能为空")])
    nature = IntegerField('nature', validators=[InputRequired(message="单位性质不能为空"),
                                                NumberRange(min=0,max=8,message='单位性质区间错误')])
    foundingtime = DateField('foundingtime', validators=[DataRequired(message="成立时间不能为空")])
    job = StringField('job', validators=[DataRequired(message="行业分类不能为空")])
    address = StringField('address', validators=[DataRequired(message="地址不能为空")])
    technology = IntegerField('technology',validators=[InputRequired(message="高新技术企业认证不能为空"),
                                                 NumberRange(min=0, max=1, message='高新技术企业认证区间错误')])
    regMoney = DecimalField('reg_money', validators=[InputRequired(message="注册资金不能为空"),
                                                     NumberRange(min=0, message='注册资金区间错误')])
    product = StringField('product', validators=[DataRequired(message="主要经营项目不能为空")])
    email = StringField('email', validators=[Optional(strip_whitespace=False),
                                             Email(message='请填写有效的邮箱')])
    web = StringField('email', validators=[Optional(strip_whitespace=False),
                                             URL(message='请填写有效的网址')])

class UnitDetailForm(RequestBaseForm):
    name = StringField('name', validators=[Optional(strip_whitespace=False),
                                           DataRequired(message="企业名称不能为空")])
    legalman = StringField('legalman', validators=[Optional(strip_whitespace=False),
                                                   DataRequired(message="法人代表不能为空")])
    businessNo = StringField('business_no', validators=[Optional(strip_whitespace=False),
                                                         DataRequired(message="工商登记号不能为空")])
    nature = IntegerField('nature', validators=[Optional(strip_whitespace=False),
                                                InputRequired(message="单位性质不能为空"),
                                                NumberRange(min=0, max=8, message='单位性质区间错误')])
    foundingtime = DateField('foundingtime', validators=[Optional(strip_whitespace=False),
                                                         DataRequired(message="成立时间不能为空")])
    job = StringField('job', validators=[Optional(strip_whitespace=False),
                                         DataRequired(message="行业分类不能为空")])
    address = StringField('address', validators=[Optional(strip_whitespace=False),
                                                 DataRequired(message="地址不能为空")])
    technology = IntegerField('technology', validators=[Optional(strip_whitespace=False),
                                                  InputRequired(message="高新技术企业认证不能为空"),
                                                  NumberRange(min=0, max=1, message='高新技术企业认证区间错误')])
    regMoney = DecimalField('reg_money', validators=[Optional(strip_whitespace=False),
                                                     InputRequired(message="注册资金不能为空"),
                                                     NumberRange(min=0, message='注册资金区间错误')
                                                     ])
    product = StringField('product', validators=[Optional(strip_whitespace=False),
                                                 DataRequired(message="主要经营项目不能为空")])
    email = StringField('email', validators=[Optional(strip_whitespace=False),
                                             Email(message='请填写有效的邮箱')])
    web = StringField('email', validators=[Optional(strip_whitespace=False),
                                             URL(message='请填写有效的网址')])

class GovernmentUnitForm(RequestBaseForm):
    name = StringField('name', validators=[DataRequired(message="单位名称不能为空")])
    address = StringField('address', validators=[DataRequired(message="地址不能为空")])
    web = StringField('email', validators=[Optional(strip_whitespace=False),
                                             URL(message='请填写有效的网址')])

class GovernmentUnitDetailForm(RequestBaseForm):
    name = StringField('name', validators=[Optional(strip_whitespace=False),
                                           DataRequired(message="单位名称不能为空")])
    address = StringField('address', validators=[Optional(strip_whitespace=False),
                                                 DataRequired(message="地址不能为空")])
    web = StringField('email', validators=[Optional(strip_whitespace=False),
                                             URL(message='请填写有效的网址')])


class PersonForm(RequestBaseForm):

    def family_check(self, field):
        family = eval(field.data)
        for f in family:
            if 'name' not in f: raise ValidationError('Family person must have name')
            if 'relation' not in f: raise ValidationError('Family person must have relation')
            if 'company' not in f: raise ValidationError('Family person must have company')
            if 'job' not in f: raise ValidationError('Family person must have job')
            if 'age' not in f: raise ValidationError('Family person must have age')
            if int(f['age']) < 0 or int(f['age']) > 200: raise ValidationError('年龄区间错误')

    name = StringField('name', validators=[DataRequired(message="姓名不能为空")])
    gender = IntegerField('gender', validators=[InputRequired(message="性别不能为空"),
                                                NumberRange(min=0,max=1,message='性别区间错误')])
    birthday = DateField('birthday', validators=[DataRequired(message="出生年月不能为空")])
    origin = StringField('origin', validators=[DataRequired(message="籍贯不能为空")])
    # birthplace = StringField('birthplace', validators=[DataRequired(message="出生地不能为空")])
    # cardNo = StringField('card_no', validators=[DataRequired(message="身份证号码不能为空")])
    nation = StringField('nation', validators=[DataRequired(message="民族不能为空")])
    party = IntegerField('party', validators=[InputRequired(message="政治面貌不能为空"),
                                                NumberRange(min=0,max=12,message='政治面貌区间错误')])
    # edu = StringField('edu', validators=[DataRequired(message="学历不能为空")])
    # job = StringField('job', validators=[DataRequired(message="职务不能为空")])
    # address = StringField('address', validators=[DataRequired(message="地址不能为空")])
    # mobile = StringField('mobile', validators=[DataRequired(message="手机不能为空")])
    company = StringField('company', validators=[DataRequired(message="所在单位不能为空")])
    # family = StringField('family', validators=[DataRequired(message="家庭成员不能为空"),
    #                                            family_check])

class PersonDetailForm(RequestBaseForm):

    def family_check(self, field):
        family = eval(field.data)
        for f in family:
            if 'name' not in f: raise ValidationError('Family person must have name')
            if 'relation' not in f: raise ValidationError('Family person must have relation')
            if 'company' not in f: raise ValidationError('Family person must have company')
            if 'job' not in f: raise ValidationError('Family person must have job')
            if 'age' not in f: raise ValidationError('Family person must have age')
            if int(f['age']) < 0 or int(f['age']) > 200: raise ValidationError('年龄区间错误')


    name = StringField('name', validators=[Optional(strip_whitespace=False),
                                           DataRequired(message="姓名不能为空")])
    gender = IntegerField('gender', validators=[Optional(strip_whitespace=False),
                                                InputRequired(message="性别不能为空"),
                                                NumberRange(min=0,max=1,message='性别区间错误')])
    birthday = DateField('birthday', validators=[Optional(strip_whitespace=False),
                                                   DataRequired(message="出生年月不能为空")])
    origin = StringField('origin', validators=[Optional(strip_whitespace=False),
                                               DataRequired(message="籍贯不能为空")])
    # birthplace = StringField('birthplace', validators=[Optional(strip_whitespace=False),
    #                                                    DataRequired(message="出生地不能为空")])
    # cardNo = StringField('card_no', validators=[Optional(strip_whitespace=False),
    #                                              DataRequired(message="身份证号码不能为空")])
    nation = StringField('nation', validators=[Optional(strip_whitespace=False),
                                               DataRequired(message="民族不能为空")])
    party = IntegerField('party', validators=[Optional(strip_whitespace=False),
                                              InputRequired(message="政治面貌不能为空"),
                                                NumberRange(min=0,max=12,message='政治面貌区间错误')])
    # edu = StringField('edu', validators=[Optional(strip_whitespace=False),
    #                                      DataRequired(message="学历不能为空")])
    # job = StringField('job', validators=[Optional(strip_whitespace=False),
    #                                      DataRequired(message="职务不能为空")])
    # address = StringField('address', validators=[Optional(strip_whitespace=False),
    #                                              DataRequired(message="地址不能为空")])
    # mobile = StringField('mobile', validators=[Optional(strip_whitespace=False),
    #                                            DataRequired(message="手机不能为空")])
    company = StringField('company', validators=[Optional(strip_whitespace=False),
                                                 DataRequired(message="所在单位不能为空")])
    # family = StringField('family', validators=[Optional(strip_whitespace=False),
    #                                            DataRequired(message="家庭成员不能为空"),
    #                                            family_check])

class UserForm(RequestBaseForm):
    fromId = IntegerField('from_id', validators=[InputRequired(message="关联数据不能为空")])
    duty = IntegerField('duty', validators=[InputRequired(message="职务不能为空"),
                                          NumberRange(min=0, max=5, message='职务区间错误')])
    jointime = DateField('jointime', validators=[DataRequired(message="入会时间不能为空")])
    username = StringField('username', validators=[Length(max=12, min=3, message="请填写3-12位数字、字母、下划线"),
                                                   DataRequired(message="用户名不能为空")])
    password = StringField('password', validators=[Length(max=16, min=6, message="请填写6-16位字符，不能包含空格"),
                                                   DataRequired(message="密码不能为空")])

class UserDatailForm(RequestBaseForm):
    fromId = IntegerField('from_id', validators=[Optional(strip_whitespace=False),
                                                 InputRequired(message="关联数据不能为空")])
    duty = IntegerField('duty', validators=[Optional(strip_whitespace=False),
                                          InputRequired(message="职务不能为空"),
                                          NumberRange(min=0, max=5, message='职务区间错误')])
    jointime = DateField('jointime', validators=[Optional(strip_whitespace=False),
                                                 DataRequired(message="入会时间不能为空")])
    username = StringField('username', validators=[Length(max=12, min=3, message="请填写3-12位数字、字母、下划线"),
                                                   Optional(strip_whitespace=False),
                                                   DataRequired(message="用户名不能为空")])
    password = StringField('password', validators=[Length(max=16, min=6, message="请填写6-16位字符，不能包含空格"),
                                                   Optional(strip_whitespace=False),
                                                   DataRequired(message="密码不能为空")])

