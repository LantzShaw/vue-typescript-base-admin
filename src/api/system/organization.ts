import { defHttp } from '/@/utils/http/axios';

enum Api {
  Organization = '/upms/organization',
  OrganizationAdd = '/upms/organization/add',
  OrganizationUpdate = '/upms/organization/update',
  OrganizationDelete = '/upms/organization/delete',
  OrganizationForm = '/upms/organization/form',
  OrganizationTree = '/upms/organization/tree',
  OrganizationUnitTree = '/upms/organization/unit-tree',
  OrganizationDepartmentTree = '/upms/organization/department-tree',
  OrganizationTreeSync = '/upms/organization/tree-sync',
  OrganizationSearch = '/upms/organization/search',
  OrganizationRevised = '/upms/organization/revised',
  OrganizationTreeForEdit = '/upms/organization/tree-for-edit',
  OrganizationSelect = '/upms/organization/option',
  OrganizationCheck = '/upms/organization/check-id',
  OrganizationOwnMenu = '/upms/organization-menu/own-menu',
  OrganizationGrantMenu = '/upms/organization-menu/save',
}

export const organizationForm = (params?: any) =>
  defHttp.get({ url: Api.OrganizationForm, params });

export const organizationUnitTree = (params?: any) =>
  defHttp.get({ url: Api.OrganizationUnitTree, params });

export const organizationDepartmentTree = (params?: any) =>
  defHttp.get({ url: Api.OrganizationDepartmentTree, params });

export const organizationTree = (params?: any) =>
  defHttp.get({ url: Api.OrganizationTree, params });

export const organizationTreeSync = (params?: any) =>
  defHttp.get({ url: Api.OrganizationTreeSync, params });

export const organizationSearch = (params?: any) =>
  defHttp.get({ url: Api.OrganizationSearch, params });

export const organizationTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.OrganizationTreeForEdit, params });

export const organizationAdd = (params?: any) => defHttp.post({ url: Api.OrganizationAdd, params });

export const organizationUpdate = (data?: any) =>
  defHttp.post({ url: Api.OrganizationUpdate, data });

export const organizationDelete = (data?: any) =>
  defHttp.delete({ url: Api.OrganizationDelete, data });

export const organizationRevised = (data?: any) =>
  defHttp.post({ url: Api.OrganizationRevised, data });

export const organizationSelect = (params?: any) =>
  defHttp.get({ url: Api.OrganizationSelect, params });

export const checkId = (id: string, newId: string) =>
  defHttp.get({ url: Api.OrganizationCheck, params: { id, newId } });

export const organizationOwnMenu = (params?: any) =>
  defHttp.get({ url: Api.OrganizationOwnMenu, params });

export const organizationGrantMenu = (data?: any) =>
  defHttp.post({ url: Api.OrganizationGrantMenu, data });
