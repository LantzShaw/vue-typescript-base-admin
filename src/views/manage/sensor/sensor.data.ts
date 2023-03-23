import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

import { devicePage } from '/@/api/manage/device';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const sensorTypeOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('绑定设备'),
      field: 'dtuipId',
      component: 'ApiSelect',
      required: false,
      componentProps: {
        maxlength: 100,
        placeholder: '请输入选择设备',
        api: devicePage,
        params: {
          pageIndex: 1,
          pageSize: 100000,
        },
        resultField: 'records',
        labelField: 'deviceName',
        valueField: 'dtuipId',
      },
    },
    {
      label: t('传感器名称'),
      field: 'deviceName',
      component: 'Input',
    },
    // {
    //   label: t('传感器编号'),
    //   field: 'sensorNo',
    //   component: 'Input',
    // },
    {
      label: t('是否报警'),
      field: 'dtuipIsAlarms',
      component: 'Select',
      componentProps: {
        options: alarmStatusOptions,
        allowClear: true,
      },
    },
    // {
    //   label: t('是否删除'),
    //   field: 'dtuipIsDelete',
    //   component: 'Select',
    //   componentProps: {
    //     options: deleteStatusOptions,
    //     allowClear: true,
    //   },
    // },
    {
      label: t('是否在线'),
      field: 'dtuipIsLine',
      component: 'Select',
      componentProps: {
        options: onlineStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('传感器类型'),
      field: 'dtuipSensorTypeId',
      component: 'Select',
      componentProps: {
        options: sensorTypeOptions,
        allowClear: true,
      },
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('传感器名称'),
    dataIndex: 'sensorName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  // {
  //   title: t('传感器编号'),
  //   dataIndex: 'sensorNo',
  //   sorter: true,
  //   width: 100,
  //   align: 'center',
  // },
  {
    title: t('心跳包时间'),
    dataIndex: 'dtuipHeartbeatDate',
    sorter: true,
    width: 160,
    align: 'center',
  },
  {
    title: t('数据最后上报时间'),
    dataIndex: 'dtuipUpdateDate',
    sorter: true,
    width: 160,
    align: 'center',
  },

  {
    title: t('数值'),
    dataIndex: 'dtuipValue',
    width: 110,
    align: 'center',
  },

  // {
  //   title: t('经度'),
  //   dataIndex: 'dtuipLng',
  //   sorter: true,
  //   width: 100,
  //   align: 'center',
  // },
  // {
  //   title: t('维度'),
  //   dataIndex: 'dtuipLat',
  //   sorter: true,
  //   width: 100,
  //   align: 'center',
  // },
  // {
  //   title: t('设备平台添加时间'),
  //   dataIndex: 'dtuipCreateDate',
  //   width: 150,
  //   align: 'center',
  //   ellipsis: true,
  //   sorter: true,
  // },
  {
    title: t('传感器类型'),
    dataIndex: 'dtuipSensorTypeId',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('是否在线'),
    dataIndex: 'dtuipIsLine',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否报警'),
    dataIndex: 'dtuipIsAlarms',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    width: 90,
    align: 'center',
  },

  // {
  //   title: t('单位'),
  //   dataIndex: 'dtuipUnit',
  //   width: 90,
  //   align: 'center',
  // },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('绑定设备'),
    field: 'dtuipId',
    component: 'ApiSelect',
    required: false,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入选择设备',
      api: devicePage,
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      resultField: 'records',
      labelField: 'deviceName',
      valueField: 'dtuipId',
    },
  },
  {
    label: t('传感器名称'),
    field: 'sensorName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入传感器名称',
    },
  },
  {
    label: t('传感器编号'),
    field: 'sensorNo',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入传感器编号',
    },
  },

  {
    label: t('传感器类型'),
    field: 'dtuipSensorTypeId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'sensor_type',
      },
    },
  },

  // {
  //   label: t('经度'),
  //   field: 'dtuipLng',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入经度',
  //   },
  // },
  // {
  //   label: t('维度'),
  //   field: 'dtuipLat',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入维度',
  //   },
  // },

  // {
  //   label: t('应用类型'),
  //   field: 'applicationType',
  //   component: 'ApiSelect',
  //   required: true,
  //   componentProps: {
  //     api: optionsListApi,
  //     params: {
  //       dictCode: 'application_type',
  //     },
  //   },
  // },
];
