import { defHttp } from '/@/utils/http/axios';

enum Api {
  QuartzLogPage = '/quartz-log/page-with-time',
  QuartzLogForm = '/quartz-log/form',
  QuartzLog = '/quartz-log',

  QuartzLogDelete = '/quartz-log/delete',
}

export const quartzLogPage = (params?: any) => defHttp.get({ url: Api.QuartzLogPage, params });

export const quartzLogForm = (params?: any) => defHttp.get({ url: Api.QuartzLogForm, params });

export const quartzLogDelete = (data?: any) => defHttp.delete({ url: Api.QuartzLogDelete, data });
