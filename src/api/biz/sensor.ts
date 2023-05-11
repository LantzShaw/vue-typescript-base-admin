import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  SensorPage = '/biz/device-sensor/page',
  SensorDelete = '/biz/device-sensor/delete',

  SensorUpdate = '/biz/device-sensor/update',
  SensorList = '/biz/device-sensor/list',
  SensorForm = '/biz/device-sensor/form',
  SensorExport = '/biz/device-sensor/export',
  SensorImport = '/biz/device-sensor/import-data',
  SensorHistoryData = '/biz/device-sensor/getfigure',
}

export const sensorPage = (params?: any) => defHttp.get({ url: Api.SensorPage, params });
export const sensorDelete = (params?: any) => defHttp.get({ url: Api.SensorDelete, params });

export const sensorUpdate = (data?: any) => defHttp.post({ url: Api.SensorUpdate, data });
export const sensorForm = (params?: any) => defHttp.get({ url: Api.SensorForm, params });
export const sensorHistoryData = (data?: any) => defHttp.post({ url: Api.SensorHistoryData, data });

export const sensorExport = (params?: any) =>
  defHttp.get(
    { url: Api.SensorExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const sensorImport = (params?: any) =>
  defHttp.uploadFile(
    {
      url: `${apiUrl}${Api.SensorImport}`,
    },
    params,
  );
