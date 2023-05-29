import { defHttp } from '/@/utils/http/axios';

enum Api {
  TokenDelete = '/authorize/authorization/delete-batch',
  TokenPage = '/authorize/authorization/page',
  TokenList = '/authorize/authorization/list',
  TokenForm = '/authorize/authorization/form',
}

export const tokenList = (params?: any) => defHttp.get({ url: Api.TokenList, params });

export const tokenPage = (params?: any) => defHttp.get({ url: Api.TokenPage, params });

export const tokenForm = (params?: any) => defHttp.get({ url: Api.TokenForm, params });

export const tokenDelete = (data?: any) => defHttp.delete({ url: Api.TokenDelete, data });
