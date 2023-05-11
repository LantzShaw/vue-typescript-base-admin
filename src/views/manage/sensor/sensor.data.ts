import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { enterpriseSelect } from '/@/api/manage/enterprise';

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
export const deviceOptions = ref<any[]>([]);
export const enterpriseOptions = ref<any[]>([]);
export const regionOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('传感器名称'),
      field: 'sensorName',
      component: 'Input',
    },
    {
      label: t('关联企业'),
      field: 'organizationId',
      component: 'ApiSelect',
      componentProps: {
        showSearch: true,
        optionFilterProp: 'label',
        api: enterpriseSelect,
        getPopupContainer: () => document.body,
      },
    },
    {
      label: t('传感器类型'),
      field: 'dtuipSensorTypeId',
      component: 'Select',
      componentProps: {
        options: sensorTypeOptions,
        allowClear: true,
        getPopupContainer: () => document.body,
      },
    },
    {
      label: t('是否在线'),
      field: 'dtuipIsLine',
      component: 'Select',
      componentProps: {
        options: onlineStatusOptions,
        allowClear: true,
        getPopupContainer: () => document.body,
      },
    },
    {
      label: t('位号'),
      field: 'locationNo',
      component: 'Input',
    },

    // {
    //   label: t('传感器编号'),
    //   field: 'sensorNo',
    //   component: 'Input',
    // },
    // {
    //   label: t('绑定设备'),
    //   field: 'deviceId',
    //   component: 'Select',
    //   required: false,
    //   componentProps: {
    //     placeholder: '请选择绑定设备',
    //     options: deviceOptions,
    //   },
    // },
    // {
    //   label: t('是否报警'),
    //   field: 'dtuipIsAlarms',
    //   component: 'Select',
    //   componentProps: {
    //     options: alarmStatusOptions,
    //     allowClear: true,
    //   },
    // },
    // {
    //   label: t('是否删除'),
    //   field: 'dtuipIsDelete',
    //   component: 'Select',
    //   componentProps: {
    //     options: deleteStatusOptions,
    //     allowClear: true,
    //   },
    // },
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
  {
    title: t('关联企业'),
    dataIndex: 'organizationId',
    sorter: true,
    width: 130,
    align: 'left',
    ellipsis: true,
  },
  {
    title: t('所属区域'),
    dataIndex: 'regionId',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('位号'),
    dataIndex: 'locationNo',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('传感器类型'),
    dataIndex: 'dtuipSensorTypeId',
    width: 120,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('是否在线'),
    dataIndex: 'dtuipIsLine',
    sorter: true,
    width: 80,
    align: 'center',
  },
  {
    title: t('数据最后上报时间'),
    dataIndex: 'dtuipUpdateDate',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    sorter: true,
    width: 80,
    align: 'center',
  },
  // {
  //   title: t('心跳包时间'),
  //   dataIndex: 'dtuipHeartbeatDate',
  //   sorter: true,
  //   width: 160,
  //   align: 'center',
  // },
  // {
  //   title: t('数值'),
  //   dataIndex: 'dtuipValue',
  //   width: 110,
  //   align: 'center',
  // },
  // {
  //   title: t('是否报警'),
  //   dataIndex: 'dtuipIsAlarms',
  //   width: 90,
  //   align: 'center',
  // },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('基本信息'),
    field: 'router',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
    // ifShow: ({ values }) => !isButton(values.type),
  },
  // {
  //   label: t('绑定设备'),
  //   field: 'deviceId',
  //   component: 'Select',
  //   required: false,
  //   componentProps: {
  //     placeholder: '请选择绑定设备',
  //     options: deviceOptions,
  //   },
  // },
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
      placeholder: '请选择传感器类型',
      // options: sensorTypeOptions,
      readonly: true,
      api: optionsListApi,
      params: {
        dictCode: 'sensor_type',
      },
    },
  },
  {
    label: t('关联企业'),
    field: 'organizationId',
    component: 'Select',
    // required: true,
    // colSlot: 'organizationId',
    componentProps: {
      disabled: true,
      placeholder: '请选择使用单位',
      options: enterpriseOptions,
    },
  },
  // {
  //   label: t('使用单位'),
  //   field: 'organizationId',
  //   component: 'Select',
  //   componentProps: ({ formModel, formActionType }) => {
  //     console.log('---------enterpriseOptions--------', enterpriseOptions);
  //     // const provincesOptions = [
  //     //   {
  //     //     id: 'guangdong',
  //     //     label: '广东省',
  //     //     value: '1',
  //     //     key: '1',
  //     //   },
  //     //   {
  //     //     id: 'jiangsu',
  //     //     label: '江苏省',
  //     //     value: '2',
  //     //     key: '2',
  //     //   },
  //     // ];

  //     return {
  //       options: enterpriseOptions.value,
  //       placeholder: '省份与城市联动',
  //       onChange: (e: any) => {
  //         console.log('e', e);
  //         // let citiesOptions =
  //         //   e == 1
  //         //     ? citiesOptionsData[provincesOptions[0].id]
  //         //     : citiesOptionsData[provincesOptions[1].id];
  //         // // console.log(citiesOptions)
  //         // if (e === undefined) {
  //         //   citiesOptions = [];
  //         // }
  //         // formModel.city = undefined; //  reset city value
  //         // const { updateSchema } = formActionType;
  //         // updateSchema({
  //         //   field: 'city',
  //         //   componentProps: {
  //         //     options: citiesOptions,
  //         //   },
  //         // });
  //       },
  //     };
  //   },
  // },
  {
    label: t('采样方式'),
    field: 'samplingMode',
    required: true,
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
    required: true,
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
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入气体名称',
    },
  },
  {
    label: t('现场声光'),
    field: 'liveSoundLight',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'hn',
      },
    },
  },
  {
    label: t('现场显示'),
    field: 'liveDisplay',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'hn',
      },
    },
  },
  {
    label: t('型号规格'),
    field: 'specifications',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入型号规格',
    },
  },
  {
    label: t('测量范围'),
    field: 'measuringRange',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入测量范围',
    },
  },
  {
    label: t('出厂编号'),
    field: 'factoryNumber',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入出厂编号',
    },
  },
  {
    label: t('制造厂家'),
    field: 'manufacturer',
    required: true,
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
    label: t('浓度1'),
    helpMessage: '最高容许浓度',
    field: 'maxConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入最高容许浓度',
    },
  },
  {
    label: t('浓度2'),
    helpMessage: '短时间接触容许浓度',
    field: 'shortTimeConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入短时间接触容许浓度',
    },
  },
  {
    label: t('浓度3'),
    helpMessage: '直接致害浓度',
    field: 'directHarmfulConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入直接致害浓度',
    },
  },
  {
    label: t('浓度4'),
    helpMessage: '时间加权平均容许浓度',
    field: 'timeConc',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入时间加权平均容许浓度',
    },
  },

  {
    label: t('安装信息'),
    field: 'router',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('位号'),
    field: 'locationNo',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入位号',
    },
  },
  {
    label: t('所属区域'),
    field: 'regionId',
    required: true,
    component: 'ApiSelect',
    // componentProps: {
    //   options: regionOptions,
    // },
    // component: 'Select',
    // colSlot: 'regionId',
    slot: 'regionId',
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
    label: t('安装高度'),
    field: 'installHeight',
    component: 'Input',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入安装高度',
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
    label: t('接入信息'),
    field: 'router',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
    // ifShow: ({ values }) => !isButton(values.type),
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
    component: 'Input',
    componentProps: {
      placeholder: '请输入使用状态',
    },
  },
];
