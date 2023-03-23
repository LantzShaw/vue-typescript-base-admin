import { defHttp } from '/@/utils/http/axios';

enum Api {
  DeviceGroupPage = '/biz/device-group/page',
  DeviceGroupDelete = '/biz/device-group/delete',
  DeviceGroupAdd = '/biz/device-group/add',
  DeviceGroupUpdate = '/biz/device-group/update',
  DeviceGroupList = '/biz/device-group/list',
  DeviceGroupForm = '/biz/device-group/form',
  DeviceGroupSync = '/biz/device-group/sync',
}

export const deviceGroupPage = (params?: any) => defHttp.get({ url: Api.DeviceGroupPage, params });
export const deviceGroupDelete = (data?: any) =>
  defHttp.delete({ url: Api.DeviceGroupDelete, data });
export const deviceGroupAdd = (data?: any) => defHttp.post({ url: Api.DeviceGroupAdd, data });
export const deviceGroupUpdate = (data?: any) => defHttp.post({ url: Api.DeviceGroupUpdate, data });
export const deviceGroupForm = (params?: any) => defHttp.get({ url: Api.DeviceGroupForm, params });

export const deviceGroupSync = (data?: any) => defHttp.post({ url: Api.DeviceGroupSync, data });
