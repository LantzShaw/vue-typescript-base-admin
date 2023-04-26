import { defHttp } from '/@/utils/http/axios';

enum Api {
  SensorTraceabilityPage = '/biz/sensortrace/getpagelist',
  SensorTraceabilityDelete = '/biz/sensortrace/delete',
  SensorTraceabilityAdd = '/biz/sensortrace/add',
  SensorTraceabilityUpdate = '/biz/sensortrace/update',
  SensorTraceabilityList = '/biz/sensortrace/list',
  SensorTraceabilityForm = '/biz/sensortrace/getbyid',
  SensorTraceabilityImport = '/biz/sensortrace/importexcel',
}

export const sensorTraceabilityPage = (params?: any) =>
  defHttp.get({ url: Api.SensorTraceabilityPage, params });
export const sensorTraceabilityDelete = (params?: any) =>
  defHttp.get({ url: Api.SensorTraceabilityDelete, params });
export const sensorTraceabilityAdd = (data?: any) =>
  defHttp.post({ url: Api.SensorTraceabilityAdd, data });
export const sensorTraceabilityUpdate = (data?: any) =>
  defHttp.post({ url: Api.SensorTraceabilityUpdate, data });
export const sensorTraceabilityForm = (params?: any) =>
  defHttp.get({ url: Api.SensorTraceabilityForm, params });
