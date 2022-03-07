import ast

from flask import request

# from pyadmin.app import db
from pyadmin.common.model import queryToDict, sqlToCount, cursorToDict, dictToSql
from pyadmin.common.model.member import *
from pyadmin.admin.validate.member import *
from .. import Backend, access_view, login_required, admin

@admin.resource('/unit', endpoint='unit')
class UnitList(Backend):

    def __init__(self):
        super(UnitList, self).__init__()
        self.model = Unit

    @login_required
    @access_view
    def get(self):
        '''
        获取单位列表
        '''
        try:
            order, offset, limit, where = self.buildparam()

            count = self.model.query.filter(self.model.deletetime==0).filter(*where).count()

            rows = self.model.query. \
                filter(self.model.deletetime==0). \
                filter(*where). \
                order_by(order). \
                offset(offset). \
                limit(limit). \
                all()
            
            rows = queryToDict(rows)

            return self.success(data={'list': rows, 'count': count})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加单位
        '''
        try:
            data = request.form.to_dict()
            if 'nature' in data and int(data['nature']) == 0:
                form = GovernmentUnitForm(meta={'csrf': False})
            else:
                form = UnitForm(meta={'csrf': False})
            if form.validate_for_api():
                self.model.create(**data)
                db.session.commit()
                return self.success(msg='Operation completed')

        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self):
        '''
        批量删除单位
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            rows = self.model.query.filter(self.model.id.in_(ids)).all()
            for row in rows:
                userRow = User.query.filter(User.fromId == row.id, User.type == 1, User.deletetime == 0).first()
                if userRow:
                    return self.error(msg='You can not delete unit that contact a user')
                row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/unit/<int:_id>',strict_slashes=False)
