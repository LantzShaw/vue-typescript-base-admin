import { defHttp } from '/@/utils/http/axios';

enum Api {
  ScopeAdd = '/authorize/scope/add',
  ScopeUpdate = '/authorize/scope/update',
  ScopeDelete = '/authorize/scope/delete',
  Scope = '/authorize/scope',
  ScopePage = '/authorize/scope/page',
  ScopeList = '/authorize/scope/list',
  ScopeForm = '/authorize/scope/form',
  ScopeSelect = '/authorize/scope/option',
  ScopeCheck = '/authorize/scope/check-scope-code',
}

export const scopeList = (params?: any) => defHttp.get({ url: Api.ScopeList, params });

export const scopePage = (params?: any) => defHttp.get({ url: Api.ScopePage, params });

export const scopeForm = (params?: any) => defHttp.get({ url: Api.ScopeForm, params });

export const scopeSelect = (params?: any) => defHttp.get({ url: Api.ScopeSelect, params });

export const scopeAdd = (data?: any) => defHttp.post({ url: Api.ScopeAdd, data });

export const scopeUpdate = (data?: any) => defHttp.post({ url: Api.ScopeUpdate, data });

export const scopeDelete = (data?: any) => defHttp.delete({ url: Api.ScopeDelete, data });

export const checkApplicationCode = (id: string, scopeCode: string) =>
  defHttp.get({ url: Api.ScopeCheck, params: { id, scopeCode } });

export const scopeOwnAuthority = (params?: any) =>
  defHttp.get({ url: '/authorize/scope-authority/own-authority', params });

export const scopeBindAuthority = (data?: any) =>
  defHttp.post({ url: '/authorize/scope-authority/bind-authority', data });

export const scopeUnbindAuthority = (data?: any) =>
  defHttp.post({ url: '/authorize/scope-authority/unbind-authority', data });
export const authorityPage = (params?: any) =>
  defHttp.get({ url: '/authorize/scope-authority/authority-page', params });
