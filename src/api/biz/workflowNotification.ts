import { defHttp } from '/@/utils/http/axios';

enum Api {
  WorkflowNotificationPage = '/biz/workflow/notification/page',
  WorkflowNotificationDelete = '/biz/workflow/notification/delete',
  WorkflowNotificationAdd = '/biz/workflow/notification/add',
  WorkflowNotificationUpdate = '/biz/workflow/notification/update',
  WorkflowNotificationList = '/biz/workflow/notification/list',
  WorkflowNotificationForm = '/biz/workflow/notification/record-detail',
}

export const workflowNotificationPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowNotificationPage, params });

export const workflowNotificationDelete = (params?: any) =>
  defHttp.delete({ url: Api.WorkflowNotificationDelete, params });

export const workflowNotificationAdd = (data?: any) =>
  defHttp.post({ url: Api.WorkflowNotificationAdd, data });

export const workflowNotificationUpdate = (data?: any) =>
  defHttp.post({ url: Api.WorkflowNotificationUpdate, data });

export const workflowNotificationForm = (params?: any) =>
  defHttp.get({ url: Api.WorkflowNotificationForm, params });
