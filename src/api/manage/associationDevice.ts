import { defHttp } from '/@/utils/http/axios';

enum Api {
  AssociationDevicePage = '/biz/workflow/sensor/getpagelist',
  AssociationDeviceDelete = '/biz/workflow/sensor/delete',
  AssociationDeviceAdd = '/biz/workflow/sensor/add',
  AssociationDeviceUpdate = '/biz/workflow/sensor/edit',
  AssociationDeviceList = '/biz/workflow/sensor/list',
  AssociationDeviceForm = '/biz/workflow/sensor/querybyid',
}

export const associationDevicePage = (params?: any) =>
  defHttp.get({ url: Api.AssociationDevicePage, params });
export const associationDeviceDelete = (params?: any) =>
  defHttp.get({ url: Api.AssociationDeviceDelete, params });
export const associationDeviceAdd = (data?: any) =>
  defHttp.post({ url: Api.AssociationDeviceAdd, data });
export const associationDeviceUpdate = (data?: any) =>
  defHttp.post({ url: Api.AssociationDeviceUpdate, data });
export const associationDeviceForm = (params?: any) =>
  defHttp.get({ url: Api.AssociationDeviceForm, params });
