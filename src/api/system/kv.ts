import { defHttp } from '/@/utils/http/axios';

enum Api {
  KvPage = '/base/kv/page',
  KvForm = '/base/kv/form',
  Kv = '/base/kv',
  KvAdd = '/base/kv/add',
  KvUpdate = '/base/kv/update',
  KvDelete = '/base/kv/delete',
  KvCheck = '/base/kv/check-code',
  KvDeletePhysic = '/base/kv/delete-physic',
  KvRecovery = '/base/kv/recovery',
  KvDeleteList = '/base/kv/list-delete-data',
  KvRefreshCache = '/base/kv/refresh-cache',
}

export const kvPage = (params?: any) => defHttp.get({ url: Api.KvPage, params });

export const kvForm = (params?: any) => defHttp.get({ url: Api.KvForm, params });

export const kvAdd = (data?: any) => defHttp.post({ url: Api.KvAdd, data });

export const kvUpdate = (data?: any) => defHttp.post({ url: Api.KvUpdate, data });

export const kvDelete = (data?: any) => defHttp.delete({ url: Api.KvDelete, data });

export const checkCode = (id: string, code: string) =>
  defHttp.get({ url: Api.KvCheck, params: { id, code } });

export const kvDeleteList = (params?: any) => defHttp.get({ url: Api.KvDeleteList, params });

export const kvRecovery = (data?: any) => defHttp.post({ url: Api.KvRecovery, data });

export const kvDeletePhysic = (data?: any) => defHttp.delete({ url: Api.KvDeletePhysic, data });

export const kvRefreshCache = (data?: any) => defHttp.post({ url: Api.KvRefreshCache, data });
