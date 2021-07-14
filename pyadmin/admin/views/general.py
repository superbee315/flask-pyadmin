"""
Created on 2021年6月23日

@author: zeng
"""
import ast, json, os, datetime, hashlib, time

from flask import request, g
from flask_login import login_required

from pyadmin.app import db
from pyadmin.common.model import queryToDict
from pyadmin.common.model.general import Config, Attachment
from pyadmin.admin.validate.general import ConfigForm
from .. import Backend, general, access_view
from werkzeug.utils import secure_filename
from PIL import Image

@general.resource('/group/', endpoint='group')
class ConfigGroup(Backend):

    def __init__(self):
        super(ConfigGroup, self).__init__()
        self.model = Config

    @login_required
    @access_view
    def get(self):
        '''
         获取系统配置分组
         '''
        try:
            group = self.model.query.\
                filter(Config.name == 'configgroup').\
                with_entities(Config.value).\
                first()
            group = json.loads(json.dumps(eval(str(group.value))))
            return self.success(data={'group': group})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)


@general.resource('/config/', endpoint='config')
class Configlist(Backend):

    def __init__(self):
        super(Configlist, self).__init__()
        self.model = Config

    @login_required
    @access_view
    def get(self):
        '''
        获取系统配置表
        '''
        try:
            group = self.model.query_by_name('configgroup')
            grouplist = json.loads(json.dumps(eval(str(group.value))))

            sitelist = {}
            for key, item in grouplist.items():
                sitelist[key] = {}
                sitelist[key]['name'] = key
                sitelist[key]['title'] = item
                sitelist[key]['list'] = []

            rows = self.model.query.all()
            for row in rows:
                if row.group not in sitelist.keys(): continue
                row = queryToDict(row)
                if row['type'] in ['selects', 'checkbox']: 
                    row['value'] = row['value'].split(',')
                if row['type'] == 'array': row['value'] = json.loads(json.dumps(eval(row['value'])))
                row['content'] = json.loads(json.dumps(eval(row['content']))) if row['content'] else []
                sitelist[row['group']]['list'].append(row)

            return self.success(data={'row': sitelist})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def post(self):
        '''
        添加系统配置
        '''
        try:
            form = ConfigForm(meta={'csrf': False})
            if form.validate_for_api():
                data = request.form.to_dict()
                exist = self.model.query_by_name(data['name'])
                if exist:
                    return self.error(msg='Operation failed, ' + data['name'] + ' exist！')

                if data.get('type', '') in ['select', 'selects', 'checkbox', 'radio', 'array']:
                    print(data.get('content', ''))
                    data['content'] = json.dumps(Config.decode(data.get('content', '')), ensure_ascii=False)
                    print(data['content'])
                else:
                    data['content'] = ''
                Config.create(**data)
                db.session.commit()
                return self.success(msg='Operation completed')

        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def put(self):
        '''
        修改系统配置信息
        '''
        try:
            data = request.form.to_dict()
            rows = self.model.query.all()
            for row in rows:
                if row.name in data.keys():
                    value = data.get(row.name,'')
                    value = ','.join(value.values() ) if isinstance(value, dict) else value
                    row.update(value=value)
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@general.resource('/config/<int:_id>',strict_slashes=False)
class ConfigDetail(Backend):

    def __init__(self):
        super(ConfigDetail, self).__init__()
        self.model = Config

    @login_required
    @access_view
    def get(self,_id):
        '''
        根据id获取系统配置信息
        :param _id: 系统配置id
        '''
        # 判断数据中是否有错误
        try:
            row = self.model.query.filter(Config.id==_id).first()
            if not row:
                return self.error(msg='No Results were found')
            row = queryToDict(row)
            if row['type'] in ['select', 'selects', 'checkbox', 'radio']:
                row['value'] = row['value'].split(',')
            if row['type'] == 'array':
                row['value'] = json.loads(json.dumps(eval(row['value'])))
            if row['content']: row['content'] = json.loads(json.dumps(eval(row['content'])))

            return self.success(data={'row': row})

        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

    @login_required
    @access_view
    def delete(self, _id):
        '''
        删除系统配置信息
        :param _id: 系统配置信息id
        '''
        try:
            row = self.model.query.filter(Config.id == _id).first()
            if not row:
                return self.error(msg='No data')
            row.delete()
            db.session.commit()
            return self.success(msg='Operation completed')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@general.resource('/file', strict_slashes=False)
