import { defHttp } from '/@/utils/http/axios';

enum Api {
  EnterprisePoints = '/biz/data-view/points',
  StatisticsGasType = '/biz/data-view/statistics-gas-type',
  StatisticsGasDistribution = '/biz/data-view/statistics-gas-distribution',
  StatisticsLifeCycle = '/biz/data-view/statistics-life-cycle',
  StatisticsTraceStatus = '/biz/data-view/statistics-trace-status',
  StatisticsAlarmProcess = '/biz/data-view/statistics-alarm-process',
  StatisticsMaintProcess = '/biz/data-view/statistics-maint-process',
  SensorStatus = '/biz/data-view/sensor-status',
  GetAbnormalStatistics = '/biz/data-view/get-abnormal-statistics',
  GetTriggerFrequently = '/biz/data-view/get-trigger-frequently',
  StatisticsSensorAbnormal = '/biz/data-view/statistics-sensor-abnormal',
  AlarmList = '/biz/data-view/alarm-list',
  AbnormalList = '/biz/data-view/abnormal-list',
  MaintList = '/biz/data-view/maint-list',
}

// 地图点位列表
export const enterprisePoints = (params?: any) =>
  defHttp.get({ url: Api.EnterprisePoints, params });

// 气体种类统计
export const statisticsGasType = (params?: any) =>
  defHttp.get({ url: Api.StatisticsGasType, params });

// 气体分布统计
export const statisticsGasDistribution = (params?: any) =>
  defHttp.get({ url: Api.StatisticsGasDistribution, params });

// 生命周期统计
export const statisticsLifeCycle = (params?: any) =>
  defHttp.get({ url: Api.StatisticsLifeCycle, params });

// 溯源状态统计
export const statisticsTraceStatus = (params?: any) =>
  defHttp.get({ url: Api.StatisticsTraceStatus, params });

// 事件触发流程统计
export const statisticsAlarmProcess = (params?: any) =>
  defHttp.get({ url: Api.StatisticsAlarmProcess, params });

// 维护流程统计
export const statisticsMaintProcess = (params?: any) =>
  defHttp.get({ url: Api.StatisticsMaintProcess, params });

// 传感器当日状态
export const sensorStatus = (params?: any) => defHttp.get({ url: Api.SensorStatus, params });

// 传感器触发频繁度
export const getAbnormalStatistics = (params?: any) =>
  defHttp.get({ url: Api.GetAbnormalStatistics, params });

// 传感器异常频繁度
export const getTriggerFrequently = (params?: any) =>
  defHttp.get({ url: Api.GetTriggerFrequently, params });

// 传感器异常统计
export const statisticsSensorAbnormal = (params?: any) =>
  defHttp.get({ url: Api.StatisticsSensorAbnormal, params });

// 进行中的触发事件
export const alarmList = (params?: any) => defHttp.get({ url: Api.AlarmList, params });

// 异常信息提示
export const abnormalList = (params?: any) => defHttp.get({ url: Api.AbnormalList, params });

// 进行中的维保任务
export const maintList = (params?: any) => defHttp.get({ url: Api.MaintList, params });
