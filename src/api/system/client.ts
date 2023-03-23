import { defHttp } from '/@/utils/http/axios';

enum Api {
  ClientPage = '/upms/client/page',
  Client = '/upms/client',
  ClientForm = '/upms/client/form',
  ClientCheck = '/upms/client/check-conf-key',
}

export const clientPage = (params?: any) => defHttp.get({ url: Api.ClientPage, params });

export const clientForm = (params?: any) => defHttp.get({ url: Api.ClientForm, params });

export const clientAdd = (data?: any) => defHttp.post({ url: Api.Client, data });

export const clientUpdate = (data?: any) => defHttp.put({ url: Api.Client, data });

export const clientDelete = (data?: any) => defHttp.delete({ url: Api.Client, data });

export const checkConfKey = (id: string, confKey: string) =>
  defHttp.get({ url: Api.ClientCheck, params: { id, confKey } });
