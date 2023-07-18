import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  OverviewData = '/biz/statistics/gether',
  InstallationReportPage = '/biz/statistics/getgaslist',
  AdditionReportPage = '/biz/device/sensor-change/page-with-time',
  DismantlingReportPage = '',
  EventReportPage = '/biz/device/getalarmlist',
  MaintenanceReport = '/biz/statistics/maint-record-item',
  MaintenanceReportExport = '/biz/statistics/export-maint-record-item',
  TraceabilityListPage = '/biz/statistics/get-overdue-list',
  TraceabilityListExport = '/biz/statistics/export-overdue-list',
  TraceabilityReport = '/biz/statistics/get-overdue-item',
  TraceabilityReportExport = '/biz/statistics/export-overdue-item',
  SensorChangeExportData = '/biz/device/sensor-change/export-data',
  SensorChangeEnterpriseExportData = '/biz/device/sensor-change/export-data-by-enterprise',
  SensorChangeNumPage = '/biz/statistics/sensor-change-num',
  AlarmNumPage = '/biz/statistics/alarm-num',
  AlarmNumExport = '/biz/statistics/export-alarm-num',
  MaintRecordNumPage = '/biz/statistics/maint-record-num',
  MaintRecordNumExport = '/biz/statistics/export-maint-record-num',
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

export const maintenanceReportExport = (params?: any) =>
  defHttp.get(
    { url: Api.MaintenanceReportExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const traceabilityListPage = (params?: any) =>
  defHttp.get({ url: Api.TraceabilityListPage, params });

export const traceabilityListExport = (params?: any) =>
  defHttp.get(
    { url: Api.TraceabilityListExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const traceabilityReport = (params?: any) =>
  defHttp.get({ url: Api.TraceabilityReport, params });

export const traceabilityReportExport = (params?: any) =>
  defHttp.get(
    { url: Api.TraceabilityReportExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const sensorChangeNumPage = (params?: any) =>
  defHttp.get({ url: Api.SensorChangeNumPage, params });

export const alarmNumPage = (params?: any) => defHttp.get({ url: Api.AlarmNumPage, params });

export const alarmNumExport = (params?: any) =>
  defHttp.get(
    { url: Api.AlarmNumExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const maintRecordNumPage = (params?: any) =>
  defHttp.get({ url: Api.MaintRecordNumPage, params });

export const maintRecordNumExport = (params?: any) =>
  defHttp.get(
    { url: Api.MaintRecordNumExport, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const sensorChangeExportData = (params?: any) =>
  defHttp.get(
    { url: Api.SensorChangeExportData, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

export const sensorChangeEnterpriseExportData = (params?: any) =>
  defHttp.get(
    { url: Api.SensorChangeEnterpriseExportData, params, responseType: 'blob' },
    { isTransformResponse: false },
  );

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
