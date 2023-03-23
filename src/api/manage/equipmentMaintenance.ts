import { defHttp } from '/@/utils/http/axios';

enum Api {
  EquipmentMaintenancePage = '/biz/workflow/main/getpagelist',
  EquipmentMaintenanceDelete = '/biz/workflow/main/delete',
  EquipmentMaintenanceAdd = '/biz/workflow/main/add',
  EquipmentMaintenanceUpdate = '/biz/workflow/main/edit',
  EquipmentMaintenanceList = '/biz/workflow/main/list',
  EquipmentMaintenanceForm = '/biz/workflow/main/querybyid',

  EquipmentMaintenanceUpdateState = '/biz/workflow/main/statecheck',
}

export const equipmentMaintenancePage = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePage, params });
export const equipmentMaintenanceDelete = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceDelete, params });
export const equipmentMaintenanceAdd = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceAdd, data });
export const equipmentMaintenanceUpdate = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceUpdate, data });
export const equipmentMaintenanceForm = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceForm, params });

export const equipmentMaintenanceUpdateState = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceUpdateState, params });
