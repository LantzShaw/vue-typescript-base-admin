import { defHttp } from '/@/utils/http/axios';

enum Api {
  Area = '/base/area',
  AreaList = '/base/area/tree-sync',
  AreaTree = '/base/area/tree',
  AreaForm = '/base/area/form',
  AreaRevised = '/base/area/revised',
}

export const areaList = (params?: any) => defHttp.get({ url: Api.AreaList, params });

export const areaForm = (params?: any) => defHttp.get({ url: Api.AreaForm, params });

export const areaAdd = (data?: any) => defHttp.post({ url: Api.Area, data });

export const areaUpdate = (data?: any) => defHttp.put({ url: Api.Area, data });

export const areaDelete = (data?: any) => defHttp.delete({ url: Api.Area, data });

export const areaRevised = (data?: any) => defHttp.post({ url: Api.AreaRevised, data });