class UnitDetail(Backend):

    def __init__(self):
        super(UnitDetail, self).__init__()
        self.model = Unit

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取单位信息
        :param _id: 单位id
        '''
        try:

            row = self.model.query.filter(self.model.id == _id, self.model.deletetime==0).first()
            if not row: return self.error(msg='No Results were found')

            return self.success(data={'row': queryToDict(row)})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self, _id):
        '''
        修改单位
        :param _id: 单位id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0).first()
            if not row: return self.error(msg='No Results were found')
            data = request.form.to_dict()
            if ('nature' not in data and int(row.nature) == 0) or ('nature' in data and data['nature'] == 0):
                form = GovernmentUnitDetailForm(meta={'csrf': False})
            else:
                form = UnitDetailForm(meta={'csrf': False})
            if form.validate_for_api():
                row.update(**data)
                db.session.commit()
                return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self, _id):
        '''
        删除单位
        :param _id: 单位id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime==0).first()
            if not row: return self.error(msg='No Results were found')
            userRow = User.query.filter(User.fromId == _id, User.type == 1, User.deletetime == 0).first()
            # 检测是否关联会员
            if userRow: return self.error(msg='You can not delete unit that contact a user')
            row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/person', endpoint='person')
class PersonList(Backend):

    def __init__(self):
        super(PersonList, self).__init__()
        self.model = Person

    @login_required
    @access_view
    def get(self):
        '''
        获取个人列表
        '''
        try:
            order, offset, limit, where = self.buildparam()

            count = self.model.query.filter(self.model.deletetime == 0, self.model.id > 0).filter(*where).count()

            rows = self.model.query. \
                filter(self.model.deletetime == 0, self.model.id > 0). \
                filter(*where). \
                order_by(order). \
                offset(offset). \
                limit(limit). \
                all()

            rows = queryToDict(rows)

            return self.success(data={'list': rows, 'count': count})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加个人
        '''
        try:

            form = PersonForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()
                family = request.form.get("family")

                # 必须添加至少一个家庭成员
                # if not family: return self.error(msg='Must have a family person')

                person = self.model.create(**data)
                db.session.flush()
                pid = person.id

                if family:
                    family = eval(family)
                    for f in family:
                        f['pid'] = pid
                        Family.create(**f)

                db.session.commit()
                return self.success(msg='Operation completed')

        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self):
        '''
        批量删除个人
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            rows = self.model.query.filter(self.model.id.in_(ids), self.model.id > 0).all()
            for row in rows:
                userRow = User.query.filter(User.fromId == row.id, User.type == 2,User.deletetime == 0).first()
                if userRow: return self.error(msg='You can not delete unit that contact a user')
                row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/person/<int:_id>',strict_slashes=False)
class PersonDetail(Backend):

    def __init__(self):
        super(PersonDetail, self).__init__()
        self.model = Person

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取个人信息
        :param _id: 个人id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime==0).first()
            if not row: return self.error(msg='No Results were found')

            familyList = Family.query.filter(Family.pid == _id).all()

            row = queryToDict(row)
            row['family'] = queryToDict(familyList)

            return self.success(data={'row': row})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self, _id):
        '''
        修改个人
        :param _id: 个人id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0, self.model.id > 0).first()
            if not row: return self.error(msg='No Results were found')
            form = PersonDetailForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()
                row.update(**data)
                family = request.form.get('family')
                if family:
                    family = eval(family)
                    if '' in family: return self.error(msg='Must have a family person')
                    # 先移除所有家庭成员
                    Family.query.filter(Family.pid == _id).delete()
                    # 再重新添加修改后的家庭成员
                    for f in family:
                        f['pid'] = _id
                        Family.create(**f)

                db.session.commit()
                return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self, _id):
        '''
        删除个人
        :param _id: 个人id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0, self.model.id > 0).first()
            if not row: return self.error(msg='No Results were found')
            # 检测是否关联会员
            userRow = User.query.filter(User.fromId == _id, User.type == 2, User.deletetime == 0).first()
            if userRow: return self.error(msg='You can not delete person that contact a user')
            row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/user', endpoint='user')
class UserList(Backend):

    def __init__(self):
        super(UserList, self).__init__()
        self.model = User

    @login_required
    @access_view
    def get(self):
        '''
        获取会员列表
        '''
        try:
            other = request.args.get('other', False)
            isother = '' if other else ' and user.`id` > 0 '
            order, offset, limit, where = self.buildparam(True)
            field_dict = {'id': 'user.`id`', 'type': 'user.`type`', 'duty': 'user.`duty`', 'jointime': 'user.`jointime`','nowdues': 'user.`now_dues`',
                          'lastdues': 'user.`last_dues`', 'nowmeeting': 'user.`now_meeting`', 'lastmeeting': 'user.`last_meeting`', 'ischeck': 'user.`is_check`'}
            select = dictToSql(field_dict)
            totalsql = "{},(CASE WHEN user.type = '1' THEN unit.name else person.name END) AS name FROM py_user as user " \
                  "LEFT JOIN py_unit as unit ON user.from_id = unit.id " \
                  "LEFT JOIN py_person as person ON user.from_id = person.id " \
                  "WHERE user.`deletetime` = 0 {} " \
                  "{} " \
                  "ORDER BY {}".format(select, isother, where, order)
            conuntsql = 'SELECT COUNT(*) FROM ({}) AS s'.format(totalsql)
            count = sqlToCount(conuntsql)
            sql = "{} LIMIT {} OFFSET {}".format(totalsql, limit, offset)
            sql = sql.replace('\"', '')
            cursor = db.session.execute(sql)
            _list = list(field_dict.keys())
            _list.append('name')
            rows = cursorToDict(cursor, _list)
            return self.success(data={'list': rows, 'count': count})

        # count = self.model.query.filter(self.model.deletetime == 0, self.model.id > 0).filter(*where).count()
        #
        # rows = self.model.query. \
        #     filter(self.model.deletetime == 0, self.model.id > 0). \
        #     filter(*where). \
        #     order_by(order). \
        #     offset(offset). \
        #     limit(limit). \
        #     all()
        #
        # personIds = []
        # unitIds = []
        # personUser = []
        # unitUser = []
        #
        # for row in rows:
        #     if row.type == 2: personIds.append(row.fromId)
        #     if row.type == 1: unitIds.append(row.fromId)
        #
        # if personIds:
        #     personList = Person.query.filter(Person.deletetime == 0, Person.id.in_(personIds)).all()
        #     personUser = {person.id: person.name for person in personList}
        #
        # if unitIds:
        #     unitList = Unit.query.filter(Unit.deletetime == 0, Unit.id.in_(unitIds)).all()
        #     unitUser = {unit.id: unit.name for unit in unitList}
        #
        # nowdues = Bill.query.filter(Bill.typeId == 0 , Bill.year == datetime.datetime.today().year).all()
        # nowBillUser = []
        # for nowdue in nowdues:
        #     nowBillUser.append(nowdue.userId)
        #
        # lastdues = Bill.query.filter(Bill.typeId == 0 , Bill.year == datetime.datetime.today().year - 1).all()
        # lastBillUser = []
        # for lastdue in lastdues:
        #     lastBillUser.append(lastdue.userId)
        #
        # meetings = Meeting.query.filter(Meeting.status == 1, Meeting.deletetime == 0).all()
        # nowmeeting = []
        # lastmeeting = []
        # for meeting in meetings:
        #     if int(time.strftime("%Y", time.localtime(meeting.endtime))) == datetime.datetime.today().year:
        #         nowmeeting.append(meeting.id)
        #     if int(time.strftime("%Y", time.localtime(meeting.endtime))) == datetime.datetime.today().year - 1:
        #         lastmeeting.append(meeting.id)
        #
        # actuals = Actual.query.filter(Actual.type == 0).all()
        # nowUserCount = {}
        # lastUserCount = {}
        # nowcount = 0
        # lastcount = 0
        # for actual in actuals:
        #     if actual.rid in nowmeeting:
        #         if actual.uid not in nowUserCount:
        #             nowUserCount[actual.uid] = 0
        #         nowUserCount[actual.uid] += 1
        #         nowcount += 1
        #     if actual.rid in lastmeeting:
        #         if actual.uid not in lastUserCount:
        #             lastUserCount[actual.uid] = 0
        #         lastUserCount[actual.uid] += 1
        #         lastcount += 1
        #
        # rows = queryToDict(rows)
        # for row in rows:
        #     if row['type'] == 2: row['name'] = personUser[row['fromId']] if row['fromId'] in personUser else ''
        #     if row['type'] == 1: row['name'] = unitUser[row['fromId']] if row['fromId'] in unitUser else ''
        #     row['nowdues'] = '已缴纳' if row['id'] in nowBillUser else '未缴纳'
        #     row['lastdues'] = '已缴纳' if row['id'] in lastBillUser else '未缴纳'
        #     row['nowmeeting'] = "%.f%%" % (nowUserCount[row['id']] / nowcount * 100) if (nowcount != 0 and row['id'] in nowUserCount) else '0%'
        #     row['lastmeeting'] = "%.f%%" % (lastUserCount[row['id']] / lastcount * 100) if (lastcount != 0 and row['id'] in lastUserCount) else '0%'
        #
        # return self.success(data={'list': rows, 'count': count})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加会员
        '''
        try:
            form = UserForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()
                tel, name = '', ''
                if int(data['type']) == 2:
                    personRow = Person.query.filter(Person.id == data['fromId'], Person.deletetime == 0).first()
                    name = personRow.name if personRow else ''
                    tel = personRow.tel if personRow else ''
                if int(data['type']) == 1:
                    unitRow = Unit.query.filter(Unit.id == data['fromId'], Unit.deletetime == 0).first()
                    name = unitRow.name if unitRow else ''
                    tel = unitRow.tel if unitRow else ''
                # exist = self.model.query.filter(self.model.tel == tel).first()
                # if exist: return self.error(msg='Tel exist')
                data['nickname'], data['tel'] = name, tel
                user = self.model.create(**data)
                db.session.flush()
                if 'source' in data:
                    if data['source'] == 'bill':
                        reason = '从账目管理直接添加'
                    elif data['source'] == 'department':
                        reason = '从部门设置直接添加'
                    elif data['source'] == 'meeting':
                        reason = '从会员管理直接添加'
                    elif data['source'] == 'activity':
                        reason = '从活动管理直接添加'
                    else:
                        reason = ''
                else:
                    reason = ''
                checkData = {'uid': user.id, 'status': data['isCheck'], 'reason': reason}
                UserCheck.create(**checkData)

                db.session.commit()
                return self.success(msg='Operation completed')

        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self):
        '''
        批量删除会员
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            rows = self.model.query.filter(self.model.id.in_(ids), self.model.id > 0).all()
            for row in rows:
                # 移除所有审核信息
                UserCheck.query.filter(UserCheck.uid == row.id).delete()
                row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/user/<int:_id>', strict_slashes=False)
class UserDetail(Backend):

    def __init__(self):
        super(UserDetail, self).__init__()
        self.model = User

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取会员信息
        :param _id: 单位id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0).first()
            if not row: return self.error(msg='No Results were found')
            if row.type == 2:
                personRow = Person.query.filter(Person.id == row.fromId, Person.deletetime == 0).first()
                name = personRow.name if personRow else ''
            if row.type == 1:
                unitRow = Unit.query.filter(Unit.id == row.fromId, Unit.deletetime == 0).first()
                name = unitRow.name if unitRow else ''

            row = queryToDict(row)
            row['name'] = name
            return self.success(data={'row': row})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self, _id):
        '''
        修改会员
        :param _id: 会员id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0, self.model.id > 0).first()
            if not row: return self.error(msg='No Results were found')
            form = UserDatailForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()
                row.update(**data)
                if 'isCheck' in data and 'reason' in data:
                    checkData = {'uid': _id, 'status': data['isCheck'], 'reason': data['reason']}
                    UserCheck.create(**checkData)
                db.session.commit()
                return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self, _id):
        '''
        删除会员
        :param _id: 会员id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0, self.model.id > 0).first()
            if not row: return self.error(msg='No Results were found')
            # 移除所有审核信息
            checkRows = UserCheck.query.filter(UserCheck.uid == _id).all()
            for checkRow in checkRows:
                checkRow.delete()
            row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/check', endpoint='check')
class CheckList(Backend):

    def __init__(self):
        super(CheckList, self).__init__()
        self.model = UserCheck

    @login_required
    @access_view
    def get(self):
        '''
        获取审核信息列表
        '''
        try:
            order, offset, limit, where = self.buildparam(True)
            field_dict = {'id': '`py_user_check`.`id`', 'reason': '`py_user_check`.`reason`', 'status': '`py_user_check`.`status`', 'createtime': '`py_user_check`.`createtime`'}
            select = dictToSql(field_dict)
            totalsql = "{},(CASE WHEN py_user.type = '1' THEN py_unit.name else py_person.name END) AS name FROM `py_user_check` " \
                  "LEFT JOIN py_user ON `py_user_check`.`uid` = py_user.id " \
                  "LEFT JOIN py_unit ON py_user.from_id = py_unit.id " \
                  "LEFT JOIN py_person ON py_user.from_id = py_person.id " \
                  "WHERE `py_user_check`.`deletetime` = 0 " \
                  "{} " \
                  "ORDER BY {}".format(select, where, order)
            conuntsql = 'SELECT COUNT(*) FROM ({}) AS s'.format(totalsql)
            count = sqlToCount(conuntsql)
            sql = "{} LIMIT {} OFFSET {}".format(totalsql, limit, offset)
            sql = sql.replace('\"', '')
            cursor = db.session.execute(sql)
            _list = list(field_dict.keys())
            _list.append('name')
            rows = cursorToDict(cursor, _list)
            return self.success(data={'list': rows, 'count': count})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self):
        '''
        批量删除审核信息
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            self.model.query.filter(self.model.id.in_(ids)).update({self.model.deletetime : int(time.time())}, synchronize_session=False)
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/check/<int:_id>', strict_slashes=False)
class CheckDetail(Backend):

    def __init__(self):
        super(CheckDetail, self).__init__()
        self.model = UserCheck

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取审核信息
        :param _id: 审核信息id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0).first()
            if not row: return self.error(msg='No Results were found')
            userRow = User.query.filter(User.id == row.uid, User.deletetime == 0).first()
            if not userRow:
                name = ''
            else:
                if userRow.type == 2:
                    personRow = Person.query.filter(Person.id == userRow.fromId, Person.deletetime == 0).first()
                    name = personRow.name if personRow else ''
                if userRow.type == 1:
                    unitRow = Unit.query.filter(Unit.id == userRow.fromId, Unit.deletetime == 0).first()
                    name = unitRow.name if unitRow else ''

            row = queryToDict(row)
            row['name'] = name
            return self.success(data={'row': row})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self, _id):
        '''
        删除审核信息
        :param _id: 审核信息id
        '''
        try:
            row = self.model.query.filter(self.model.id == _id, self.model.deletetime == 0).first()
            if not row: return self.error(msg='No Results were found')
            row.delete(False)
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

