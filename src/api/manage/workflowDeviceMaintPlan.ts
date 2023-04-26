import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowDeviceMaintPlanPage = '/biz/workflow/main/page',
  DeviceGroupDelete = '/biz/device-group/delete',
  DeviceGroupAdd = '/biz/device-group/add',
  DeviceGroupUpdate = '/biz/device-group/update',
  DeviceGroupList = '/biz/device-group/list',
  WorkflowDeviceMaintPlanForm = '/biz/workflow/main/form',
  DeviceGroupSync = '/biz/device-group/sync',
}

export const workflowDeviceMaintPlanPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanPage, params });
export const deviceGroupDelete = (data?: any) =>
  defHttp.delete({ url: Api.DeviceGroupDelete, data });
export const deviceGroupAdd = (data?: any) => defHttp.post({ url: Api.DeviceGroupAdd, data });
export const deviceGroupUpdate = (data?: any) => defHttp.post({ url: Api.DeviceGroupUpdate, data });
export const workflowDeviceMaintPlanForm = (params?: any) =>
  defHttp.get({ url: Api.WorkflowDeviceMaintPlanForm, params });

export const deviceGroupSync = (data?: any) => defHttp.post({ url: Api.DeviceGroupSync, data });
