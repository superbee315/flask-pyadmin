/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  id: string | number;
}

export interface getUserListParams {
  limit?: number;
  offset?: number;
  order?: string;
  sort?: string;
}

export interface AddUserParams {
  username: string;
  password: string;
  // 真实名字
  nickname: string;

  status?: boolean;
  // 介绍
  detail?: string;
  menus?: string[] | number[];
}
export interface EditUserParams {
  id: number;
  username: string;
  password: string;
  // 真实名字
  nickname: string;

  status?: boolean;
  // 介绍
  detail?: string;
  menus?: string[] | number[];
}
export interface EditMyInfoParams {
  password?: string;
  // 真实名字
  nickname?: string;
  email?: string;
  avatar?: string;
}

export interface DeleteUserParams {
  id: number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  id: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get common information return value
 */
export interface CommonRowModel {
  count: number;
  row: object[];
}

// /**
//  * @description: Get user information return value
//  */
// export interface Tree {
//   id: number;
// }

/**
 * @description: Get user information return value
 */
export interface CommonTreeModel {
  count: number;
  list: object[];
}
/**
 * @description: Get GroupTree information return value
 */
export interface getGroupTreeModel {
  count: number;
  tree: object[];
}
/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 用户id
  id: string | number;
  // 用户名
  username: string;
  nickname: string;
  email: string;
  logintime: number;
  row: any;
}

export interface AddGroupParams {
  pid: string | number;
  name: string;
  rules: string;
  status: string;
}

export interface EditGroupParams {
  id: number;
  pid?: string | number;
  name?: string;
  rules?: string;
  status?: string;
}
export interface GroupIdParams {
  id: number;
}

export interface AddRuleParams {
  condition: string;
  icon: string;
  ismenu: boolean;
  name: string;
  pid?: number;
  remark?: string;
  status: string;
  title: string;
  type: string;
  createtime?: number | string;
  updatetime?: number | string;
  weigh: number;
}

export interface EditRuleParams {
  id: number;
  condition?: string;
  icon?: string;
  ismenu?: boolean;
  name?: string;
  pid?: number;
  remark?: string;
  status?: string;
  title?: string;
  type?: string;
  createtime?: number | string;
  updatetime?: number | string;
  weigh?: number;
}
export interface RuleIdParams {
  id: number;
}

export interface DeleteBatchesParams {
  ids: string | string[] | number[];
}
