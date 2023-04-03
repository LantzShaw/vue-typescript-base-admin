import { defHttp } from '/@/utils/http/axios';

enum Api {
  EmployeeAdd = '/upms/employee/add',
  EmployeeUpdate = '/upms/employee/update',
  EmployeeDelete = '/upms/employee/delete',
  Employee = '/upms/employee',
  EmployeePage = '/upms/employee/page',
  EmployeeList = '/upms/employee/list',
  EmployeeForm = '/upms/employee/form',
  EmployeeSelect = '/upms/employee/option',
  EmployeeCheck = '/upms/employee/check-employee-code',
  EmployeeAllocatable = '/upms/employee/allocatable',
  EmployeePageWithAssigned = '/upms/employee/page-assigned',
  EmployeePageWithUnassigned = '/upms/employee/page-unassigned',
  EmployeeAuthorize = '/upms/employee/authorize',
  EmployeeOrg = '/upms/employee/list-org',
}

export const employeeList = (params?: any) => defHttp.get({ url: Api.EmployeeList, params });

export const employeePage = (params?: any) => defHttp.get({ url: Api.EmployeePage, params });

export const employeePageWithAssigned = (params?: any) =>
  defHttp.get({ url: Api.EmployeePageWithAssigned, params });

export const employeePageWithUnassigned = (params?: any) =>
  defHttp.get({ url: Api.EmployeePageWithUnassigned, params });

export const employeeForm = (params?: any) => defHttp.get({ url: Api.EmployeeForm, params });

export const employeeSelect = (params?: any) => defHttp.get({ url: Api.EmployeeSelect, params });

export const employeeAdd = (data?: any) => defHttp.post({ url: Api.EmployeeAdd, data });

export const employeeUpdate = (data?: any) => defHttp.post({ url: Api.EmployeeUpdate, data });

export const employeeAllocatable = (data?: any) =>
  defHttp.post({ url: Api.EmployeeAllocatable, data });

export const employeeAllocatableRemove = (data?: any) =>
  defHttp.delete({ url: Api.EmployeeAllocatable, data });

export const employeeDelete = (data?: any) => defHttp.delete({ url: Api.EmployeeDelete, data });

export const checkEmployeeCode = (id: string, employeeCode: string) =>
  defHttp.get({ url: Api.EmployeeCheck, params: { id, employeeCode } });

export const employeeAuthorize = (data?: any) => defHttp.put({ url: Api.EmployeeAuthorize, data });

export const employeeOrg = (params?: any) => defHttp.get({ url: Api.EmployeeOrg, params });
