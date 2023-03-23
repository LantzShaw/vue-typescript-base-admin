import { defHttp } from '/@/utils/http/axios';

enum Api {
  ApplicationAdd = '/upms/application/add',
  ApplicationUpdate = '/upms/application/update',
  ApplicationDelete = '/upms/application/delete',
  Application = '/upms/application',
  ApplicationPage = '/upms/application/page',
  ApplicationList = '/upms/application/list',
  ApplicationForm = '/upms/application/form',
  ApplicationSelect = '/upms/application/option',
  ApplicationCheck = '/upms/application/check-application-code',
}

export const applicationList = (params?: any) => defHttp.get({ url: Api.ApplicationList, params });

export const applicationPage = (params?: any) => defHttp.get({ url: Api.ApplicationPage, params });

export const applicationForm = (params?: any) => defHttp.get({ url: Api.ApplicationForm, params });

export const applicationSelect = (params?: any) =>
  defHttp.get({ url: Api.ApplicationSelect, params });

export const applicationAdd = (data?: any) => defHttp.post({ url: Api.ApplicationAdd, data });

export const applicationUpdate = (data?: any) => defHttp.post({ url: Api.ApplicationUpdate, data });

export const applicationDelete = (data?: any) =>
  defHttp.delete({ url: Api.ApplicationDelete, data });

export const checkApplicationCode = (id: string, applicationCode: string) =>
  defHttp.get({ url: Api.ApplicationCheck, params: { id, applicationCode } });
