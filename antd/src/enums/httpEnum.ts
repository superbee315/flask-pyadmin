/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 1,
  ERROR = 0,
  TIMEOUT = 401,
  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/x-www-form-urlencoded',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
