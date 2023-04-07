import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';
const { apiUrl } = useGlobSetting();

enum Api {
  EventTriggerPage = '/biz/devicealarm/getpagelist',
  EventTriggerDelete = '/biz/devicealarm/delete',
  EventTriggerAdd = '/biz/devicealarm/add',
  EventTriggerUpdate = '/biz/devicealarm/edit',
  EventTriggerList = '/biz/devicealarm/list',
  EventTriggerForm = '/biz/devicealarm/querybyid',
  EventTriggerExport = '/biz/devicealarm/export',
  EventTriggerImport = '/biz/devicealarm/importexcel',

  EventTriggerUpdateEventState = '/biz/workflow/statecheck',
  EventTriggerAddToEvent = '/biz/workflow/add',
  EventTriggerUpdateEvent = '/biz/workflow/edit',
  EventTriggerEventDetail = '/biz/workflow/querybyid',
}

export const eventTriggerPage = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerPage, params });
export const eventTriggerDelete = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerDelete, params });
export const eventTriggerAdd = (data?: any) => defHttp.post({ url: Api.EventTriggerAdd, data });
export const eventTriggerUpdate = (data?: any) =>
  defHttp.post({ url: Api.EventTriggerUpdate, data });
export const eventTriggerForm = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerForm, params });

export const eventTriggerUpdateState = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerUpdateEventState, params });
export const eventTriggerAddToEvent = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerAddToEvent, params });
export const eventTriggerUpdateEvent = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerUpdateEvent, params });

export const eventTriggerEventDetail = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerEventDetail, params });

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
