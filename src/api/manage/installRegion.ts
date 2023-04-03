import { defHttp } from '/@/utils/http/axios';

enum Api {
  InstallRegionPage = '/biz/install-region/page',
  InstallRegionDelete = '/biz/install-region/delete',
  InstallRegionAdd = '/biz/install-region/add',
  InstallRegionUpdate = '/biz/install-region/update',
  InstallRegionList = '/biz/install-region/list',
  InstallRegionForm = '/biz/install-region/form',
  InstallRegionSync = '/biz/install-region/sync',
}

export const installRegionPage = (params?: any) =>
  defHttp.get({ url: Api.InstallRegionPage, params });
export const installRegionDelete = (data?: any) =>
  defHttp.delete({ url: Api.InstallRegionDelete, data });
export const installRegionAdd = (data?: any) => defHttp.post({ url: Api.InstallRegionAdd, data });
export const installRegionUpdate = (data?: any) =>
  defHttp.post({ url: Api.InstallRegionUpdate, data });
export const installRegionForm = (params?: any) =>
  defHttp.get({ url: Api.InstallRegionForm, params });

export const installRegionSync = (data?: any) => defHttp.post({ url: Api.InstallRegionSync, data });
