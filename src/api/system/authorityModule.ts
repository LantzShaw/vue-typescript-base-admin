import { defHttp } from '/@/utils/http/axios';

enum Api {
  AuthorityModuleTreeSync = '/upms/authority-module/tree-sync',
  AuthorityModule = '/upms/authority-module',
  AuthorityModuleAdd = '/upms/authority-module/add',
  AuthorityModuleUpdate = '/upms/authority-module/update',
  AuthorityModuleDelete = '/upms/authority-module/delete',
  AuthorityModuleForm = '/upms/authority-module/form',
  AuthorityModuleRevised = '/upms/authority-module/revised',
  AuthorityModuleTreeForEdit = '/upms/authority-module/tree-for-edit',
  AuthorityModuleTree = '/upms/authority-module/tree',
}

export const authorityModuleTreeSync = (params?: any) =>
  defHttp.get({ url: Api.AuthorityModuleTreeSync, params });

export const authorityModuleForm = (params?: any) =>
  defHttp.get({ url: Api.AuthorityModuleForm, params });

export const authorityModuleTree = (params?: any) =>
  defHttp.get({ url: Api.AuthorityModuleTree, params });

export const authorityModuleTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.AuthorityModuleTreeForEdit, params });

export const authorityModuleAdd = (data?: any) =>
  defHttp.post({ url: Api.AuthorityModuleAdd, data });

export const authorityModuleUpdate = (data?: any) =>
  defHttp.post({ url: Api.AuthorityModuleUpdate, data });

export const authorityModuleDelete = (data?: any) =>
  defHttp.delete({ url: Api.AuthorityModuleDelete, data });

export const authorityModuleRevised = (data?: any) =>
  defHttp.post({ url: Api.AuthorityModuleRevised, data });
