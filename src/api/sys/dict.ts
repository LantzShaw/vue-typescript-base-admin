import { defHttp } from '/@/utils/http/axios';
enum Api {
  OPTIONS_LIST = '/base/dict/option',
  OPTIONS_LIST3 = '/base/dict/data',
}

export const optionsListApi = (params?: any) => defHttp.get({ url: Api.OPTIONS_LIST, params });
export const optionsListBatchApi = (data?: any) => defHttp.post({ url: Api.OPTIONS_LIST3, data });
