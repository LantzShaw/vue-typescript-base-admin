import { h, ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { Tag } from 'ant-design-vue';
import { sensorPage } from '/@/api/manage/sensor';

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
export const planId = ref<string>('');

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
      show: false,
      field: 'planId',
      label: '计划ID',
      component: 'Input',
      defaultValue: planId,
    },
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
      colProps: { span: 4 },
    },
    // {
    //   label: t('计划周期'),
    //   field: 'planCycle',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     api: optionsListApi,
    //     params: {
    //       dictCode: 'plan_period_type',
    //     },
    //   },
    // },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  // {
  //   title: t('所属企业'),
  //   dataIndex: 'companyName',
  //   sorter: true,
  //   width: 130,
  //   align: 'center',
  // },
  {
    title: t('设备名称'),
    dataIndex: 'deviceName',
    sorter: true,
    width: 130,
    align: 'center',
  },
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
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('企业名称'),
    field: 'companyName',
    component: 'ApiSelect',
    required: false,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入选择传感器',
      api: sensorPage,
      params: {
        pageIndex: 1,
        pageSize: 100000,
      },
      resultField: 'records',
      labelField: 'sensorName',
      valueField: 'id',
    },
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
