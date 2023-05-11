import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintSensorPage = '/biz/workflow/device-maint-sensor/page',
  WorkflowDeviceMaintSensorPage2 = '/biz/workflow/device-maint-sensor/page-sensor-without-record',
  WorkflowDeviceMaintSensorDelete = '/biz/workflow/device-maint-sensor/delete-batch',
  WorkflowDeviceMaintSensorAdd = '/biz/workflow/device-maint-sensor/allocatable',
}

export const workflowDeviceMaintSensorPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintSensorPage, params });

export const workflowDeviceMaintSensorPage2 = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintSensorPage2, params });

export const workflowDeviceMaintSensorDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintSensorDelete, params });

export const workflowDeviceMaintSensorAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintSensorAdd, data });
