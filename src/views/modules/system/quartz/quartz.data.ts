import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
// 接口

import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const quartzJobCodeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('任务名称'),
      field: 'jobName',
      component: 'Input',
    },
    {
      label: t('Bean名称'),
      field: 'beanName',
      component: 'Input',
    },
    {
      label: t('状态'),
      field: 'state',
      component: 'Select',
      componentProps: {
        options: quartzJobCodeOptions,
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
    title: t('任务名称'),
    dataIndex: 'jobName',
    sorter: true,
    width: 130,
  },
  {
    title: t('Bean名称'),
    dataIndex: 'beanName',
    sorter: true,
    width: 130,
  },
  {
    title: t('Cron表达式'),
    dataIndex: 'cronExpression',
    sorter: true,
    width: 130,
  },
  {
    title: t('状态'),
    dataIndex: 'state',
    sorter: true,
    width: 100,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    field: 'jobName',
    label: t('任务名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'beanName',
    label: t('Bean名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'methodName',
    label: t('方法名称'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    field: 'cronExpression',
    label: t('Cron表达式'),
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('执行策略'),
    field: 'misfirePolicy',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'quartz_misfire_policy',
      },
    },
  },
  {
    field: 'params',
    label: t('参数'),
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('是否并发'),
    field: 'concurrent',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('状态'),
    field: 'state',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'quartz_job_code',
      },
    },
  },
  {
    label: t('备注'),
    field: 'remark',
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
