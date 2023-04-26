import { defHttp } from '/@/utils/http/axios';

enum Api {
  AttributePage = '/upms/attribute/page',
  AttributeAdd = '/upms/attribute/add',
  AttributeUpdate = '/upms/attribute/update',
  AttributeDelete = '/upms/attribute/delete',
  AttributeForm = '/upms/attribute/form',
  AttributeCheck = '/upms/attribute/check-conf-key',
  AttributeOwnPermission = '/upms/attribute/own-permission',
  AttributeGrantPermission = '/upms/attribute/grant-permission',
}

export const attributePage = (params?: any) => defHttp.get({ url: Api.AttributePage, params });

export const attributeForm = (params?: any) => defHttp.get({ url: Api.AttributeForm, params });

export const attributeAdd = (data?: any) => defHttp.post({ url: Api.AttributeAdd, data });

export const attributeUpdate = (data?: any) => defHttp.post({ url: Api.AttributeUpdate, data });

export const attributeDelete = (data?: any) => defHttp.delete({ url: Api.AttributeDelete, data });

export const checkConfKey = (id: string, confKey: string) =>
  defHttp.get({ url: Api.AttributeCheck, params: { id, confKey } });

export const attributeOwnPermission = (params?: any) =>
  defHttp.get({ url: Api.AttributeOwnPermission, params });

export const attributeGrantPermission = (data?: any) =>
  defHttp.post({ url: Api.AttributeGrantPermission, data });
