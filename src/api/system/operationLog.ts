import { defHttp } from '/@/utils/http/axios';

export const operationLogPage = (params?: any) =>
  defHttp.get({ url: '/log/operation-log/page', params });

export const operationLogDelete = (data?: any) =>
  defHttp.post({ url: '/log/operation-log/delete', data });

export const operationLogPage2 = (params?: any) =>
  defHttp.get({ url: '/log/operation-log/bar-chart-data', params });

export const operationLogPage3 = (params?: any) =>
  defHttp.get({ url: '/log/operation-log/pie-chart-data', params });
