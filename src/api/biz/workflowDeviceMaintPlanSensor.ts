import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintPlanSensorPage = '/biz/workflow/device-maint-plan-sensor/page',
  WorkflowDeviceMaintPlanSensorPage2 = '/biz/workflow/device-maint-plan-sensor/page-sensor-without-plan',
  WorkflowDeviceMaintPlanSensorDelete = '/biz/workflow/device-maint-plan-sensor/delete-batch',
  WorkflowDeviceMaintPlanSensorAdd = '/biz/workflow/device-maint-plan-sensor/allocatable',
}

export const workflowDeviceMaintPlanSensorPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanSensorPage, params });

export const workflowDeviceMaintPlanSensorPage2 = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanSensorPage2, params });

export const workflowDeviceMaintPlanSensorDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintPlanSensorDelete, params });

export const workflowDeviceMaintPlanSensorAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintPlanSensorAdd, data });
