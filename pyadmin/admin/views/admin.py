"""
Created on 2021年5月11日

@author: 40215
"""
import ast, numpy

from flask import request, g
from flask_login import login_required, current_user

from sqlalchemy import or_
from pyadmin.app import db
from pyadmin.common.model import queryToDict
from pyadmin.admin.validate.admin import *
from pyadmin.common.model.admin import Admin, AuthGroupAccess, AuthGroup, AuthRule
from .. import Backend, admin, access_view

@admin.resource('/login')
class AdminLogin(Backend):
    
    def __init__(self):
        super(AdminLogin, self).__init__()
        self.model = Admin()

    def post(self):
        '''
        登录
        '''
        try:
            form = LoginForm(meta={'csrf': False})
            if form.validate_for_api():
                username = request.form['username']
                password = request.form['password']
                res = self.login(username, password)
                if res:
                    current = queryToDict(current_user)
                    current['token'] = self.jwt
                    del current['salt']
                    current['status'] = str(current['status'])
                    return self.success(msg='Login succeed', data=current)
                
                return self.error(msg='Username or password is incorrect')
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)
    
@admin.resource('/', endpoint='admin')
class AdminList(Backend):
        
    def __init__(self):
        super(AdminList, self).__init__()
        self.model = Admin
        
    @login_required
    @access_view
    def get(self):
        '''
        获取管理员列表
        '''
        try:
            childrenGroupIds = self.get_children_group_ids(True)
            children_ids = self.get_children_admin_ids(True)
            
            groupName = AuthGroup.query.\
            with_entities(AuthGroup.name, AuthGroup.id).\
            filter(AuthGroup.id.in_(childrenGroupIds)).\
            all()
            groupNameDict = {gn.id:gn.name for gn in groupName}
            
            authGroupList = AuthGroupAccess.query.\
            filter(or_(AuthGroupAccess.group_id.in_(childrenGroupIds),AuthGroupAccess.uid==g.admin.id)).\
            all()
            
            groups = self.auth.getGroups(g.admin.id)
            for group in groups:
                groupNameDict[group.id] = group.name

            adminGroupName = {}
            for agn in authGroupList:
                if agn.uid not in adminGroupName:
                    adminGroupName[agn.uid] = []
                    
                if agn.group_id in groupNameDict:
                    adminGroupName[agn.uid].append({"id": agn.group_id, "name": groupNameDict[agn.group_id]})
                    
            order, offset, limit, where = self.buildparam()
            
            count = self.model.query.filter(self.model.id.in_(children_ids)).filter(*where).count()
            
            rows = self.model.query.\
            filter(self.model.id.in_(children_ids)).\
            filter(*where).\
            order_by(order).\
            offset(offset).\
            limit(limit).\
            all()
            
            rows = queryToDict(rows)
            for row in rows: row['groups'] = adminGroupName[row['id']] if row['id'] in adminGroupName else []

            return self.success(data={'list': rows, 'count': count})
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加管理员
        '''
        try:
            form = AdminForm(meta={'csrf': False})
            if form.validate_for_api():
                username = request.form['username']
                exist = Admin.query_by_username(username)
                if exist: return self.error(msg='Operation failed, ' + username + ' exist！')
                data = request.form.to_dict()
                groups = data['groups'].split(',') if isinstance(data['groups'], str) else data['groups']
                del data['groups']

                groupIds = self.get_children_group_ids()
                # 过滤不允许的组别,避免越权
                groups = list(numpy.intersect1d(groupIds, groups))
                if not groups: return self.error(msg='The parent group exceeds permission limit')

                admin = Admin.create(**data)
                db.session.flush()
                uid = admin.id
                for gid in groups:
                    groupData = {'uid': uid, 'group_id': int(gid)}
                    AuthGroupAccess.create(**groupData)
                self.auth.clear()
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
        批量删除管理员
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')

            adminIds = self.get_children_admin_ids()
            # 过滤不允许的管理员,避免越权
            ids = list(numpy.intersect1d(adminIds, ids))
            if not ids: return self.error(msg='The parent admin exceeds permission limit')

            rows = self.model.query.filter(self.model.id.in_(ids)).all()
            for row in rows:
                row.delete()
                AuthGroupAccess.query.filter(AuthGroupAccess.uid == row.id).delete()
                    
            self.auth.clear()
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)
                
@admin.resource('/<int:_id>',strict_slashes=False)
class AdminDetail(Backend):

    def __init__(self):
        super(AdminDetail, self).__init__()
        self.model = Admin

    @login_required
    @access_view
    def get(self,_id):
        '''
        根据id获取管理员信息
        :param _id: 管理员id
        '''
        try:
            row = self.model.query.filter(Admin.id==_id).first()
            if not row: return self.error(msg='No Results were found')

            adminIds = self.get_children_admin_ids(True)
            # 过滤不允许的管理员,避免越权
            if _id not in adminIds: return self.error(msg='The parent admin exceeds permission limit')
            
            groups = self.auth.getGroups(_id)
            # 过滤不允许的组别,避免越权
            _groups = [group.id for group in groups]
            groupIds = self.get_children_group_ids(True)
            _groups = list(numpy.intersect1d(groupIds, _groups))

            row = queryToDict(row)
            row['groups'] = [{'id': group.id, 'name': group.name} for group in groups if group.id in _groups or _id == g.admin.id]
            return self.success(data={'row': row})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self,_id):
        '''
        修改管理员
        :param _id: 管理员id
        '''
        try:
            row = self.model.query.filter(Admin.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            adminIds = self.get_children_admin_ids()
            # 过滤不允许的管理员,避免越权
            if _id not in adminIds: return self.error(msg='The parent admin exceeds permission limit')
            
            form = AdminDetailForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()

                username = data.get('username', '')
                if username:
                    exist = self.model.query.filter(Admin.id != _id, Admin.username == data['username']).all()
                    if exist: return self.error(msg='Operation failed, ' + data['username'] + ' exist！')
                row.update(**data)

                groups = data.get('groups', [])
                groups = groups.split(',') if isinstance(groups, str) else request.form.getlist('groups[]')
                if groups:
                    groupIds = self.get_children_group_ids(True)
                    # 先移除所有权限
                    AuthGroupAccess.query.filter(AuthGroupAccess.uid==_id).delete()
                    # 过滤不允许的组别,避免越权
                    groups = list(numpy.intersect1d(groupIds, groups))
                    if not groups: return self.error(msg='The parent group exceeds permission limit')
                    for _g in groups:
                        groupsData = {'uid': _id, 'group_id':_g}
                        AuthGroupAccess.create(**groupsData)
                        
                self.auth.clear()
                db.session.commit()
                return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self,_id):
        '''
        删除管理员
        :param _id: 管理员id
        '''
        try:
            row = self.model.query.filter(Admin.id==_id).first()
            if not row: return self.error(msg='No Results were found')

            adminIds = self.get_children_admin_ids()
            # 过滤不允许的管理员,避免越权
            if _id not in adminIds: return self.error(msg='The parent admin exceeds permission limit')

            row.delete()
            AuthGroupAccess.query.filter(AuthGroupAccess.uid==_id).delete()
            self.auth.clear()
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/group/', strict_slashes=False, endpoint='group')
class AuthGroupList(Backend):

    def __init__(self):
        super(AuthGroupList, self).__init__()
        self.model = AuthGroup

    @login_required
    @access_view
    def get(self):
        '''
        获取角色组列表
        '''
        try:
            childrenGroupIds = self.get_children_group_ids()

            count = self.model.query.filter(AuthGroup.id.in_(childrenGroupIds)).count()
            rows = self.model.query.filter(AuthGroup.id.in_(childrenGroupIds)).all()

            rows = queryToDict(rows)
            tree = []

            for row in rows:
                children = self.deal_menu(rows, row['id'])
                if children: row['children'] = children
                if row['pid'] not in childrenGroupIds: tree.append(row)

            return self.success(data={'list': tree, 'count': count})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加角色组
        '''
        try:
            form = GroupForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()

                # 过滤不允许的父组别,避免越权
                groupIds = self.get_children_group_ids()
                pid = int(data.get('pid', 0))
                if pid not in groupIds: return self.error(msg='The parent group exceeds permission limit')
                parent = self.model.get_by_id(pid)
                if not parent: self.error(msg='The parent group can not found')

                # 父级别的规则节点
                parent_rules = parent.rules.split(',')
                # 当前组别的规则节点
                current_rules = self.auth.getRuleIds(g.admin.id)
                # 获取传过来得节点
                rules = data.get('rules', '').split(',')
                # 如果父组不是超级管理员则需要过滤规则节点,不能超过父组别的权限
                rules = rules if '*' in parent_rules else list(numpy.intersect1d(parent_rules, rules))
                # 如果当前组别不是超级管理员则需要过滤规则节点,不能超当前组别的权限
                rules = rules if '*' in current_rules else list(numpy.intersect1d(current_rules, rules))
                data['rules'] = ','.join(rules)

                AuthGroup.create(**data)
                self.auth.clear()
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
        批量删除角色组
        '''
        try:
            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            if ids:
                ids = [int(id) for id in ids]
                groupIds = AuthGroupAccess.query.\
                filter(AuthGroupAccess.uid == g.admin.id).\
                with_entities(AuthGroupAccess.group_id).\
                all()
                groupIds = [groupId[0] for groupId in groupIds]
                # 移除掉当前管理员所在组别
                ids = list(set(ids).difference(set(groupIds)))

                # 循环判断每一个组别是否可删除
                groupLists = self.model.query.filter(AuthGroup.id.in_(ids)).all()
                groupLists = queryToDict(groupLists)

                for groupList in groupLists:
                    # 当前组别下有管理员
                    groupOne = AuthGroupAccess.query.filter(AuthGroupAccess.group_id == groupList['id']).all()
                    if groupOne:
                        ids = ids.remove(groupList['id'])

                    # 当前组别下有子组别
                    groupOne = self.model.query.filter(AuthGroup.pid == groupList['id']).all()
                    if groupOne:
                        ids = ids.remove(groupList['id'])
                        continue

                if not ids: return self.error(msg='You can not delete group that contain child group and administrators')

                rows = self.model.query.filter(self.model.id.in_(ids)).all()
                for row in rows:
                    row.delete()
                    AuthGroupAccess.query.filter(AuthGroupAccess.group_id == row.id).delete()

                self.auth.clear()
                db.session.commit()
                return self.success(msg='Operation completed！')
            return self.error(msg='No Ids')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    def deal_menu(self, rows: list, _id: int):
        '''
        处理菜单
        :param rows
        :param _id
        '''
        data = []

        for row in rows:
            if row['pid'] == _id:
                children = self.deal_menu(rows, row['id'])
                if children: row['children'] = children
                data.append(row)

        return data

@admin.resource('/group/<int:_id>', strict_slashes=False, endpoint='groupdetail')
class AuthGroupDetail(Backend):

    def __init__(self):
        super(AuthGroupDetail, self).__init__()
        self.model = AuthGroup

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取角色组信息
        :param _id: 角色组id
        '''
        try:
            row = self.model.query.filter(AuthGroup.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            # 过滤不允许的组别,避免越权
            groupIds = self.get_children_group_ids()
            if _id not in groupIds: return self.error(msg='The parent group exceeds permission limit')

            return self.success(data={'row': queryToDict(row)})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self, _id):
        '''
        修改角色组
        :param _id: 角色组id
        '''
        try:
            row = self.model.query.filter(AuthGroup.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            form = GroupDetailForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()

                # 过滤不允许的组别,避免越权
                groupIds = self.get_children_group_ids(withself=True)
                if _id not in groupIds: return self.error(msg='The parent group exceeds permission limit')

                # 父节点不能是非权限内节点
                groupIds = self.get_children_group_ids()
                pid = int(data.get('pid', 0))
                if pid not in groupIds: return self.error(msg='The parent group exceeds permission limit')

                # 父节点不能是它自身的子节点或自己本身
                pidGroupIds = self.get_children_group_ids(False, _id)
                if pid in pidGroupIds:return self.error(msg='The parent group can not be its own child or itself')

                parent = self.model.get_by_id(pid)
                if not parent: self.error(msg='The parent group can not found')

                # 父级别的规则节点
                parent_rules = parent.rules.split(',')
                # 当前组别的规则节点
                current_rules = self.auth.getRuleIds(g.admin.id)
                # 获取传过来得节点
                rules = data.get('rules', '').split(',')
                # 如果父组不是超级管理员则需要过滤规则节点,不能超过父组别的权限
                rules = rules if '*' in parent_rules else list(numpy.intersect1d(parent_rules, rules))
                # 如果当前组别不是超级管理员则需要过滤规则节点,不能超当前组别的权限
                rules = rules if '*' in current_rules else list(numpy.intersect1d(current_rules, rules))
                data['rules'] = ','.join(rules)

                row.update(**data)
                self.auth.clear()

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
        删除角色组
        :param _id: 角色组id
        '''
        try:
            row = self.model.query.filter(AuthGroup.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            # 过滤不允许的组别,避免越权
            groupIds = self.get_children_group_ids(True)
            if _id not in groupIds: return self.error(msg='The parent group exceeds permission limit')

            # 当前组别下有管理员
            groupAdmin = AuthGroupAccess.query.filter(AuthGroupAccess.group_id == _id).all()
            if groupAdmin: return self.error(msg='You can not delete group that contain administrators')
            # 当前组别下有子组别
            groupParent = self.model.query.filter(AuthGroup.pid == _id).all()
            if groupParent: return self.error(msg='You can not delete group that contain child group')

            row.delete()
            AuthGroupAccess.query.filter(AuthGroupAccess.group_id == _id).delete()
            self.auth.clear()
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/rule/', strict_slashes=False, endpoint='rule')
class AuthRuleList(Backend):

    def __init__(self):
        super(AuthRuleList, self).__init__()
        self.model = AuthRule

    @login_required
    @access_view
    def get(self):
        '''
        获取菜单规则列表
        '''
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            rows = self.model.query.filter().all()
            rows = queryToDict(rows)
            tree = []

            for row in rows:
                children = self.deal_menu(rows, row['id'])
                if children: row['children'] = children
                if row['pid'] == 0: tree.append(row)

            return self.success(data={'count': len(tree), 'tree': tree})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加菜单规则
        '''
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            form = RuleForm(meta={'csrf': False})
            if form.validate_for_api():
                name = request.form['name']
                exist = AuthRule.query_by_name(name)
                if exist: return self.error(msg='Operation failed, ' + name + ' exist！')
                data = request.form.to_dict()
                ismenu = data.get('ismenu', '')
                pid = data.get('pid', '')
                if ismenu: data['ismenu'] = True if data['ismenu'] == 'true' else False
                # 判断菜单规则是否正确
                if not ismenu and not pid: return self.error(msg='The non-menu rule must have parent')
                AuthRule.create(**data)
                self.auth.clear()
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
        批量删除菜单规则
        '''
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            ids = request.form.get('ids', [])
            ids = ids.split(',') if isinstance(ids, str) else request.form.getlist('ids[]')
            rows = self.model.query.filter(self.model.id.in_(ids)).all()
            for row in rows:
                row.delete()

            self.auth.clear()
            db.session.commit()
            return self.success(msg='Operation completed！')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    def deal_menu(self, rows: list, _id: int):
        '''
        处理菜单
        :param rows
        :param _id
        '''
        data = []

        for row in rows:
            if row['pid'] == _id:
                children = self.deal_menu(rows, row['id'])
                if children: row['children'] = children
                data.append(row)

        return data

@admin.resource('/rule/<int:_id>', strict_slashes=False, endpoint='ruledetail')
class AuthRuleDetail(Backend):

    def __init__(self):
        super(AuthRuleDetail, self).__init__()
        self.model = AuthRule

    @login_required
    @access_view
    def get(self, _id):
        '''
        根据id获取菜单规则信息
        :param _id: 菜单规则id
        '''
        # 判断数据中是否有错误
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            row = self.model.query.filter(AuthRule.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            return self.success(data={'row': queryToDict(row)})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self, _id):
        '''
        修改菜单规则
        :param _id: 菜单规则id
        '''
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            row = self.model.query.filter(AuthRule.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            form = RuleDetailForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()

                # 这里需要针对name做唯一验证
                name = data.get('name', '')
                if name:
                    exist = self.model.query.filter(AuthRule.id != _id, AuthRule.name == data['name']).all()
                    if exist: return self.error(msg='Operation failed, ' + data['name'] + ' exist！')

                # 是否为菜单参数类型修改
                if data.get('ismenu', ''): data['ismenu'] = True if data['ismenu'] == 'true' else False

                # 非菜单节点必须要有父节点
                _row = queryToDict(row)
                _row.update(data)
                if not _row['ismenu'] and not _row['pid']:
                    return self.success(msg='The non-menu rule must have parent')

                # 父节点不能是它自身的子节点或自己本身
                pidRuleIds = self.get_children_rule_ids(_id)
                if _row['pid'] in pidRuleIds: return self.error(msg='Can not change the parent to child')

                # 自动修改path
                # if not _row['ismenu'] :
                #     data['path'] = ''
                # else:
                #     if not data.get('path', ''):
                #         data['path'] = '/' + _row['name'] if _row['pid'] == 0 else _row['name'].rsplit('.', 1)[1]

                row.update(**data)
                self.auth.clear()
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
        删除菜单规则
        :param _id: 菜单规则id
        '''
        try:
            if not self.is_super_admin(): return self.error(msg='No super admin permission')

            row = self.model.query.filter(AuthRule.id == _id).first()
            if not row: return self.error(msg='No Results were found')

            row.delete()
            self.auth.clear()
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/menu/<int:pid>', strict_slashes=False, endpoint='allow')
class AllowMenu(Backend):

    def __init__(self):
        super(AllowMenu, self).__init__()

    @login_required
    def get(self, pid):
        '''
        获取允许的菜单规则列表
        :param pid: 父级角色组id
        '''
        try:
            group = AuthGroup.query.filter(AuthGroup.id == pid).first()
            rule_list = AuthRule.query.all()
            
            allow = {}
            if group.rules != '*':
                rule_ids = group.rules.split(',')
                map_rule = {rule.id: rule for rule in rule_list}
                array = []
                for rid in rule_ids:
                    if not rid: continue
                    rid = int(rid)
                    if rid in map_rule:
                        info, limit = self.find_parent_menu(map_rule, rid)
                        array.extend(limit)
                        if info and info.id not in allow: allow[info.id] = info
            else:
                allow = {r.id: r for r in rule_list if r.pid == 0}
                array = {r.id: r for r in rule_list}

            data = []
            for _, row in allow.items():
                info = {'id': row.id, 'title': row.title}
                children = self.deal_menu(rule_list, row.id, array)
                if children: info['children'] = children
                data.append(info)

            return self.success(data={'tree': data})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    def deal_menu(self, rule_list:list, _id:int, array:list):
        '''
        处理菜单
        :param rule_list
        :param _id
        :param array
        '''
        data = []

        for row in rule_list:
            if row.pid == _id:
                if row.id in array:
                    info = {'id': row.id, 'title': row.title}
                    children = self.deal_menu(rule_list, row.id, array)
                    if children: info['children'] = children
                    data.append(info)

        return data

    def find_parent_menu(self, map_rule:dict, rid:int):
        '''
        寻找父级
        :param map_rule
        :param rid
        '''
        if rid in map_rule:
            limit = []
            rule = map_rule[rid]
            limit.append(rid)
            if rule.pid:
                rule, array = self.find_parent_menu(map_rule, rule.pid)
                limit.extend(array)
            return rule, limit


@admin.resource('/menu/', strict_slashes=False, endpoint='menu')
class MenuList(Backend):

    def __init__(self):
        super(MenuList, self).__init__()

    @login_required
    def get(self):
        '''
        获取侧边栏菜单规则列表
        '''
        try:
            rule_list = self.auth.getRuleList(g.admin.id)
            
            data = []
            for key, row in rule_list.items():
                if '*' == key: continue
                if not row['ismenu']: continue
                
                if not row['pid']:
                    info = {'meta': {'icon': row['icon'], 'title': row['title']}}
                    info['name'] = row['name']
                    info['path'] = '/{name}'.format(name=row['name'].lower())
                    info['component'] = row['url']
                    info['children'] = self.deal_menu(rule_list, row['id'])
                    data.append(info)
                    
            return self.success(data= data)
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    def deal_menu(self, rule_list:list, _id:int):
        '''
        处理菜单
        :param rule_list
        :param _id 
        '''
        data = []
        
        for key, row in rule_list.items(): 
            if '*' == key: continue
            if not row['ismenu']: continue
            
            if row['pid'] == _id:
                info = {'meta': {'icon': row['icon'], 'title': row['title']}}
                info['name'] = row['name']
                info['path'] = '/{name}'.format(name=row['name'].lower())
                info['component'] = row['url']
                info['children'] = self.deal_menu(rule_list, row['id'])
                data.append(info)
        
        return data


@admin.resource('/logout')
class AdminLogout(Backend):

    @login_required
    def get(self):
        '''
        登出
        '''
        try:
            self.logout()

            return self.success('logout success')
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@admin.resource('/my')
class AdminMyInfo(Backend):
    @login_required
    def get(self):
        '''
        获取自身信息
        '''
        try:
            if not current_user: return self.error(msg='No Results were found')
            current = queryToDict(current_user)
            current['status'] = str(current['status'])
            groups = self.auth.getGroups(current['id'])
            current['groups'] = [{'id': group.id, 'name': group.name} for group in groups]
            return self.success(data={'row':current})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

