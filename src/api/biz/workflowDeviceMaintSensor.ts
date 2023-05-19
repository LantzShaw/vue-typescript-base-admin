import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintSensorPage = '/biz/workflow/device-maint-sensor/page',
  WorkflowDeviceMaintSensorPage2 = '/biz/workflow/device-maint-sensor/page-sensor-without-record',
  WorkflowDeviceMaintSensorDelete = '/biz/workflow/device-maint-sensor/delete-batch',
  WorkflowDeviceMaintSensorAdd = '/biz/workflow/device-maint-sensor/allocatable',
  WorkflowDeviceMaintSensorUpdate = '/biz/workflow/device-maint-sensor/update-sheet',
  WorkflowDeviceMaintSensorExport = '/biz/workflow/device-maint-sensor/export',
}

export const workflowDeviceMaintSensorPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintSensorPage, params });

export const workflowDeviceMaintSensorPage2 = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintSensorPage2, params });

export const workflowDeviceMaintSensorDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintSensorDelete, params });

export const workflowDeviceMaintSensorAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintSensorAdd, data });

export const workflowDeviceMaintSensorUpdate = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintSensorUpdate, data });

export const workflowDeviceMaintSensorExport = (params?: any) =>
  defHttp.get(
    { url: Api.WorkflowDeviceMaintSensorExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );
