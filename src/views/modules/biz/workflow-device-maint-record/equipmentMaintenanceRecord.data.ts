import { h, ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { enterpriseSelect } from '/@/api/manage/enterprise';
import { Tag } from 'ant-design-vue';
import { VxeGridPropTypes } from '/@/components/VxeTable';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const sensorTypeOptions = ref<any[]>([]);
export const maintenanceStatusOptions = ref<any[]>([]);
export const maintenanceWorkOrderTypeOptions = ref<any[]>([]);
export const maintenanceTaskTypeOptions = ref<any[]>([]);
export const deviceOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);
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
      label: t('流水号'),
      field: 'recordNo',
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
      label: t('工单类型'),
      field: 'workType',
      component: 'Select',
      componentProps: {
        options: maintenanceWorkOrderTypeOptions,
        allowClear: true,
      },
    },
    {
      label: t('维护状态'),
      field: 'eventStatus',
      component: 'Select',
      componentProps: {
        options: maintenanceStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('发生时间'),
      field: 'timeRange',
      component: 'RangePicker',
      componentProps: {
        showTime: true,
        style: { width: '100%' },
      },
    },
  ],
  fieldMapToTime: [['timeRange', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('流水号'),
    dataIndex: 'recordNo',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('公司名称'),
    dataIndex: 'bizEnterprise',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('工单类型'),
    dataIndex: 'workType',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('维护状态'),
    dataIndex: 'eventStatus',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('选择日期'),
    field: 'planDate',
    component: 'RangePicker',
    required: true,
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      // showTime: true,
    },
  },
  {
    label: t('计划目标'),
    field: 'planContent',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请填写计划目标...',
      rows: 4,
    },
  },
  {
    label: t('计划周期'),
    field: 'planCycle',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'plan_period_type',
      },
    },
    defaultValue: '1',
  },
];

/**
 * 表格字段
 */
export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    title: '序号',
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    title: '自定义编辑',
    width: 150,
    field: 'name1',
    align: 'center',
    editRender: {
      name: 'AInput',
      placeholder: '请点击输入',
    },
  },
  {
    width: 160,
    title: '操作',
    align: 'center',
    slots: { default: 'action' },
    fixed: 'right',
  },
];

/**
 * 表格字段
 */
export const deviceTableColumns: BasicColumn[] = [
  {
    title: t('公司名称'),
    dataIndex: 'organizationName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('所属区域'),
    dataIndex: 'regionName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  // {
  //   title: t('设备名称'),
  //   dataIndex: 'deviceName',
  //   sorter: true,
  //   width: 130,
  //   align: 'center',
  // },
  {
    title: t('传感器名称'),
    dataIndex: 'sensorName',
    sorter: true,
    width: 160,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
    ellipsis: true,
    sorter: true,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

/**
 * 表格字段
 */
export const sensorTableColumns: BasicColumn[] = [
  {
    title: t('公司名称'),
    dataIndex: 'enterpriseName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('所属区域'),
    dataIndex: 'regionName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  // {
  //   title: t('设备名称'),
  //   dataIndex: 'deviceName',
  //   sorter: true,
  //   width: 130,
  //   align: 'center',
  // },
  {
    title: t('传感器名称'),
    dataIndex: 'sensorName', // sensorName
    sorter: true,
    width: 130,
    align: 'center',
  },
  // {
  //   title: t('传感器类型'),
  //   dataIndex: 'dtuipSensorTypeId',
  //   width: 150,
  //   align: 'center',
  //   ellipsis: true,
  //   sorter: true,
  // },
  // {
  //   title: t('是否在线'),
  //   dataIndex: 'dtuipIsLine',
  //   width: 90,
  //   align: 'center',
  // },
  // {
  //   title: t('是否报警'),
  //   dataIndex: 'dtuipIsAlarms',
  //   width: 90,
  //   align: 'center',
  // },
  // {
  //   title: t('是否删除'),
  //   dataIndex: 'dtuipIsDelete',
  //   width: 90,
  //   align: 'center',
  // },
];

/**
 *  查询表单字段
 */
export const sensorSearchForm: FormProps = {
  baseColProps: { lg: 12, md: 8 },
  labelWidth: 80,
  schemas: [
    {
      label: t('所属单位'),
      field: 'organizationId',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属单位',
        options: enterpriseOptions,

        onChange: (e) => {
          console.log('e', e);
        },
        // onOptionsChange: (e) => {
        //   console.log('e', e);
        // },
      },
      // colSlot: 'organizationId',
    },
    // {
    //   label: t('所属单位'),
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
    //       placeholder: '请选择所属单位',
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
    // {
    //   label: t('传感器名称'),
    //   field: 'sensorName',
    //   component: 'Input',
    // },
    {
      label: t('所属区域'),
      field: 'regionId',
      component: 'Select',
      // colSlot: 'regionId',
      componentProps: {
        placeholder: '请选择所属区域',
        options: regionOptions,
      },
    },
  ],
};
