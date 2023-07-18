import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  EventTriggerPage = '/biz/workflow/alarm-deal-record/page-with-time',
  EventTriggerDelete = '/biz/workflow/alarm-deal-record/invalid',

  EventTriggerList = '/biz/device-alarm/list',
  EventTriggerForm = '/biz/device-alarm/form',
  EventTriggerExport = '/biz/workflow/alarm-deal-record/export-data',
  EventTriggerImport = '/biz/device-alarm/importexcel',
  EventTriggerSend = '/biz/device-alarm/send',
}

export const eventTriggerPage = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerPage, params });

export const eventTriggerDelete = (data?: any) =>
  defHttp.post({ url: Api.EventTriggerDelete, data });

export const eventTriggerForm = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerForm, params });

export const eventTriggerSend = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerSend, params });

export const eventTriggerExport = (params?: any) =>
  defHttp.get(
    {
      url: Api.EventTriggerExport,
      params,
      responseType: 'blob',
    },
    { isTransformResponse: false },
  );

export const eventTriggerImport = (params?: any) =>
  defHttp.uploadFile(
    {
      url: `${apiUrl}${Api.EventTriggerImport}`,
    },
    params,
  );
