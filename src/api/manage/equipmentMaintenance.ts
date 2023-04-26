import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 维护计划
  EquipmentMaintenancePlanPage = '/biz/workflow/main/page',
  EquipmentMaintenancePlanDelete = '/biz/workflow/main/delete',
  EquipmentMaintenancePlanAdd = '/biz/workflow/main/add',
  EquipmentMaintenancePlanUpdate = '/biz/workflow/main/update',
  EquipmentMaintenancePlanList = '/biz/workflow/main/list',
  EquipmentMaintenancePlanForm = '/biz/workflow/main/form',
}

// 维护计划
export const equipmentMaintenancePlanPage = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePlanPage, params });
export const equipmentMaintenancePlanDelete = (params?: any) =>
  defHttp.delete({ url: Api.EquipmentMaintenancePlanDelete, params });
export const equipmentMaintenancePlanAdd = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenancePlanAdd, data });
export const equipmentMaintenancePlanUpdate = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenancePlanUpdate, data });
export const equipmentMaintenancePlanForm = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenancePlanForm, params });
