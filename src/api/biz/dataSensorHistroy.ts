import { defHttp } from '/@/utils/http/axios';

enum Api {
  DataSensorHistroyGetfigure = '/biz/workflow/alarm-deal-record/histroy-data',
}

export const getfigure = (data?: any) =>
  defHttp.post({ url: Api.DataSensorHistroyGetfigure, data });
