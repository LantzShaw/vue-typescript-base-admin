import { defHttp } from '/@/utils/http/axios';

enum Api {
  QuartzPage = '/quartz/page',
  QuartzForm = '/quartz/form',
  Quartz = '/quartz',
  QuartzAdd = '/quartz/add',
  QuartzUpdate = '/quartz/update',
  QuartzDelete = '/quartz/delete',
  QuartzCheck = '/quartz/check-code',
  QuartzDeletePhysic = '/quartz/delete-physic',
  QuartzRecovery = '/quartz/recovery',
  QuartzDeleteList = '/quartz/list-delete-data',
  QuartzExecute = '/quartz/execute',
  QuartzResume = '/quartz/start',
  QuartzPause = '/quartz/stop',
}

export const quartzPage = (params?: any) => defHttp.get({ url: Api.QuartzPage, params });

export const quartzForm = (params?: any) => defHttp.get({ url: Api.QuartzForm, params });

export const quartzAdd = (data?: any) => defHttp.post({ url: Api.QuartzAdd, data });

export const quartzUpdate = (data?: any) => defHttp.post({ url: Api.QuartzUpdate, data });

export const quartzDelete = (data?: any) => defHttp.delete({ url: Api.QuartzDelete, data });

export const checkCode = (id: string, code: string) =>
  defHttp.get({ url: Api.QuartzCheck, params: { id, code } });

export const quartzDeleteList = (params?: any) =>
  defHttp.get({ url: Api.QuartzDeleteList, params });

export const quartzRecovery = (data?: any) => defHttp.post({ url: Api.QuartzRecovery, data });

export const quartzDeletePhysic = (data?: any) =>
  defHttp.delete({ url: Api.QuartzDeletePhysic, data });

export const quartzExecute = (data?: any) => defHttp.post({ url: Api.QuartzExecute, data });

export const quartzResume = (data?: any) => defHttp.post({ url: Api.QuartzResume, data });

export const quartzPause = (data?: any) => defHttp.post({ url: Api.QuartzPause, data });
