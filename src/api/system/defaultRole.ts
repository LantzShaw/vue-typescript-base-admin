import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
enum Api {
  DefaultRole = '/upms/default-role',
  DefaultRoleAdd = '/upms/default-role/add',
  DefaultRoleUpdate = '/upms/default-role/update',
  DefaultRoleDelete = '/upms/default-role/delete',
  DefaultRoleForm = '/upms/default-role/form',
  DefaultRoleCheck = '/upms/default-role/check-role-code',
  DefaultRolePage = '/upms/default-role/page',
  DefaultRoleOwnMenu = '/upms/role-menu/own-menu',
  DefaultRoleGrantMenu = '/upms/role-menu/save',
  DefaultRoleSelect = '/upms/role/option',
}

export const defaultRolePage = (params?: any) => defHttp.get({ url: Api.DefaultRolePage, params });

export const defaultRoleSelect = (params?: any) =>
  defHttp.get({ url: Api.DefaultRoleSelect, params });

export const defaultRoleOwnMenu = (params?: any) =>
  defHttp.get({ url: Api.DefaultRoleOwnMenu, params });

export const defaultRoleGrantMenu = (data?: any) =>
  defHttp.post({ url: Api.DefaultRoleGrantMenu, data });

export const defaultRoleAdd = (data?: any) => defHttp.post({ url: Api.DefaultRoleAdd, data });

export const defaultRoleUpdate = (data?: any) => defHttp.post({ url: Api.DefaultRoleUpdate, data });

export const defaultRoleDelete = (params?: any) =>
  defHttp.delete({ url: Api.DefaultRoleDelete, params });

export const checkRoleCode = (id: string, roleCode: string) =>
  defHttp.get({ url: Api.DefaultRoleCheck, params: { id, roleCode } });

export const defaultRoleForm = (params?: any) => defHttp.get({ url: Api.DefaultRoleForm, params });

export const defaultRoleAccountTypeSelect = (params?: any) =>
  defHttp.get({ url: '/upms/default-role/list-account-type', params });
