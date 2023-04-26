import { defHttp } from '/@/utils/http/axios';

enum Api {
  EquipmentMaintenanceRecordPage = '/biz/workflow/maintrecord/getpagelist',
  EquipmentMaintenanceRecordDelete = '/biz/workflow/maintrecord/delete',
  EquipmentMaintenanceRecordAdd = '/biz/workflow/maintrecord/add',
  EquipmentMaintenanceRecordUpdate = '/biz/workflow/maintrecord/edit',
  EquipmentMaintenanceRecordList = '/biz/workflow/maintrecord/list',
  EquipmentMaintenanceRecordForm = '/biz/workflow/maintrecord/getbyid',
  EquipmentMaintenanceRecordUpdateState = '/biz/workflow/maintrecord/statecheck',
  EquipmentMaintenanceRecordSend = '/biz/workflow/maintrecord/send',
}

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
export const equipmentMaintenanceRecordUpdateState = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordUpdateState, params });
export const equipmentMaintenanceRecordSend = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordSend, params });
