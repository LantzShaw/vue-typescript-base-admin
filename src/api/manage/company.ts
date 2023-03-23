import { defHttp } from '/@/utils/http/axios';

enum Api {
  CompanyPage = '/biz/enterprise/page',
  CompanyDelete = '/biz/enterprise/delete',
  CompanyAdd = '/biz/enterprise/add',
  CompanyUpdate = '/biz/enterprise/edit',
  CompanyList = '/biz/enterprise/list',
  CompanyForm = '/biz/enterprise/form',
}

export const companyPage = (params?: any) => defHttp.get({ url: Api.CompanyPage, params });
export const companyDelete = (data?: any) => defHttp.delete({ url: Api.CompanyDelete, data });
export const companyAdd = (data?: any) => defHttp.post({ url: Api.CompanyAdd, data });
export const companyUpdate = (data?: any) => defHttp.post({ url: Api.CompanyUpdate, data });
export const companyForm = (params?: any) => defHttp.get({ url: Api.CompanyForm, params });
