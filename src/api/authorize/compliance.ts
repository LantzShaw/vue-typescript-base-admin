import { defHttp } from '/@/utils/http/axios';

enum Api {
  ComplianceAdd = '/authorize/compliance/add',
  ComplianceUpdate = '/authorize/compliance/update',
  Compliance = '/authorize/compliance',
  CompliancePage = '/authorize/compliance/page',
  ComplianceList = '/authorize/compliance/list',
  ComplianceForm = '/authorize/compliance/form',
  ComplianceSelect = '/authorize/compliance/option',
  ComplianceCheck = '/authorize/compliance/check-compliance-code',
}

export const complianceList = (params?: any) => defHttp.get({ url: Api.ComplianceList, params });

export const compliancePage = (params?: any) => defHttp.get({ url: Api.CompliancePage, params });

export const complianceForm = (params?: any) => defHttp.get({ url: Api.ComplianceForm, params });

export const complianceSelect = (params?: any) =>
  defHttp.get({ url: Api.ComplianceSelect, params });

export const complianceAdd = (data?: any) => defHttp.post({ url: Api.ComplianceAdd, data });

export const complianceUpdate = (data?: any) => defHttp.post({ url: Api.ComplianceUpdate, data });

export const complianceDelete = (data?: any) => defHttp.delete({ url: Api.Compliance, data });

export const checkApplicationCode = (id: string, complianceCode: string) =>
  defHttp.get({ url: Api.ComplianceCheck, params: { id, complianceCode } });

export const lineChartData = (params?: any) =>
  defHttp.get({ url: '/authorize/compliance/line-chart-data', params });

export const pieChartData = (params?: any) =>
  defHttp.get({ url: '/authorize/compliance/pie-chart-data', params });
