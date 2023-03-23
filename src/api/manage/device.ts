import { defHttp } from '/@/utils/http/axios';

enum Api {
  DevicePage = '/biz/device/getpagelist',
  DeviceDelete = '/biz/device/delete',
  DeviceAdd = '/biz/device/add',
  DeviceUpdate = '/biz/device/edit',
  DeviceList = '/biz/device/list',
  DeviceForm = '/biz/device/querybyid',
}

export const devicePage = (params?: any) => defHttp.get({ url: Api.DevicePage, params });
export const deviceDelete = (params?: any) => defHttp.get({ url: Api.DeviceDelete, params });
export const deviceAdd = (data?: any) => defHttp.post({ url: Api.DeviceAdd, data });
export const deviceUpdate = (data?: any) => defHttp.post({ url: Api.DeviceUpdate, data });
export const deviceForm = (params?: any) => defHttp.get({ url: Api.DeviceForm, params });
