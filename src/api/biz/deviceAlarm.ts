import { defHttp } from '/@/utils/http/axios';

enum Api {
  DeviceAlarmPage = '/biz/device-alarm/page',
  DeviceAlarmUpdate = '/biz/device-alarm/update',
  DeviceAlarmForm = '/biz/device-alarm/form',
  DeviceAlarmSync = '/biz/device-alarm/sync',
}

export const deviceAlarmPage = (params?: any) => defHttp.get({ url: Api.DeviceAlarmPage, params });
export const deviceAlarmUpdate = (data?: any) => defHttp.post({ url: Api.DeviceAlarmUpdate, data });
export const deviceAlarmForm = (params?: any) => defHttp.get({ url: Api.DeviceAlarmForm, params });
export const deviceAlarmSync = (data?: any) => defHttp.post({ url: Api.DeviceAlarmSync, data });
