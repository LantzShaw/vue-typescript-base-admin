import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 维护计划
  EquipmentMaintenancePlanPage = '/biz/workflow/device-maint-plan/page',
  EquipmentMaintenancePlanDelete = '/biz/workflow/device-maint-plan/delete',
  EquipmentMaintenancePlanAdd = '/biz/workflow/device-maint-plan/add',
  EquipmentMaintenancePlanUpdate = '/biz/workflow/device-maint-plan/update',
  EquipmentMaintenancePlanList = '/biz/workflow/device-maint-plan/list',
  EquipmentMaintenancePlanForm = '/biz/workflow/device-maint-plan/form',
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
