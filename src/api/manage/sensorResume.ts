import { defHttp } from '/@/utils/http/axios';

enum Api {
  SensorResumePage = '/biz/sensorcv/getpagelist',
  SensorResumeDelete = '/biz/sensortrace/delete',
  SensorResumeAdd = '/biz/sensortrace/add',
  SensorResumeUpdate = '/biz/sensortrace/update',
  SensorResumeList = '/biz/sensortrace/list',
  SensorResumeForm = '/biz/sensortrace/getbyid',
}

export const sensorResumePage = (params?: any) =>
  defHttp.get({ url: Api.SensorResumePage, params });
export const sensorResumeDelete = (params?: any) =>
  defHttp.get({ url: Api.SensorResumeDelete, params });
export const sensorResumeAdd = (data?: any) => defHttp.post({ url: Api.SensorResumeAdd, data });
export const sensorResumeUpdate = (data?: any) =>
  defHttp.post({ url: Api.SensorResumeUpdate, data });
export const sensorResumeForm = (params?: any) =>
  defHttp.get({ url: Api.SensorResumeForm, params });
