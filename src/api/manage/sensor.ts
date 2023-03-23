import { defHttp } from '/@/utils/http/axios';

enum Api {
  SensorPage = '/biz/devicesensor/getpagelist',
  SensorDelete = '/biz/devicesensor/delete',
  SensorAdd = '/biz/devicesensor/add',
  SensorUpdate = '/biz/devicesensor/edit',
  SensorList = '/biz/devicesensor/list',
  SensorForm = '/biz/devicesensor/querybyid',
}

export const sensorPage = (params?: any) => defHttp.get({ url: Api.SensorPage, params });
export const sensorDelete = (params?: any) => defHttp.get({ url: Api.SensorDelete, params });
export const sensorAdd = (data?: any) => defHttp.post({ url: Api.SensorAdd, data });
export const sensorUpdate = (data?: any) => defHttp.post({ url: Api.SensorUpdate, data });
export const sensorForm = (params?: any) => defHttp.get({ url: Api.SensorForm, params });
