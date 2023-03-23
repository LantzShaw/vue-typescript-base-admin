import { defHttp } from '/@/utils/http/axios';

enum Api {
  ApplicationAdd = '/authorize/application/add',
  ApplicationUpdate = '/authorize/application/update',
  ApplicationDelete = '/authorize/application/delete',
  Application = '/authorize/application',
  ApplicationPage = '/authorize/application/page',
  ApplicationList = '/authorize/application/list',
  ApplicationForm = '/authorize/application/form',
  ApplicationSelect = '/authorize/application/option',
  ApplicationCheck = '/authorize/application/check-application-code',
}

export const applicationList = (params?: any) => defHttp.get({ url: Api.ApplicationList, params });

export const applicationPage = (params?: any) => defHttp.get({ url: Api.ApplicationPage, params });

export const applicationForm = (params?: any) => defHttp.get({ url: Api.ApplicationForm, params });

export const applicationSelect = (params?: any) =>
  defHttp.get({ url: Api.ApplicationSelect, params });

export const applicationAdd = (data?: any) => defHttp.post({ url: Api.ApplicationAdd, data });

export const applicationUpdate = (data?: any) => defHttp.post({ url: Api.ApplicationUpdate, data });

export const applicationDelete = (data?: any) => defHttp.delete({ url: Api.ApplicationDelete, data });

export const checkApplicationCode = (id: string, applicationCode: string) =>
  defHttp.get({ url: Api.ApplicationCheck, params: { id, applicationCode } });

export const applicationOwnScope = (params?: any) =>
  defHttp.get({ url: '/authorize/application-scope/own-scope', params });

export const applicationBindScope = (data?: any) =>
  defHttp.post({ url: '/authorize/application-scope/bind-scope', data });

export const applicationUnbindScope = (data?: any) =>
  defHttp.post({ url: '/authorize/application-scope/unbind-scope', data });
export const scopePage = (params?: any) =>
  defHttp.get({ url: '/authorize/application-scope/scope-page', params });
