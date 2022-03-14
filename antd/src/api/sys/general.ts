import { defHttp } from '/@/utils/http/axios';
import {
  CommonRowModel,
  AppInfoModel,
  GroupModel,
  AddConfigInfoParams,
  // EditConfigInfoParams,
  DeleteConfigInfoParams,
  ConfigNameParams,
  configNameExistModel,
  DeleteAttachmentParams,
  DeleteBatchesParams,
} from './model/generalModel';

enum Api {
  appUrl = '/logo', // 项目title 和 logo
  GroupUrl = '/general/group/', // 系统配置分组
  ConfigUrl = '/config/', // 系统配置表
  FileUrl = '/file/', // 上传文件
  ConfigNameExistUrl = '/exist', // 检测变量名是否已经存在
  AttachmentUrl = '/attachment/', // 附件
}

/**
 * @description: 获取项目title logo
 */
export function getAppInfo() {
  return defHttp.request<AppInfoModel>({
    url: Api.appUrl,
    method: 'GET',
  });
}
/**
 * @description: 获取系统配置分组
 */
export function getConfigGroup() {
  return defHttp.request<GroupModel>({
    url: Api.GroupUrl,
    method: 'GET',
  });
}

/**
 * @description: 获取系统配置表
 */
export function getConfigInfo() {
  return defHttp.request<CommonRowModel>({
    url: Api.ConfigUrl,
    method: 'GET',
  });
}
/**
 * @description: 获取系统配置表
 */
export function addConfigInfo(params: AddConfigInfoParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.ConfigUrl,
    method: 'POST',
    params,
  });
}
/**
 * @description: 获取系统配置表
 */
export function editConfigInfo(params) {
  return defHttp.request<CommonRowModel>({
    url: Api.ConfigUrl,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除系统配置 id
 */
export function deleteConfigInfo(params: DeleteConfigInfoParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.ConfigUrl + params.id,
    method: 'DELETE',
  });
}

/**
 * @description: 检测变量名是否已经存在
 */
export function configNameExist(params: ConfigNameParams) {
  return defHttp.request<configNameExistModel>({
    url: Api.ConfigNameExistUrl,
    method: 'POST',
    params,
  });
}

/**
 * @description: 获取附件列表
 */
export function getAttachmentList(params) {
  return defHttp.request<CommonRowModel>({
    url: Api.AttachmentUrl,
    method: 'GET',
    params,
  });
}

/**
 * @description: 删除附件 id
 */
export function deleteAttachment(params: DeleteAttachmentParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AttachmentUrl + params.id,
    method: 'DELETE',
  });
}

/**
 * @description: 批量删除附件
 */
export function deleteBatchesAttachment(params: DeleteBatchesParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AttachmentUrl,
    method: 'DELETE',
    params,
  });
}
