import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  getUserListParams,
  GetUserInfoModel,
  EditMyInfoParams,
  CommonRowModel,
  getGroupTreeModel,
  CommonTreeModel,
  AddUserParams,
  DeleteUserParams,
  EditUserParams,
  AddGroupParams,
  EditGroupParams,
  GroupIdParams,
  AddRuleParams,
  EditRuleParams,
  RuleIdParams,
  DeleteBatchesParams,
} from './model/userModel';
import { ErrorMessageMode } from '/@/utils/http/axios/types';

enum Api {
  LoginUrl = '/login',
  AdminUrl = '/',
  MyInfoUrl = '/my',
  GroupUrl = '/group/',
  RuleUrl = '/rule/',
  MenuUrl = '/menu/',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.request<LoginResultModel>(
    {
      url: Api.LoginUrl,
      method: 'POST',
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfoById
 */
export function getMyInfo() {
  return defHttp.request<GetUserInfoModel>({
    url: Api.MyInfoUrl,
    method: 'GET',
  });
}
/**
 * @description: getUserInfoById
 */
export function editMyInfo(params: EditMyInfoParams) {
  return defHttp.request<GetUserInfoModel>({
    url: Api.MyInfoUrl,
    method: 'PUT',
    params,
  });
}
/**
 * @description: getUserInfoById
 */
export function getUserInfoById(params: GetUserInfoByUserIdParams) {
  return defHttp.request<GetUserInfoModel>({
    url: Api.AdminUrl + params.id,
    method: 'GET',
  });
}
// 管理员列表
export function getUserList(params?: getUserListParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AdminUrl,
    method: 'GET',
    params,
  });
}
//添加管理员 用户
export function addUser(params: AddUserParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AdminUrl,
    method: 'POST',
    params,
  });
}

//批量删除管理员 用户
export function deleteBatchesUser(params: DeleteBatchesParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AdminUrl,
    method: 'DELETE',
    params,
  });
}

// 修改管理员信息
export function editUser(params: EditUserParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AdminUrl + params.id,
    method: 'PUT',
    params,
  });
}

// 修改管理员信息
export function deleteUser(params: DeleteUserParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.AdminUrl + params.id,
    method: 'DELETE',
  });
}

// ===================角色组======================
export function getGroupTree() {
  return defHttp.request<CommonTreeModel>({
    url: Api.GroupUrl,
    method: 'GET',
  });
}
export function addGroup(params: AddGroupParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.GroupUrl,
    method: 'POST',
    params,
  });
}

export function deleteBatchesGroup(params: DeleteBatchesParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.GroupUrl,
    method: 'DELETE',
    params,
  });
}
export function editGroup(params: EditGroupParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.GroupUrl + params.id,
    method: 'PUT',
    params,
  });
}
export function deleteGroup(params: GroupIdParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.GroupUrl + params.id,
    method: 'DELETE',
  });
}
export function getGroupById(params: GroupIdParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.GroupUrl + params.id,
    method: 'GET',
  });
}

// =====================菜单规则===========

export function getRuleTree() {
  return defHttp.request<CommonTreeModel>({
    url: Api.RuleUrl,
    method: 'GET',
  });
}
export function addRule(params: AddRuleParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.RuleUrl,
    method: 'POST',
    params,
  });
}
export function deleteBatchesRule(params: DeleteBatchesParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.RuleUrl,
    method: 'DELETE',
    params,
  });
}
export function editRule(params: EditRuleParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.RuleUrl + params.id,
    method: 'PUT',
    params,
  });
}
export function deleteRule(params: RuleIdParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.RuleUrl + params.id,
    method: 'DELETE',
  });
}
export function getRuleById(params: RuleIdParams) {
  return defHttp.request<CommonRowModel>({
    url: Api.RuleUrl + params.id,
    method: 'GET',
  });
}

// //获取左侧菜单路由
// export function getMenuList() {
//   return defHttp.request<getGroupTreeModel>({
//     url: Api.MenuUrl,
//     method: 'GET',
//   });
// }

//请求允许访问的规则 params 角色组pid
export function getAllowRule(params: RuleIdParams) {
  return defHttp.request<getGroupTreeModel>({
    url: Api.MenuUrl + params.id,
    method: 'GET',
  });
}
