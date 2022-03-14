/**
 * @description: 获取自定义表单
 */
export interface GetModelListModel {
  count: number;
  list: object[];
}

/**
 * @description: id
 */
export interface ModelIdParams {
  id: string | number;
}
/**
 * @description: id
 */
export interface GetModelModel {
  row: object[];
}

/**
 * @description: add Model
 */
export interface AddModelParams {
  id: number;
}

/**
 * @description: edit Model
 */
export interface EditModelParams {
  id: number;
}
/**
 * @description: id
 */
export interface FieldIdParams {
  id: string | number;
}
/**
 * @description: id
 */
export interface GetFieldModel {
  row: object[];
}

/**
 * @description: add Filed
 */
export interface AddFieldParams {
  id: number;
}

/**
 * @description: edit Filed
 */
export interface EditFieldParams {
  id: number;
}