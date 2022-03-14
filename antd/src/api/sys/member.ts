import { defHttp } from '/@/utils/http/axios';
import {
  GetUnitListModel,
  DeleteBatchesParams,
  UnitIdParams,
  AddUnitParams,
  EditUnitParams,
  GetPersonListModel,
  GetUnitModel,
  GetPersonModel,
  PersonIdParams,
  AddPersonParams,
  EditPersonParams,
  GetUserListModel,
  GetUserModel,
  UserIdParams,
  AddUserParams,
  EditUserParams,
  GetCheckRecordkListModel,
  ChecRecordIdParams,
  GetCheckRecordModel,
} from './model/memberModel';

enum Api {
  UserUrl = '/user',
  UnitUrl = '/unit',
  PersonUrl = '/person',
  CheckUrl = '/check',
}

/**
 * @description: GetUnitList
 */
export function getUnitList(params) {
  return defHttp.request<GetUnitListModel>({
    url: Api.UnitUrl,
    method: 'GET',
    params,
  });
}

/**
 * @description: addUnit
 */
export function addUnit(params: AddUnitParams) {
  return defHttp.request<GetUnitListModel>({
    url: Api.UnitUrl,
    method: 'POST',
    params,
  });
}
/**
 * @description: 批量删除单位
 */
export function deleteBatchesUnit(params: DeleteBatchesParams) {
  return defHttp.request<GetUnitListModel>({
    url: Api.UnitUrl,
    method: 'DELETE',
    params,
  });
}

/**
 * @description: 获取单个单位
 */
export function getUnit(params: UnitIdParams) {
  return defHttp.request<GetUnitModel>({
    url: Api.UnitUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 修改单个单位
 */
export function editUnit(params: EditUnitParams) {
  return defHttp.request<GetUnitListModel>({
    url: Api.UnitUrl + '/' + params.id,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除单个会员
 */
export function deleteUnit(params: UnitIdParams) {
  return defHttp.request<GetUnitListModel>({
    url: Api.UnitUrl + '/' + params.id,
    method: 'DELETE',
  });
}

/**
 * @description: GetPersonList -----------------------------------------------
 */
export function getPersonList(params) {
  return defHttp.request<GetPersonListModel>({
    url: Api.PersonUrl,
    method: 'GET',
    params,
  });
}

/**
 * @description: addPerson
 */
export function addPerson(params: AddPersonParams) {
  return defHttp.request<GetPersonListModel>({
    url: Api.PersonUrl,
    method: 'POST',
    params,
  });
}
/**
 * @description: 批量删除个人
 */
export function deleteBatchesPerson(params: DeleteBatchesParams) {
  return defHttp.request<GetPersonListModel>({
    url: Api.PersonUrl,
    method: 'DELETE',
    params,
  });
}

/**
 * @description: 获取单个个人
 */
export function getPerson(params: PersonIdParams) {
  return defHttp.request<GetPersonModel>({
    url: Api.PersonUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 修改单个个人
 */
export function editPerson(params: EditPersonParams) {
  return defHttp.request<GetPersonListModel>({
    url: Api.PersonUrl + '/' + params.id,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除单个个人
 */
export function deletePerson(params: PersonIdParams) {
  return defHttp.request<GetPersonListModel>({
    url: Api.PersonUrl + '/' + params.id,
    method: 'DELETE',
  });
}

/**
 * @description: GetUserList -----------------------------------------------
 */
export function getUserList(params) {
  return defHttp.request<GetUserListModel>({
    url: Api.UserUrl,
    method: 'GET',
    params,
  });
}

/**
 * @description: addUser
 */
export function addUser(params: AddUserParams) {
  return defHttp.request<GetUserListModel>({
    url: Api.UserUrl,
    method: 'POST',
    params,
  });
}
/**
 * @description: 批量删除会员
 */
export function deleteBatchesUser(params: DeleteBatchesParams) {
  return defHttp.request<GetUserListModel>({
    url: Api.UserUrl,
    method: 'DELETE',
    params,
  });
}

/**
 * @description: 获取单个会员
 */
export function getUser(params: UserIdParams) {
  return defHttp.request<GetUserModel>({
    url: Api.UserUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 修改单个会员
 */
export function editUser(params: EditUserParams) {
  return defHttp.request<GetUserListModel>({
    url: Api.UserUrl + '/' + params.id,
    method: 'PUT',
    params,
  });
}
/**
 * @description: 删除单个会员
 */
export function deleteUser(params: UserIdParams) {
  return defHttp.request<GetUserListModel>({
    url: Api.UserUrl + '/' + params.id,
    method: 'DELETE',
  });
}

/**
 * @description: GetChecRecordkList -----------------------------------------------审批记录
 */
export function GetChecRecordkList(params) {
  return defHttp.request<GetCheckRecordkListModel>({
    url: Api.CheckUrl,
    method: 'GET',
    params,
  });
}
/**
 * @description: 批量删除审批记录
 */
export function deleteBatchesCheckRecord(params: DeleteBatchesParams) {
  return defHttp.request({
    url: Api.CheckUrl,
    method: 'DELETE',
    params,
  });
}

/**
 * @description: 获取单个审批记录
 */
export function GetChecRecord(params: ChecRecordIdParams) {
  return defHttp.request<GetCheckRecordModel>({
    url: Api.CheckUrl + '/' + params.id,
    method: 'GET',
  });
}
/**
 * @description: 删除单个会员
 */
export function deleteChecRecord(params: ChecRecordIdParams) {
  return defHttp.request({
    url: Api.CheckUrl + '/' + params.id,
    method: 'DELETE',
  });
}
