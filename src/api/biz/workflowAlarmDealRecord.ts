import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  WorkflowAlarmDealRecordPage = '/biz/workflow/alarm-deal-record/page-with-time',
  WorkflowAlarmDealRecordInvalid = '/biz/workflow/alarm-deal-record/invalid',

  WorkflowAlarmDealRecordList = '/biz/device-alarm/list',
  WorkflowAlarmDealRecordForm = '/biz/device-alarm/form',
  WorkflowAlarmDealRecordExport = '/biz/workflow/alarm-deal-record/export-data',

  WorkflowAlarmDealRecordSend = '/biz/device-alarm/send',
}

export const workflowAlarmDealRecordPage = (params?: any) =>
  defHttp.get({ url: Api.WorkflowAlarmDealRecordPage, params });

export const workflowAlarmDealRecordInvalid = (data?: any) =>
  defHttp.post({ url: Api.WorkflowAlarmDealRecordInvalid, data });

export const workflowAlarmDealRecordForm = (params?: any) =>
  defHttp.get({ url: Api.WorkflowAlarmDealRecordForm, params });

export const workflowAlarmDealRecordSend = (params?: any) =>
  defHttp.get({ url: Api.WorkflowAlarmDealRecordSend, params });

export const workflowAlarmDealRecordExport = (params?: any) =>
  defHttp.get(
    {
      url: Api.WorkflowAlarmDealRecordExport,
      params,
      responseType: 'blob',
    },
    { isTransformResponse: false },
  );
