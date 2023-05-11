import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 维护计划
  WorkflowDeviceMaintPlanPage = '/biz/workflow/device-maint-plan/page',
  WorkflowDeviceMaintPlanDelete = '/biz/workflow/device-maint-plan/delete',
  WorkflowDeviceMaintPlanAdd = '/biz/workflow/device-maint-plan/add',
  WorkflowDeviceMaintPlanUpdate = '/biz/workflow/device-maint-plan/update',
  WorkflowDeviceMaintPlanList = '/biz/workflow/device-maint-plan/list',
  WorkflowDeviceMaintPlanForm = '/biz/workflow/device-maint-plan/form',
}

// 维护计划
export const workflowDeviceMaintPlanPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanPage, params });

export const workflowDeviceMaintPlanDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintPlanDelete, params });

export const workflowDeviceMaintPlanAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintPlanAdd, data });

export const workflowDeviceMaintPlanUpdate = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintPlanUpdate, data });

export const workflowDeviceMaintPlanForm = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanForm, params });
