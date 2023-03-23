import { defHttp } from '/@/utils/http/axios';

enum Api {
  Menu = '/upms/menu',
  MenuAdd = '/upms/menu/add',
  MenuUpdate = '/upms/menu/update',
  MenuDelete = '/upms/menu/delete',
  MenuForm = '/upms/menu/form',
  MenuRevised = '/upms/menu/revised',
  MenuTreeForEdit = '/upms/menu/tree-for-edit',
  MenuTree = '/upms/menu/tree',
  MenuOwnAuthority = '/upms/menu/own-authority',
}

export const menuForm = (params?: any) => defHttp.get({ url: Api.MenuForm, params });

export const menuTree = (params?: any) => defHttp.get({ url: Api.MenuTree, params });

export const menuTreeForEdit = (params?: any) => defHttp.get({ url: Api.MenuTreeForEdit, params });

export const menuAdd = (data?: any) => defHttp.post({ url: Api.MenuAdd, data });

export const menuUpdate = (data?: any) => defHttp.post({ url: Api.MenuUpdate, data });

export const menuDelete = (data?: any) => defHttp.delete({ url: Api.MenuDelete, data });

export const menuRevised = (data?: any) => defHttp.post({ url: Api.MenuRevised, data });

export const menuOwnAuthority = (params?: any) =>
  defHttp.get({ url: Api.MenuOwnAuthority, params });
