import { defHttp } from '/@/utils/http/axios';

enum Api {
  Org = '/system/org',
  OrgForm = '/system/org/form',
  OrgTree = '/system/org/tree',
  OrgRevised = '/system/org/revised',
  OrgTreeForEdit = '/system/org/tree-for-edit',
  OrgSelect = '/system/org/option',
}

export const orgForm = (params?: any) => defHttp.get({ url: Api.OrgForm, params });

export const orgTree = (params?: any) => defHttp.get({ url: Api.OrgTree, params });

export const orgTreeForEdit = (params?: any) => defHttp.get({ url: Api.OrgTreeForEdit, params });

export const orgAdd = (params?: any) => defHttp.post({ url: Api.Org, params });

export const orgUpdate = (data?: any) => defHttp.put({ url: Api.Org, data });

export const orgDelete = (data?: any) => defHttp.delete({ url: Api.Org, data });

export const orgRevised = (data?: any) => defHttp.post({ url: Api.OrgRevised, data });

export const orgSelect = (params?: any) => defHttp.get({ url: Api.OrgSelect, params });
