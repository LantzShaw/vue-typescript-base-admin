import { defHttp } from '/@/utils/http/axios';

enum Api {
  DeviceGroupPage = '/biz/device-group/page',
  DeviceGroupUpdate = '/biz/device-group/update',
  DeviceGroupForm = '/biz/device-group/form',
  DeviceGroupSync = '/biz/device-group/sync',
}

export const deviceGroupPage = (params?: any) => defHttp.get({ url: Api.DeviceGroupPage, params });
export const deviceGroupUpdate = (data?: any) => defHttp.post({ url: Api.DeviceGroupUpdate, data });
export const deviceGroupForm = (params?: any) => defHttp.get({ url: Api.DeviceGroupForm, params });
export const deviceGroupSync = (data?: any) => defHttp.post({ url: Api.DeviceGroupSync, data });
