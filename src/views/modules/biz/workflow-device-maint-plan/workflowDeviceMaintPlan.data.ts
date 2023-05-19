import { h, ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { enterpriseSelect } from '/@/api/biz/enterprise';
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const planCycleOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);

const { t } = useI18n();

const isDay = (type: string) => type === '4';

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('计划编号'),
      field: 'planNo',
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
      label: t('计划周期'),
      field: 'planCycle',
      component: 'Select',
      componentProps: {
        options: planCycleOptions,
        allowClear: true,
      },
    },
    {
      label: t('状态'),
      field: 'status',
      component: 'Select',
      componentProps: {
        options: dataItemStatusOptions,
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
    title: t('计划编号'),
    dataIndex: 'planNo',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('关联企业'),
    dataIndex: 'bizEnterprise',
    width: 160,
    align: 'left',
  },
  {
    title: t('生效日期'),
    dataIndex: 'planStartDate',
    width: 120,
    align: 'center',
  },
  {
    title: t('计划周期'),
    dataIndex: 'planCycle',
    width: 90,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
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
    label: t('计划编号'),
    field: 'planNo',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    dynamicDisabled: ({}) => unref(isUpdate),
    ifShow: ({}) => unref(isUpdate),
  },
  {
    label: t('关联企业'),
    field: 'organizationId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      optionFilterProp: 'label',
      api: enterpriseSelect,
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({}) => unref(isUpdate),
  },
  {
    label: t('生效日期'),
    field: 'planDate',
    component: 'RangePicker',
    required: true,
    componentProps: {
      style: { width: '100%' },
      // valueFormat: 'YYYY-MM-DD',
      // // showTime: true,
      // format: 'YYYY-MM-DD',
    },
  },
  {
    label: t('计划周期'),
    field: 'planCycle',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'plan_cycle',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('周期数值'),
    field: 'planCycleArgument',
    component: 'InputNumber',
    required: true,
    ifShow: ({ values }) => isDay(values.planCycle),
  },
  {
    label: t('状态'),
    field: 'status',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'data_item_status',
        excludeItems: ['2', '3'],
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('计划目标'),
    field: 'planContent',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
];
