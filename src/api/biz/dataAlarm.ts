import { defHttp } from '/@/utils/http/axios';

enum Api {
  DataAlarmPage = '/biz/data/alarm/page',
  DataAlarmUpdate = '/biz/data/alarm/update',
  DataAlarmForm = '/biz/data/alarm/form',
  DataAlarmSync = '/biz/data/alarm/sync',
}

export const dataAlarmPage = (params?: any) => defHttp.get({ url: Api.DataAlarmPage, params });
export const dataAlarmUpdate = (data?: any) => defHttp.post({ url: Api.DataAlarmUpdate, data });
export const dataAlarmForm = (params?: any) => defHttp.get({ url: Api.DataAlarmForm, params });
export const dataAlarmSync = (data?: any) => defHttp.post({ url: Api.DataAlarmSync, data });
