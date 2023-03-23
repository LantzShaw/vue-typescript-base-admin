import { defHttp } from '/@/utils/http/axios';

enum Api {
  DictPage = '/base/dict/page',
  DictForm = '/base/dict/form',
  Dict = '/base/dict',
  DictAdd = '/base/dict/add',
  DictUpdate = '/base/dict/update',
  DictDelete = '/base/dict/delete',
  DictCheck = '/base/dict/check-code',
  DictDeletePhysic = '/base/dict/delete-physic',
  DictRecovery = '/base/dict/recovery',
  DictDeleteList = '/base/dict/list-delete-data',
  DictRefreshCache = '/base/dict/refresh-cache',
}

export const dictPage = (params?: any) => defHttp.get({ url: Api.DictPage, params });

export const dictForm = (params?: any) => defHttp.get({ url: Api.DictForm, params });

export const dictAdd = (data?: any) => defHttp.post({ url: Api.DictAdd, data });

export const dictUpdate = (data?: any) => defHttp.post({ url: Api.DictUpdate, data });

export const dictDelete = (data?: any) => defHttp.delete({ url: Api.DictDelete, data });

export const checkCode = (id: string, code: string) =>
  defHttp.get({ url: Api.DictCheck, params: { id, code } });

export const dictDeleteList = (params?: any) => defHttp.get({ url: Api.DictDeleteList, params });

export const dictRecovery = (data?: any) => defHttp.post({ url: Api.DictRecovery, data });

export const dictDeletePhysic = (data?: any) => defHttp.delete({ url: Api.DictDeletePhysic, data });

export const dictRefreshCache = (data?: any) => defHttp.post({ url: Api.DictRefreshCache, data });
