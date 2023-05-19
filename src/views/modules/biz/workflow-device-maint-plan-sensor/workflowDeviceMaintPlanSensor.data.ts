import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 接口
import { sensorPage } from '/@/api/manage/sensor';
import { installRegionSelect } from '/@/api/biz/installRegion';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});
export const planId = ref('');
export const organizationId = ref('');

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
    {
      label: t('传感器名称'),
      field: 'sensorName',
      component: 'Input',
    },
    {
      label: t('所属区域'),
      field: 'regionId',
      component: 'ApiSelect',
      componentProps: {
        showSearch: true,
        optionFilterProp: 'label',
        api: installRegionSelect,
        params: {
          organizationId: organizationId,
        },
        getPopupContainer: () => document.body,
      },
    },
    {
      label: t('位号'),
      field: 'locationNo',
      component: 'Input',
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
    title: t('所属区域'),
    dataIndex: 'regionName',
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
    width: 80,
    align: 'center',
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
    title: t('传感器名称'),
    dataIndex: 'sensorName',
    sorter: true,
    width: 130,
    align: 'center',
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
];

/**
 *  查询表单字段
 */
export const sensorSearchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 80,
  schemas: [
    {
      label: t('传感器名称'),
      field: 'sensorName',
      component: 'Input',
    },
    {
      label: t('所属区域'),
      field: 'regionId',
      component: 'ApiSelect',
      componentProps: {
        showSearch: true,
        optionFilterProp: 'label',
        api: installRegionSelect,
        params: {
          organizationId: organizationId,
        },
        getPopupContainer: () => document.body,
      },
    },
    {
      label: t('位号'),
      field: 'locationNo',
      component: 'Input',
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
  ],
};

/**
 * 表格字段
 */
export const regionTableColumns: BasicColumn[] = [
  {
    title: t('区域名称'),
    dataIndex: 'regionName',
    align: 'center',
  },
  {
    title: t('传感器数量'),
    dataIndex: 'bizDeviceSensorNum',
    align: 'center',
  },
];
