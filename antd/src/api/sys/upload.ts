import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/@/utils/http/axios/types';
import { useGlobSetting } from '/@/hooks/setting';

const { uploadUrl = '' /* urlPrefix */ } = useGlobSetting();

enum Api {
  uploadUrl = '/file',
}
/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams
  // onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl + Api.uploadUrl,
      // onUploadProgress,
    },
    params
  );
}
