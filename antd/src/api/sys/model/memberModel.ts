/**
 * @description: Get Unit list
 */
export interface GetUnitListModel {
  count: number;
  list: object[];
}

/**
 * @description: Get user information return value
 */
export interface DeleteBatchesParams {
  ids: string | string[] | number[];
}

/**
 * @description: id
 */
export interface UnitIdParams {
  id: string | number;
}
/**
 * @description: id
 */
export interface GetUnitModel {
  row: object[];
}

/**
 * @description: add Unit
 */
export interface AddUnitParams {
  id: number;
}
/**
 * @description: edit Unit
 */
export interface EditUnitParams {
  id: number;
}
/**
 * @description: Get Person list----------------------
 */
export interface GetPersonListModel {
  count: number;
  list: object[];
}
/**
 * @description: Get Person list----------------------
 */
export interface GetPersonListModel {
  count: number;
  list: object[];
}
/**
 * @description: Get Person
 */
export interface GetPersonModel {
  row: object[];
}

/**
 * @description: add Person
 */
export interface AddPersonParams {
  id: number;
}
/**
 * @description: id
 */
export interface PersonIdParams {
  id: string | number;
}
/**
 * @description: Get User
 */
export interface GetUserModel {
  row: object;
}

/**
 * @description: id
 */
export interface UserIdParams {
  id: string | number;
}
/**
 * @description: edit Person
 */
export interface EditPersonParams {
  id: number;
}
/**
 * @description: Get User list----------------------
 */
export interface GetUserListModel {
  count: number;
  list: object[];
}
/**
 * @description: add User
 */
export interface AddUserParams {
  id: number;
}
/**
 * @description: edit User
 */
export interface EditUserParams {
  id: number;
}

// --------------审批记录----------------
/**
 * @description: get check record list
 */
export interface GetCheckRecordkListModel {
  count: number;
  list: object[];
}
/**
 * @description: add check record
 */
export interface ChecRecordIdParams {
  id: number;
}
/**
 * @description: get check record
 */
export interface GetCheckRecordModel {
  row: [];
}
