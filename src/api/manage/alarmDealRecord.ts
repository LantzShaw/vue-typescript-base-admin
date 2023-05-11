import { defHttp } from '/@/utils/http/axios';

enum Api {
  AlarmDealRecordApReceive = '/biz/workflow/alarm-deal-record/ap-receive',
  AlarmDealRecordBpReceive = '/biz/workflow/alarm-deal-record/bp-receive',

  EventTriggerStepOneSubmit = '/biz/workflow/alarm-deal-record/step-one-submit',
  EventTriggerStepOneAffirm = '/biz/workflow/alarm-deal-record/step-one-affirm',

  EventTriggerStepTwoSubmit = '/biz/workflow/alarm-deal-record/step-two-submit',
  EventTriggerStepTwoAffirm = '/biz/workflow/alarm-deal-record/step-two-affirm',

  EventTriggerStepThreeSubmit = '/biz/workflow/alarm-deal-record/step-three-submit',
  EventTriggerStepThreeAffirm = '/biz/workflow/alarm-deal-record/step-three-affirm',

  EventTriggerStepFourSubmit = '/biz/workflow/alarm-deal-record/step-four-submit',
  EventTriggerStepFourAffirm = '/biz/workflow/alarm-deal-record/step-four-affirm',

  EventTriggerStepFiveSubmit = '/biz/workflow/alarm-deal-record/step-five-submit',
  EventTriggerStepFiveAffirm = '/biz/workflow/alarm-deal-record/step-five-affirm',

  EventTriggerStepSixSubmit = '/biz/workflow/alarm-deal-record/step-six-submit',
  EventTriggerStepSixAffirm = '/biz/workflow/alarm-deal-record/step-six-affirm',

  EventTriggerStepSevenSubmit = '/biz/workflow/alarm-deal-record/step-seven-submit',
  EventTriggerStepSevenAffirm = '/biz/workflow/alarm-deal-record/step-seven-affirm',

  EventTriggerUpdateEventState = '/biz/workflow/alarm-deal-record/statecheck',
  EventTriggerEventDetail = '/biz/workflow/alarm-deal-record/form',
}

export const alarmDealRecordApReceive = (data?: any) =>
  defHttp.post({ url: Api.AlarmDealRecordApReceive, data });

export const alarmDealRecordBpReceive = (data?: any) =>
  defHttp.post({ url: Api.AlarmDealRecordBpReceive, data });

export const eventTriggerStepOneSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepOneSubmit, params });

export const eventTriggerStepOneAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepOneAffirm, params });

export const eventTriggerStepTwoSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepTwoSubmit, params });

export const eventTriggerStepTwoAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepTwoAffirm, params });

export const eventTriggerStepThreeSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepThreeSubmit, params });

export const eventTriggerStepThreeAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepThreeAffirm, params });

export const eventTriggerStepFourSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepFourSubmit, params });

export const eventTriggerStepFourAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepFourAffirm, params });

export const eventTriggerStepFiveSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepFiveSubmit, params });

export const eventTriggerStepFiveAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepFiveAffirm, params });

export const eventTriggerStepSixSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepSixSubmit, params });

export const eventTriggerStepSixAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepSixAffirm, params });

export const eventTriggerStepSevenSubmit = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepSevenSubmit, params });

export const eventTriggerStepSevenAffirm = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerStepSevenAffirm, params });

export const eventTriggerUpdateState = (params?: any) =>
  defHttp.post({ url: Api.EventTriggerUpdateEventState, params });

export const eventTriggerEventDetail = (params?: any) =>
  defHttp.get({ url: Api.EventTriggerEventDetail, params });
