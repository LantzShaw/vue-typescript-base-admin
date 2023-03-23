import { defHttp } from '/@/utils/http/axios';

enum Api {
  Login = '/oauth/token',
  Logout = '/oauth/logout',
  GetUserInfo = '/system/sysAuth/getUserInfo',
  GetPermCode = '/getPermCode',
  GetRoleList = '/system/sysUser/page',
  User = '/upms/user',
}

export const userPage = (params?: any) => defHttp.get({ url: '/upms/user/page', params });

export const userPageWithOrganization = (params?: any) =>
  defHttp.get({ url: '/upms/user/page-with-organization', params });

export const userGet = (params?: any) => defHttp.get({ url: '/upms/user/detail', params });

export const userForm = (params?: any) => defHttp.get({ url: '/upms/user/form', params });

export const userOwnMenu = (params?: any) => defHttp.get({ url: '/upms/user/ownMenu', params });

export const userOwnOrganization = (params?: any) =>
  defHttp.get({ url: '/upms/user-organization/own-organization', params });

export const userOwnRole = (params?: any) =>
  defHttp.get({ url: '/upms/user-role/own-role', params });

export const userGrantRole = (data?: any) => defHttp.post({ url: '/upms/user-role/save', data });

export const userBindRole = (data?: any) =>
  defHttp.post({ url: '/upms/user-role/bind-role', data });

export const userUnbindRole = (data?: any) =>
  defHttp.post({ url: '/upms/user-role/unbind-role', data });

export const userRolePage = (params?: any) =>
  defHttp.get({ url: '/upms/user-role/role-page', params });

export const userGrantMenu = (params?: any) =>
  defHttp.post({ url: '/upms/user/grantMenu', params });

export const userAdd = (data?: any) => defHttp.post({ url: '/upms/user/add', data });

export const userUpdate = (data?: any) => defHttp.post({ url: '/upms/user/update', data });

export const userUpdatePassword = (data?: any) =>
  defHttp.post({ url: '/upms/user/change-password', data });

export const userDelete = (data?: any) => defHttp.delete({ url: '/upms/user/delete', data });

export const userBatchDelete = (data?: any) =>
  defHttp.delete({ url: '/upms/user/delete-batch', data });

export const getRoleOwnData = (params?: any) => defHttp.get({ url: '/upms/user/ownData', params });

export const checkUsername = (id: string, username: string) =>
  defHttp.get({
    url: '/upms/user/check-username',
    params: { id, username },
  });

export const userSelect = (params?: any) => defHttp.get({ url: '/upms/user/option', params });
