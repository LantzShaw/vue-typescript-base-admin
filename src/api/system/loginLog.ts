import { defHttp } from '/@/utils/http/axios';

export const loginLogPage = (params?: any) => defHttp.get({ url: '/log/login-log/page', params });

export const loginLogDelete = (data?: any) =>
  defHttp.delete({ url: '/log/login-log/delete', data });
