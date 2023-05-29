import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  OverviewData = '/biz/statistics/gether',
  InstallationReportPage = '/biz/statistics/getgaslist',
  AdditionReportPage = '/biz/device/get-gastype-list',
  DismantlingReportPage = '',
  EventReportPage = '/biz/device/getalarmlist',
  MaintenanceReport = '/biz/device/getmainlist',
  TraceabilityListPage = '/biz/statistics/get-overdue-list',
  TraceabilityReport = '/biz/statistics/get-overdue-item',

  SensorChangeNumPage = '/biz/statistics/sensor-change-num',
  AlarmNumPage = '/biz/statistics/alarm-num',
  MaintRecordNumPage = '/biz/statistics/maint-record-num',
}

export const overviewData = (params?: any) => defHttp.get({ url: Api.OverviewData, params });
export const installationReportPage = (params?: any) =>
  defHttp.get({ url: Api.InstallationReportPage, params });
export const additionReportPage = (params?: any) =>
  defHttp.get({ url: Api.AdditionReportPage, params });
export const dismantlingReportPage = (params?: any) =>
  defHttp.get({ url: Api.DismantlingReportPage, params });
export const eventReportPage = (params?: any) => defHttp.get({ url: Api.EventReportPage, params });
export const maintenanceReport = (params?: any) =>
  defHttp.get({ url: Api.MaintenanceReport, params });
export const traceabilityListPage = (params?: any) =>
  defHttp.get({ url: Api.TraceabilityListPage, params });
export const traceabilityReport = (params?: any) =>
  defHttp.get({ url: Api.TraceabilityReport, params });

export const sensorChangeNumPage = (params?: any) =>
  defHttp.get({ url: Api.SensorChangeNumPage, params });

export const alarmNumPage = (params?: any) => defHttp.get({ url: Api.AlarmNumPage, params });

export const maintRecordNumPage = (params?: any) =>
  defHttp.get({ url: Api.MaintRecordNumPage, params });

// export const deviceExport = (params?: any) =>
//   defHttp.get(
//     { url: Api.DeviceExport, params, responseType: 'blob' },
//     {
//       isTransformResponse: false,
//     },
//   );
// export const deviceImport = (params?: any) =>
//   defHttp.uploadFile(
//     {
//       url: `${apiUrl}${Api.DeviceImport}`,
//     },
//     params,
//   );
