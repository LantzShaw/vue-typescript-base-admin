import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
enum Api {
  Role = '/upms/role',
  RoleAdd = '/upms/role/add',
  RoleUpdate = '/upms/role/update',
  RoleDelete = '/upms/role/delete',
  RoleForm = '/upms/role/form',
  RoleCheck = '/upms/role/check-role-code',
  RolePage = '/upms/role/page',
  RoleOwnMenu = '/upms/role-menu/own-menu',
  RoleGrantMenu = '/upms/role/grant-menu',
  RoleOwnAuthority = '/upms/role/own-authority',
  RoleGrantAuthority = '/upms/role/grant-authority',
  RoleOwnDataScope = '/upms/role/own-data-scope',
  RoleGrantDataScope = '/upms/role/grant-data-scope',
  RoleSelect = '/upms/role/option',
}

export const rolePage = (params?: any) => defHttp.get({ url: Api.RolePage, params });

export const roleSelect = (params?: any) => defHttp.get({ url: Api.RoleSelect, params });

export const roleOwnMenu = (params?: any) => defHttp.get({ url: Api.RoleOwnMenu, params });

export const roleGrantMenu = (data?: any) => defHttp.post({ url: Api.RoleGrantMenu, data });

export const roleOwnAuthority = (params?: any) =>
  defHttp.get({ url: Api.RoleOwnAuthority, params });

export const roleGrantAuthority = (data?: any) =>
  defHttp.post({ url: Api.RoleGrantAuthority, data });

export const roleOwnDataScope = (params?: any) =>
  defHttp.get({ url: Api.RoleOwnDataScope, params });

export const roleGrantDataScope = (data?: any) =>
  defHttp.post({ url: Api.RoleGrantDataScope, data });

export const roleAdd = (data?: any) => defHttp.post({ url: Api.RoleAdd, data });

export const roleUpdate = (data?: any) => defHttp.post({ url: Api.RoleUpdate, data });

export const roleDelete = (params?: any) => defHttp.delete({ url: Api.RoleDelete, params });

export const checkRoleCode = (id: string, roleCode: string) =>
  defHttp.get({ url: Api.RoleCheck, params: { id, roleCode } });

export const roleForm = (params?: any) => defHttp.get({ url: Api.RoleForm, params });
