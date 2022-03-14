/**
 * @description: Get common information return value
 */
export interface CommonRowModel {
  rows: object[];
}
/**
 * @description: Get app information return value
 */
export interface AppInfoModel {
  name: string;
  logo: string;
}

/**
 * @description: Get group information return value
 */
export interface GroupModel {
  group: object[];
}

/**
 * @description: Get group information return value
 */
export interface configNameExistModel {
  bool: boolean;
}

/**
 * @description: 添加系统配置参数
 */
export interface AddConfigInfoParams {
  type: string;
  group: string;
  name: string;
  title: string;
  tip?: string;
  value?: string;
  rule?: string;
  expend?: string;
}

// /**
//  * @description: 修改系统配置参数
//  */
// export interface EditConfigInfoParams {
//   id: number;
// }
/**
 * @description: 删除系统配置参数
 */
export interface DeleteConfigInfoParams {
  id: number;
}

/**
 * @description: 系统配置变量名参数
 */
export interface ConfigNameParams {
  name: string;
}

/**
 * @description: 删除附件参数
 */
export interface DeleteAttachmentParams {
  id: number;
}

/**
 * @description: 批量删除附件参数
 */
export interface DeleteBatchesParams {
  ids: string | string[] | number[];
}