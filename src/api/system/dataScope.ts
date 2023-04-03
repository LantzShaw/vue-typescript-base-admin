import { defHttp } from '/@/utils/http/axios';

enum Api {
  DataScopePage = '/upms/data-scope-rule/page',
  DataScopeForm = '/upms/data-scope-rule/form',
  DataScope = '/upms/data-scope-rule',
  DataScopeAdd = '/upms/data-scope-rule/add',
  DataScopeUpdate = '/upms/data-scope-rule/update',
  DataScopeDelete = '/upms/data-scope-rule/delete',

  DataScopeRefreshCache = '/upms/data-scope-rule/refresh-cache',

  DataScopeTree = '/upms/data-scope-rule/tree',
}

export const dataScopePage = (params?: any) => defHttp.get({ url: Api.DataScopePage, params });

export const dataScopeForm = (params?: any) => defHttp.get({ url: Api.DataScopeForm, params });

export const dataScopeAdd = (data?: any) => defHttp.post({ url: Api.DataScopeAdd, data });

export const dataScopeUpdate = (data?: any) => defHttp.post({ url: Api.DataScopeUpdate, data });

export const dataScopeDelete = (data?: any) => defHttp.delete({ url: Api.DataScopeDelete, data });

export const dataScopeRefreshCache = (data?: any) =>
  defHttp.post({ url: Api.DataScopeRefreshCache, data });

export const dataScopeTree = (params?: any) => defHttp.get({ url: Api.DataScopeTree, params });
