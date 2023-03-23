import { defHttp } from '/@/utils/http/axios';

enum Api {
  Org = '/upms/organization',
  OrgAdd = '/upms/organization/add',
  OrgUpdate = '/upms/organization/update',
  OrgDelete = '/upms/organization/delete',
  OrgForm = '/upms/organization/form',
  OrgTree = '/upms/organization/tree',
  OrgTreeSync = '/upms/organization/tree-sync',
  OrgSearch = '/upms/organization/search',
  OrgRevised = '/upms/organization/revised',
  OrgTreeForEdit = '/upms/organization/tree-for-edit',
  OrgSelect = '/upms/organization/option',
  OrgCheck = '/upms/organization/check-id',
  OrgOwnMenu = '/upms/organization-menu/own-menu',
  OrgGrantMenu = '/upms/organization-menu/save',
}

export const orgForm = (params?: any) => defHttp.get({ url: Api.OrgForm, params });

export const orgTree = (params?: any) => defHttp.get({ url: Api.OrgTree, params });

export const orgTreeSync = (params?: any) => defHttp.get({ url: Api.OrgTreeSync, params });

export const orgSearch = (params?: any) => defHttp.get({ url: Api.OrgSearch, params });

export const orgTreeForEdit = (params?: any) => defHttp.get({ url: Api.OrgTreeForEdit, params });

export const orgAdd = (params?: any) => defHttp.post({ url: Api.OrgAdd, params });

export const orgUpdate = (data?: any) => defHttp.post({ url: Api.OrgUpdate, data });

export const orgDelete = (data?: any) => defHttp.delete({ url: Api.OrgDelete, data });

export const orgRevised = (data?: any) => defHttp.post({ url: Api.OrgRevised, data });

export const orgSelect = (params?: any) => defHttp.get({ url: Api.OrgSelect, params });

export const checkId = (id: string, newId: string) =>
  defHttp.get({ url: Api.OrgCheck, params: { id, newId } });

export const orgOwnMenu = (params?: any) => defHttp.get({ url: Api.OrgOwnMenu, params });

export const orgGrantMenu = (data?: any) => defHttp.post({ url: Api.OrgGrantMenu, data });
