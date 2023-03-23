import { defHttp } from '/@/utils/http/axios';

enum Api {
  DepartmentAdd = '/upms/department/add',
  DepartmentUpdate = '/upms/department/update',
  DepartmentDelete = '/upms/department/delete',
  Department = '/upms/department',
  DepartmentTreeForEdit = '/upms/department/tree-for-edit',

  DepartmentTree = '/upms/department/tree',
  DepartmentPage = '/upms/department/page',
  DepartmentList = '/upms/department/list',
  DepartmentForm = '/upms/department/form',
  DepartmentSelect = '/upms/department/option',
  DepartmentCheck = '/upms/department/check-department-code',
}

export const departmentList = (params?: any) => defHttp.get({ url: Api.DepartmentList, params });

export const departmentPage = (params?: any) => defHttp.get({ url: Api.DepartmentPage, params });

export const departmentForm = (params?: any) => defHttp.get({ url: Api.DepartmentForm, params });

export const departmentSelect = (params?: any) =>
  defHttp.get({ url: Api.DepartmentSelect, params });
export const departmentTree = (params?: any) => defHttp.get({ url: Api.DepartmentTree, params });
export const departmentTreeForEdit = (params?: any) =>
  defHttp.get({ url: Api.DepartmentTreeForEdit, params });

export const departmentAdd = (data?: any) => defHttp.post({ url: Api.DepartmentAdd, data });

export const departmentUpdate = (data?: any) => defHttp.post({ url: Api.DepartmentUpdate, data });

export const departmentDelete = (data?: any) => defHttp.delete({ url: Api.DepartmentDelete, data });

export const checkDepartmentCode = (id: string, departmentCode: string) =>
  defHttp.get({ url: Api.DepartmentCheck, params: { id, departmentCode } });
