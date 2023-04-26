import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { sensorPage } from '/@/api/manage/sensor';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});
export const organizationId = ref<string>('');

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const sensorTypeOptions = ref<any[]>([]);
export const planPeriodTypeOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);
export const planId = ref<string>('');
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
      show: false, // NOTE: 隐藏
      field: 'planId',
      label: '计划ID',
      component: 'Input',
      defaultValue: planId, // TODO: 设置接收到的路由参数, 并设置默认值
    },
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
    {
      label: t('传感器名称'),
      field: 'sensorName',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('所属区域'),
    dataIndex: 'regionName',
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
    title: t('传感器类型'),
    dataIndex: 'dtuipSensorTypeId',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
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

/**
 * 表格字段
 */
export const sensorTableColumns: BasicColumn[] = [
  {
    title: t('所属区域'),
    dataIndex: 'installRegion',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('传感器名称'),
    dataIndex: 'sensorName',
    sorter: true,
    width: 130,
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
      label: t('关联企业'),
      field: 'organizationId',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属单位',
        options: enterpriseOptions,
        disabled: true,
      },
      defaultValue: organizationId,
      // colSlot: 'organizationId',
    },
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
