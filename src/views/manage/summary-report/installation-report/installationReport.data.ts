import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
// 接口
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
      field: 'deviceId',
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
        valueField: 'id',
      },
    },

    {
      label: t('传感器名称'),
      field: 'sensorName',
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
];
