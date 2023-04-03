import { defHttp } from '/@/utils/http/axios';

enum Api {
  SensorPage = '/biz/device-sensor/page',
  SensorDelete = '/biz/device-sensor/delete',
  SensorAdd = '/biz/device-sensor/add',
  SensorUpdate = '/biz/device-sensor/edit',
  SensorList = '/biz/device-sensor/list',
  SensorForm = '/biz/device-sensor/form',
  SensorHistoryData = '/biz/device-sensor/getfigure',
}

export const sensorPage = (params?: any) => defHttp.get({ url: Api.SensorPage, params });
export const sensorDelete = (params?: any) => defHttp.get({ url: Api.SensorDelete, params });
export const sensorAdd = (data?: any) => defHttp.post({ url: Api.SensorAdd, data });
export const sensorUpdate = (data?: any) => defHttp.post({ url: Api.SensorUpdate, data });
export const sensorForm = (params?: any) => defHttp.get({ url: Api.SensorForm, params });
export const sensorHistoryData = (params?: any) =>
  defHttp.get({ url: Api.SensorHistoryData, params });
