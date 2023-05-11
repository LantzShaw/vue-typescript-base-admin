import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintRecordPage = '/biz/workflow/device-maint-record/page',
  WorkflowDeviceMaintRecordPage2 = '/biz/workflow/device-maint-record/page-sensor-without-record',
  WorkflowDeviceMaintRecordDelete = '/biz/workflow/device-maint-record/delete-batch',
  WorkflowDeviceMaintRecordAdd = '/biz/workflow/device-maint-record/add',
  WorkflowDeviceMaintRecordForm = '/biz/workflow/device-maint-record/form',
}

export const workflowDeviceMaintRecordPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintRecordPage, params });

export const workflowDeviceMaintRecordPage2 = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintRecordPage2, params });

export const workflowDeviceMaintRecordDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowDeviceMaintRecordDelete, params });

export const workflowDeviceMaintRecordAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowDeviceMaintRecordAdd, data });

export const workflowDeviceMaintRecordForm = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintRecordForm, params });
