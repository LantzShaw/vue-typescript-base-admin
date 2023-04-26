import { defHttp } from '/@/utils/http/axios';

enum Api {
  PermissionPage = '/upms/permission/page',
  PermissionTreeSync = '/upms/permission/tree-sync',
  Permission = '/upms/permission',
  PermissionAdd = '/upms/permission/add',
  PermissionUpdate = '/upms/permission/update',
  PermissionDelete = '/upms/permission/delete',
  PermissionForm = '/upms/permission/form',
  PermissionRevised = '/upms/permission/revised',
  PermissionTreeForEdit = '/upms/permission/tree-for-edit',
  PermissionTree = '/upms/permission/tree',
}
export const permissionPage = (params?: any) => defHttp.get({ url: Api.PermissionPage, params });

export const permissionTreeSync = (params?: any) =>
  defHttp.get({ url: Api.PermissionTreeSync, params });

export const permissionForm = (params?: any) => defHttp.get({ url: Api.PermissionForm, params });

export const permissionTree = (params?: any) => defHttp.get({ url: Api.PermissionTree, params });

export const permissionTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.PermissionTreeForEdit, params });

export const permissionAdd = (data?: any) => defHttp.post({ url: Api.PermissionAdd, data });

export const permissionUpdate = (data?: any) => defHttp.post({ url: Api.PermissionUpdate, data });

export const permissionDelete = (data?: any) => defHttp.delete({ url: Api.PermissionDelete, data });

export const permissionRevised = (data?: any) => defHttp.post({ url: Api.PermissionRevised, data });