class FileUpload(Backend):

    def __init__(self):
        super(FileUpload, self).__init__()
        self.model = Attachment

    @login_required
    @access_view
    def post(self):
        '''
        上传文件
        '''
        try:
            file = request.files['file']
            if not file:
                return self.error(msg='No file upload or server upload limit exceeded')
            if not Config.allowed_file(file.filename):
                return self.error(msg='Uploaded file format is limited')

            sha1obj = hashlib.sha1()
            sha1obj.update(file.read())
            hash = sha1obj.hexdigest()
            if not Attachment.query_by_sha1(hash):
                suffix = file.filename.rsplit('.', 1)[1]
                filename = secure_filename(file.filename)

                # 验证是否为图片文件
                imagewidth = 0
                imageheight = 0
                if suffix in ['gif', 'jpg', 'jpeg', 'bmp', 'png', 'webp']:
                    imginfo = Image.open(file)
                    if not imginfo or not imginfo.width or not imginfo.height:
                        return self.error(msg='Uploaded file is not a valid image')
                    imagewidth = imginfo.width
                    imageheight = imginfo.height

                m = hashlib.md5()
                m.update(filename.encode(encoding='UTF-8'))
                filemd5 = m.hexdigest()
                replaceDicts = {'{year}': datetime.datetime.today().year, '{mon}': datetime.datetime.today().month,
                                '{day}': datetime.datetime.today().day, '{.suffix}': '.' + suffix if suffix else '',
                                '{filemd5}': filemd5}
                savekey = '\\pyadmin\\public\\uploads\\{year}{mon}{day}\\{filemd5}{.suffix}'
                for key in replaceDicts.keys():
                    savekey = savekey.replace(key, str(replaceDicts[key]))

                # 验证目录路径是否存在，若不存在则创建目录
                path = os.getcwd() + savekey.rsplit('\\', 1)[0]
                if not os.path.exists(path):
                    os.makedirs(path)
                path = os.getcwd() + savekey
                file.save(path)

                parms = {'admin_id': g.admin.id, 'user_id': 0, 'filesize': os.path.getsize(path),
                         'imagewidth': imagewidth, 'imageheight': imageheight, 'imagetype': suffix,
                         'imageframes': 0, 'url': savekey, 'uploadtime': int(time.time()),'updatetime': int(time.time()),
                         'storage': 'local','mimetype': file.content_type, 'sha1': hash, 'extparam': str(file)}
                Attachment.create(**parms)
                db.session.commit()
            return self.success(msg='File uploaded successfully')
        except Exception as e:
            db.session.rollback()
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@general.resource('/exist', strict_slashes=False)
class NameExist(Backend):

    def __init__(self):
        super(NameExist, self).__init__()
        self.model = Config

    def post(self):
        try:
            data = request.form.to_dict()
            name = data.get('name','')
            exist = self.model.query_by_name(name)
            bool = True if exist else False
            return self.success(data={'bool': bool})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)

@general.resource('/attachment/', endpoint='attachment')
class Attachmentlist(Backend):
    def __init__(self):
        super(Attachmentlist, self).__init__()
        self.model = Attachment

    @login_required
    @access_view
    def get(self):
        '''
        获取附件列表
        '''
        try:
            rows = self.model.query.filter().all()
            rows = queryToDict(rows)
            return self.success(data={'count': len(rows), 'rows': rows})
        except Exception as e:
            err = ast.literal_eval(str(e))
            return self.error(msg=err)
