import { h, ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { companyPage } from '/@/api/manage/company';
import { Tag } from 'ant-design-vue';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const sensorTypeOptions = ref<any[]>([]);
export const planPeriodTypeOptions = ref<any[]>([]);
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
    // {
    //   label: t('企业名称'),
    //   field: 'companyName',
    //   component: 'ApiSelect',
    //   required: false,
    //   componentProps: {
    //     maxlength: 100,
    //     placeholder: '请输入选择企业',
    //     api: companyPage,
    //     params: {
    //       pageIndex: 1,
    //       pageSize: 100000,
    //     },
    //     resultField: 'records',
    //     labelField: 'enterpriseName',
    //     valueField: 'id',
    //   },
    // },

    {
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '启用', value: '0' },
          { label: '停用', value: '1' },
        ],
      },
      colProps: { span: 8 },
    },
    {
      label: t('计划周期'),
      field: 'planCycle',
      component: 'ApiSelect',
      componentProps: {
        api: optionsListApi,
        params: {
          dictCode: 'plan_period_type',
        },
      },
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  // {
  //   title: t('企业名称'),
  //   dataIndex: 'enterpriseName',
  //   sorter: true,
  //   width: 130,
  //   align: 'center',
  // },
  {
    title: t('计划目标'),
    dataIndex: 'planContent',
    sorter: true,
    width: 160,
    align: 'center',
  },
  {
    title: t('开始日期'),
    dataIndex: 'planStartDate',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('结束日期'),
    dataIndex: 'planEndDate',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('计划周期'),
    dataIndex: 'planCycle',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('周期数值'),
    dataIndex: 'planCycleArgument',
    sorter: true,
    width: 120,
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
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  // {
  //   label: t('企业名称'),
  //   field: 'companyName',
  //   component: 'ApiSelect',
  //   required: false,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入选择企业',
  //     api: companyPage,
  //     params: {
  //       pageIndex: 1,
  //       pageSize: 100000,
  //     },
  //     resultField: 'records',
  //     labelField: 'enterpriseName',
  //     valueField: 'id',
  //   },
  // },
  {
    label: t('选择日期'),
    field: 'planDate',
    component: 'RangePicker',
    required: true,
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      // showTime: true,
      // format: 'YYYY-MM-DD HH:mm:ss',
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
  {
    label: t('计划周期'),
    field: 'planCycleArgument',
    component: 'InputNumber',
    required: true,
  },
  {
    label: t('计划周期'),
    field: 'status',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];
