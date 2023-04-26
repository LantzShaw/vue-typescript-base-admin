import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

const { apiUrl } = useGlobSetting();

enum Api {
  OverviewData = '/biz/device/gether',
  InstallationReportPage = '/biz/device/getgaslist',
  AdditionReportPage = '',
  DismantlingReportPage = '',
  EventReportPage = '/biz/device/getalarmlist',
  MaintenanceReport = '/biz/device/getmainlist',
  TraceabilityListPage = '/biz/device/gettracealist',
  TraceabilityReport = '/biz/device/gettraceaitem',
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
