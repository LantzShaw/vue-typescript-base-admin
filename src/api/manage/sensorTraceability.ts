import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  SensorTraceabilityPage = '/biz/sensor-trace/getpagelist',
  SensorTraceabilityDelete = '/biz/sensor-trace/delete',
  SensorTraceabilityAdd = '/biz/sensor-trace/add',
  SensorTraceabilityUpdate = '/biz/sensor-trace/update',
  SensorTraceabilityList = '/biz/sensor-trace/list',
  SensorTraceabilityForm = '/biz/sensor-trace/form',
  SensorTraceabilityImport = '/biz/sensor-trace/import-data',
}

export const sensorTraceabilityPage = (params?: any) =>
  defHttp.get({ url: Api.SensorTraceabilityPage, params });

export const sensorTraceabilityDelete = (data?: any) =>
  defHttp.delete({ url: Api.SensorTraceabilityDelete, data });

export const sensorTraceabilityAdd = (data?: any) =>
  defHttp.post({ url: Api.SensorTraceabilityAdd, data });

export const sensorTraceabilityUpdate = (data?: any) =>
  defHttp.post({ url: Api.SensorTraceabilityUpdate, data });

export const sensorTraceabilityForm = (params?: any) =>
  defHttp.get({ url: Api.SensorTraceabilityForm, params });

export const sensorTraceabilityImport = (params?: any) =>
  defHttp.uploadFile(
    {
      url: `${apiUrl}${Api.SensorTraceabilityImport}`,
    },
    params,
  );
