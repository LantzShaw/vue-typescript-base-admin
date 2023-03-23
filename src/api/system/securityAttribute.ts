import { defHttp } from '/@/utils/http/axios';

enum Api {
  SecurityAttributePage = '/upms/security-attribute/page',
  SecurityAttributeAdd = '/upms/security-attribute/add',
  SecurityAttributeUpdate = '/upms/security-attribute/update',
  SecurityAttributeDelete = '/upms/security-attribute/delete',
  SecurityAttributeForm = '/upms/security-attribute/form',
  SecurityAttributeCheck = '/upms/security-attribute/check-conf-key',
}

export const securityAttributePage = (params?: any) =>
  defHttp.get({ url: Api.SecurityAttributePage, params });

export const securityAttributeForm = (params?: any) =>
  defHttp.get({ url: Api.SecurityAttributeForm, params });

export const securityAttributeAdd = (data?: any) =>
  defHttp.post({ url: Api.SecurityAttributeAdd, data });

export const securityAttributeUpdate = (data?: any) =>
  defHttp.post({ url: Api.SecurityAttributeUpdate, data });

export const securityAttributeDelete = (data?: any) =>
  defHttp.delete({ url: Api.SecurityAttributeDelete, data });

export const checkConfKey = (id: string, confKey: string) =>
  defHttp.get({ url: Api.SecurityAttributeCheck, params: { id, confKey } });
