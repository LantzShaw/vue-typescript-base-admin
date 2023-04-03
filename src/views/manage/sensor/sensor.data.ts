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
import { companyPage } from '/@/api/manage/company';

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

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
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
        pageSize: 10,
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
    // required: true,
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
  {
    label: t('所属单位'),
    field: 'organizationId',
    component: 'ApiSelect',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入所属单位',
      api: companyPage,
      params: {
        pageIndex: 1,
        pageSize: 100000,
      },
      resultField: 'records',
      labelField: 'enterpriseName',
      valueField: 'id',
    },
  },
  {
    label: t('采样方式'),
    field: 'samplingMode',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'sample_mode_type',
      },
    },
  },
  {
    label: t('气体类型'),
    field: 'gasType',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'gas_type',
      },
    },
  },
  {
    label: t('气体名称'),
    field: 'gasName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入气体名称',
    },
  },
  {
    label: t('现场声光'),
    field: 'liveSoundLight',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('现场显示'),
    field: 'liveDisplay',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('型号规格'),
    field: 'specifications',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入型号规格',
    },
  },
  {
    label: t('测量范围'),
    field: 'measuringRange',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入测量范围',
    },
  },
  {
    label: t('出厂编号'),
    field: 'factoryNumber',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入出厂编号',
    },
  },
  {
    label: t('制造厂家'),
    field: 'factoryNumber',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入制造厂家',
    },
  },
  {
    label: t('型式评价'),
    field: 'typeEvaluation',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入型式评价',
    },
  },
  {
    label: t('防爆合格'),
    field: 'exNumber',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入防爆合格',
    },
  },
  {
    label: t('探测器类型'),
    field: 'probeType',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入探测器类型',
    },
  },
  {
    label: t('探测器类型'),
    field: 'probeType',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入探测器类型',
    },
  },
  {
    label: t('A1值'),
    field: 'a1Value',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入A1值',
    },
  },
  {
    label: t('A2值'),
    field: 'a2Value',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入A2值',
    },
  },
  {
    label: t('最高容许浓度'),
    field: 'maxConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入最高容许浓度',
    },
  },
  {
    label: t('位号'),
    field: 'locationNo',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入位号',
    },
  },
  {
    label: t('短时间接触容许浓度'),
    field: 'shortTimeConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入短时间接触容许浓度',
    },
  },
  {
    label: t('直接致害浓度'),
    field: 'directHarmfulConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入直接致害浓度',
    },
  },
  {
    label: t('时间加权平均容许浓度'),
    field: 'timeConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入时间加权平均容许浓度',
    },
  },

  {
    label: t('所属区域'),
    field: 'installRegion',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入所属区域',
    },
  },
  {
    label: t('安装位置'),
    field: 'installLocation',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入安装位置',
    },
  },
  {
    label: t('现场环境'),
    field: 'siteEnvironment',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'live_environment_type',
      },
    },
  },
  {
    label: t('释放源'),
    field: 'releaseSource',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('IOT序号'),
    field: 'iotNo',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入IOT序号',
    },
  },
  {
    label: t('接入状态'),
    field: 'accessStatus',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'access_status',
      },
    },
  },
  {
    label: t('使用状态'),
    field: 'useStatus',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'access_status',
      },
    },
  },
];
