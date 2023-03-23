import { defHttp } from '/@/utils/http/axios';

enum Api {
  AuthorityPage = '/upms/authority/page',
  AuthorityTreeSync = '/upms/authority/tree-sync',
  Authority = '/upms/authority',
  AuthorityAdd = '/upms/authority/add',
  AuthorityUpdate = '/upms/authority/update',
  AuthorityDelete = '/upms/authority/delete',
  AuthorityForm = '/upms/authority/form',
  AuthorityRevised = '/upms/authority/revised',
  AuthorityTreeForEdit = '/upms/authority/tree-for-edit',
  AuthorityTree = '/upms/authority/tree',
}
export const authorityPage = (params?: any) => defHttp.get({ url: Api.AuthorityPage, params });

export const authorityTreeSync = (params?: any) =>
  defHttp.get({ url: Api.AuthorityTreeSync, params });

export const authorityForm = (params?: any) => defHttp.get({ url: Api.AuthorityForm, params });

export const authorityTree = (params?: any) => defHttp.get({ url: Api.AuthorityTree, params });

export const authorityTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.AuthorityTreeForEdit, params });

export const authorityAdd = (data?: any) => defHttp.post({ url: Api.AuthorityAdd, data });

export const authorityUpdate = (data?: any) => defHttp.post({ url: Api.AuthorityUpdate, data });

export const authorityDelete = (data?: any) => defHttp.delete({ url: Api.AuthorityDelete, data });

export const authorityRevised = (data?: any) => defHttp.post({ url: Api.AuthorityRevised, data });
