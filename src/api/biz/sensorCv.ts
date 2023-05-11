import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  SensorCvPage = '/biz/device/sensor-cv/page',
  SensorCvDelete = '/biz/device/sensor-cv/delete',
  SensorCvAdd = '/biz/device/sensor-cv/add',
  SensorCvUpdate = '/biz/device/sensor-cv/update',
  SensorCvForm = '/biz/device/sensor-cv/form',
  SensorCvImport = '/biz/device/sensor-cv/import-data',
}

export const sensorCvPage = (params?: any) => defHttp.get({ url: Api.SensorCvPage, params });

export const sensorCvDelete = (data?: any) => defHttp.delete({ url: Api.SensorCvDelete, data });

export const sensorCvAdd = (data?: any) => defHttp.post({ url: Api.SensorCvAdd, data });

export const sensorCvUpdate = (data?: any) => defHttp.post({ url: Api.SensorCvUpdate, data });

export const sensorCvForm = (params?: any) => defHttp.get({ url: Api.SensorCvForm, params });

export const sensorCvImport = (params?: any) =>
  defHttp.uploadFile(
    {
      url: `${apiUrl}${Api.SensorCvImport}`,
    },
    params,
  );
