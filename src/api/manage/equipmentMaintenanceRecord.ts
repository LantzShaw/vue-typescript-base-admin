import { defHttp } from '/@/utils/http/axios';

enum Api {
  EquipmentMaintenanceRecordApReceive = '/biz/workflow/device-maint-record/ap-receive',
  EquipmentMaintenanceRecordBpReceive = '/biz/workflow/device-maint-record/bp-receive',

  EquipmentMaintenanceRecordPage = '/biz/workflow/device-maint-record/page-with-time',
  EquipmentMaintenanceRecordDelete = '/biz/workflow/device-maint-record/delete',
  EquipmentMaintenanceRecordAdd = '/biz/workflow/device-maint-record/add',
  EquipmentMaintenanceRecordUpdate = '/biz/workflow/device-maint-record/edit',
  EquipmentMaintenanceRecordList = '/biz/workflow/device-maint-record/list',
  EquipmentMaintenanceRecordForm = '/biz/workflow/device-maint-record/form',
  EquipmentMaintenanceRecordUpdateState = '/biz/workflow/device-maint-record/update-basic-info',
  EquipmentMaintenanceRecordSend = '/biz/workflow/device-maint-record/notice',

  EquipmentMaintenanceRecordStepOneSubmit = '/biz/workflow/device-maint-record/step-one-submit',
  EquipmentMaintenanceRecordStepOneAffirm = '/biz/workflow/device-maint-record/step-one-affirm',

  EquipmentMaintenanceRecordStepTwoSubmit = '/biz/workflow/device-maint-record/step-two-submit',
  EquipmentMaintenanceRecordStepTwoAffirm = '/biz/workflow/device-maint-record/step-two-affirm',

  EquipmentMaintenanceRecordStepThreeSubmit = '/biz/workflow/device-maint-record/step-three-submit',
  EquipmentMaintenanceRecordStepThreeAffirm = '/biz/workflow/device-maint-record/step-three-affirm',
}

export const equipmentMaintenanceRecordApReceive = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordApReceive, data });

export const equipmentMaintenanceRecordBpReceive = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordBpReceive, data });

export const equipmentMaintenanceRecordPage = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordPage, params });
export const equipmentMaintenanceRecordDelete = (params?: any) =>
  defHttp.delete({ url: Api.EquipmentMaintenanceRecordDelete, params });
export const equipmentMaintenanceRecordAdd = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordAdd, data });
export const equipmentMaintenanceRecordUpdate = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordUpdate, data });
export const equipmentMaintenanceRecordForm = (params?: any) =>
  defHttp.get({ url: Api.EquipmentMaintenanceRecordForm, params });

export const equipmentMaintenanceRecordStepOneSubmit = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepOneSubmit, params });

export const equipmentMaintenanceRecordStepOneAffirm = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepOneAffirm, params });

export const equipmentMaintenanceRecordStepTwoSubmit = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepTwoSubmit, params });

export const equipmentMaintenanceRecordStepTwoAffirm = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepTwoAffirm, params });

export const equipmentMaintenanceRecordStepThreeSubmit = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepThreeSubmit, params });

export const equipmentMaintenanceRecordStepThreeAffirm = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordStepThreeAffirm, params });

export const equipmentMaintenanceRecordUpdateState = (params?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordUpdateState, params });

export const equipmentMaintenanceRecordSend = (data?: any) =>
  defHttp.post({ url: Api.EquipmentMaintenanceRecordSend, data });
