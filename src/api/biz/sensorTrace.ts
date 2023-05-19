import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  SensorTracePage = '/biz/sensor-trace/page',
  SensorTraceDelete = '/biz/sensor-trace/delete',
  SensorTraceAdd = '/biz/sensor-trace/add',
  SensorTraceUpdate = '/biz/sensor-trace/update',
  SensorTraceForm = '/biz/sensor-trace/form',
  SensorTraceImport = '/biz/sensor-trace/import-data',
  SensorTraceAtt = '/biz/sensor-trace/att',
}

export const sensorTracePage = (params?: any) => defHttp.get({ url: Api.SensorTracePage, params });

export const sensorTraceDelete = (data?: any) =>
  defHttp.delete({ url: Api.SensorTraceDelete, data });

export const sensorTraceAdd = (data?: any) => defHttp.post({ url: Api.SensorTraceAdd, data });

export const sensorTraceUpdate = (data?: any) => defHttp.post({ url: Api.SensorTraceUpdate, data });

export const sensorTraceForm = (params?: any) => defHttp.get({ url: Api.SensorTraceForm, params });

export const sensorTraceAtt = (params?: any) => defHttp.get({ url: Api.SensorTraceAtt, params });

export const sensorTraceImport = (params?: any) =>
  defHttp.uploadFile(
    {
      url: `${apiUrl}${Api.SensorTraceImport}`,
    },
    params,
  );
