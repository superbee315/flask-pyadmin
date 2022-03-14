import { defHttp } from '/@/utils/http/axios';
import {
  GetModelListModel,
  ModelIdParams,
  GetModelModel,
  AddModelParams,
  EditModelParams,
  FieldIdParams,
  GetFieldModel,
  AddFieldParams,
  EditFieldParams,
} from './model/tableModel';

enum Api {
  ModelUrl = '/model', // 自定义表单
  FieldUrl = '/field', // 自定义表单字段
}

/**
 * @description: 获取自定义表单
 */
export function getModelList(params) {
  return defHttp.request<GetModelListModel>({
    url: Api.ModelUrl,
    method: 'GET',
    params,
  });
}

/**
 * @description: 添加自定义表单
 */
export function addModel(params: AddModelParams) {
  return defHttp.request<GetModelListModel>({
    url: Api.ModelUrl,
    method: 'POST',
    params,
  });
}

/**
 * @description: 获取单个表单
 */
export function getModel(params: ModelIdParams) {
  return defHttp.request<GetModelModel>({
    url: Api.ModelUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 修改单个表单
 */
export function editModel(params: EditModelParams) {
  return defHttp.request<GetModelListModel>({
    url: Api.ModelUrl + '/' + params.id,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除单个表单
 */
export function deleteModel(params: ModelIdParams) {
  return defHttp.request<GetModelListModel>({
    url: Api.ModelUrl + '/' + params.id,
    method: 'DELETE',
  });
}
/**
 * @description: 添加自定义表单字段
 */
export function addField(params: AddFieldParams) {
  return defHttp.request<GetFieldModel>({
    url: Api.FieldUrl + '/' + params.id,
    method: 'POST',
    params,
  });
}

/**
 * @description: 获取自定义表单字段
 */
export function getField(params: FieldIdParams) {
  return defHttp.request<GetFieldModel>({
    url: Api.FieldUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 修改自定义表单字段
 */
export function editFieldId(params: EditFieldParams) {
  return defHttp.request<GetFieldModel>({
    url: Api.FieldUrl + '/' + params.id,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除自定义表单字段
 */
export function deleteField(params: FieldIdParams) {
  return defHttp.request<GetFieldModel>({
    url: Api.FieldUrl + '/' + params.id,
    method: 'DELETE',
  });
}
