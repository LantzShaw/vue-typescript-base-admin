import { defHttp } from '/@/utils/http/axios';

enum Api {
  ConfigPage = '/base/parameter/page',
  Config = '/base/parameter',
  ConfigAdd = '/base/parameter/add',
  ConfigUpdate = '/base/parameter/update',
  ConfigForm = '/base/parameter/form',
  ConfigCheck = '/base/parameter/check-key',
}

export const configPage = (params?: any) => defHttp.get({ url: Api.ConfigPage, params });

export const configForm = (params?: any) => defHttp.get({ url: Api.ConfigForm, params });

export const configAdd = (data?: any) => defHttp.post({ url: Api.ConfigAdd, data });

export const configUpdate = (data?: any) => defHttp.post({ url: Api.ConfigUpdate, data });

export const configDelete = (data?: any) => defHttp.delete({ url: Api.Config, data });

export const checkConfKey = (id: string, key: string) =>
  defHttp.get({ url: Api.ConfigCheck, params: { id, key } });
