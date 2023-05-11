import { defHttp } from '/@/utils/http/axios';

enum Api {
  EnterprisePage = '/biz/enterprise/page',
  EnterpriseDelete = '/biz/enterprise/delete',
  EnterpriseAdd = '/biz/enterprise/add',
  EnterpriseUpdate = '/biz/enterprise/update',
  EnterpriseList = '/biz/enterprise/list',
  EnterpriseForm = '/biz/enterprise/form',
  EnterpriseSelect = '/biz/enterprise/option',
}

export const enterprisePage = (params?: any) => defHttp.get({ url: Api.EnterprisePage, params });
export const enterpriseDelete = (data?: any) => defHttp.delete({ url: Api.EnterpriseDelete, data });
export const enterpriseAdd = (data?: any) => defHttp.post({ url: Api.EnterpriseAdd, data });
export const enterpriseUpdate = (data?: any) => defHttp.post({ url: Api.EnterpriseUpdate, data });
export const enterpriseForm = (params?: any) => defHttp.get({ url: Api.EnterpriseForm, params });
export const enterpriseSelect = (params?: any) =>
  defHttp.get({ url: Api.EnterpriseSelect, params });
