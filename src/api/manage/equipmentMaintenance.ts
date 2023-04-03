import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 维护计划
  EquipmentMaintenancePlanPage = '/biz/workflow/main/getpagelist',
  EquipmentMaintenancePlanDelete = '/biz/workflow/main/delete',
  EquipmentMaintenancePlanAdd = '/biz/workflow/main/add',
  EquipmentMaintenancePlanUpdate = '/biz/workflow/main/edit',
  EquipmentMaintenancePlanList = '/biz/workflow/main/list',
  EquipmentMaintenancePlanForm = '/biz/workflow/main/querybyid',

  // 关联设备
  AssociationDevicePage = '/biz/workflow/sensor/getpagelist',
  AssociationDeviceDelete = '/biz/workflow/sensor/delete',
  AssociationDeviceAdd = '/biz/workflow/sensor/add',
  AssociationDeviceUpdate = '/biz/workflow/sensor/edit',
  AssociationDeviceList = '/biz/workflow/sensor/list',
  AssociationDeviceForm = '/biz/workflow/sensor/querybyid',

  // 维护记录
  EquipmentMaintenanceRecordPage = '/biz/workflow/maintrecord/getpagelist',
  EquipmentMaintenanceRecordDelete = '/biz/workflow/maintrecord/delete',
  EquipmentMaintenanceRecordAdd = '/biz/workflow/maintrecord/add',
  EquipmentMaintenanceRecordUpdate = '/biz/workflow/maintrecord/edit',
  EquipmentMaintenanceRecordList = '/biz/workflow/maintrecord/list',
  EquipmentMaintenanceRecordForm = '/biz/workflow/maintrecord/getbyid',
}

// 维护计划
export const equipmentMaintenancePlanPage = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePlanPage, params });
export const equipmentMaintenancePlanDelete = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePlanDelete, params });
export const equipmentMaintenancePlanAdd = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenancePlanAdd, data });
export const equipmentMaintenancePlanUpdate = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenancePlanUpdate, data });
export const equipmentMaintenancePlanForm = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePlanForm, params });

// 关联设备
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

// 维护记录
export const equipmentMaintenanceRecordPage = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordPage, params });
export const equipmentMaintenanceRecordDelete = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordDelete, params });
export const equipmentMaintenanceRecordAdd = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordAdd, data });
export const equipmentMaintenanceRecordUpdate = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordUpdate, data });
export const equipmentMaintenanceRecordForm = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordForm, params });
