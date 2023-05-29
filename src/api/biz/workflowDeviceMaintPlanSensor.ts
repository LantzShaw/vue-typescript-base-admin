import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintPlanSensorPage = '/biz/workflow/device-maint-plan-sensor/page',
  WorkflowDeviceMaintPlanSensorPage2 = '/biz/workflow/device-maint-plan-sensor/page-sensor-without-plan',
  WorkflowDeviceMaintPlanRegionList = '/biz/workflow/device-maint-plan-sensor/list-region-without-plan',
  WorkflowDeviceMaintPlanSensorDelete = '/biz/workflow/device-maint-plan-sensor/delete-batch',
  WorkflowDeviceMaintPlanSensorAdd = '/biz/workflow/device-maint-plan-sensor/allocatable',
  WorkflowDeviceMaintPlanRegionAdd = '/biz/workflow/device-maint-plan-sensor/allocatable-region',
}

export const workflowDeviceMaintPlanSensorPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanSensorPage, params });

export const workflowDeviceMaintPlanSensorPage2 = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanSensorPage2, params });

export const workflowDeviceMaintPlanRegionList = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanRegionList, params });

export const workflowDeviceMaintPlanSensorDelete = (data?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintPlanSensorDelete, data });

export const workflowDeviceMaintPlanSensorAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintPlanSensorAdd, data });

export const workflowDeviceMaintPlanRegionAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintPlanRegionAdd, data });
