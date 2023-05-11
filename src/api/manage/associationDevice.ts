import { defHttp } from '/@/utils/http/axios';

enum Api {
  AssociationDevicePage = '/biz/workflow/device-maint-plan/sensor/page',
  AssociationDevicePage2 = '/biz/workflow/device-maint-plan/sensor/page-sensor-without-plan',
  AssociationDeviceDelete = '/biz/workflow/device-maint-plan/sensor/delete-batch',
  AssociationDeviceAdd = '/biz/workflow/device-maint-plan/sensor/allocatable',
  AssociationDeviceUpdate = '/biz/workflow/sensor/allocatable',
  AssociationDeviceList = '/biz/workflow/sensor/list',
  AssociationDeviceForm = '/biz/workflow/sensor/querybyid',
}

export const associationDevicePage = (params?: any) =>
  defHttp.get({ url: Api.AssociationDevicePage, params });
export const associationDevicePage2 = (params?: any) =>
  defHttp.get({ url: Api.AssociationDevicePage2, params });
export const associationDeviceDelete = (data?: any) =>
  defHttp.delete({ url: Api.AssociationDeviceDelete, data });
export const associationDeviceAdd = (data?: any) =>
  defHttp.post({ url: Api.AssociationDeviceAdd, data });
export const associationDeviceUpdate = (data?: any) =>
  defHttp.post({ url: Api.AssociationDeviceUpdate, data });
export const associationDeviceForm = (params?: any) =>
  defHttp.get({ url: Api.AssociationDeviceForm, params });
