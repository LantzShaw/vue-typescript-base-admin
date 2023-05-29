import { ref } from 'vue';
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
export const organizationId = ref('');

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

export const appearanceControllerStatusOptions = ref<any[]>([]);
export const acoustoOpticAlarmStatusOptions = ref<any[]>([]);
export const registrationErrorStatusOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('器具名称'),
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
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('器具名称'),
    dataIndex: 'sensorName',
    width: 130,
    align: 'center',
  },
  {
    title: t('型号规格'),
    dataIndex: 'specifications',
    width: 120,
    align: 'center',
    ellipsis: true,
  },
  {
    title: t('位号'),
    dataIndex: 'locationNo',
    width: 100,
    align: 'center',
  },
  {
    title: t('所在位置'),
    dataIndex: 'installLocation',
    width: 100,
    align: 'center',
  },
  {
    title: t('出厂编号'),
    dataIndex: 'factoryNumber',
    width: 100,
    align: 'center',
  },
  {
    title: t('生产厂家'),
    dataIndex: 'manufacturer',
    width: 100,
    align: 'center',
  },
  {
    title: t('量程'),
    dataIndex: 'measuringRange',
    width: 100,
    align: 'center',
  },
  {
    title: t('外观/通电及控制器'),
    dataIndex: 'result1',
    width: 160,
    align: 'center',
    edit: false,
    editRow: true,
    // editable: true,
    editComponent: 'Select',
    editComponentProps: {
      options: appearanceControllerStatusOptions,
      // api: optionsListApi,
      // params: {
      //   dictCode: 'appearance_controller_status',
      // },
    },
  },
  {
    title: t('标准值'),
    dataIndex: 'result2',
    width: 200,
    align: 'center',
    edit: false,
    editComponent: 'Input',
    editRow: true,
    // editable: true,
  },
  {
    title: t('检查结果'),
    dataIndex: 'result',
    width: 100,
    align: 'center',
    children: [
      {
        title: t('示值误差'),
        dataIndex: 'result3',
        width: 130,
        align: 'center',
        edit: false,
        editRow: true,
        // editable: true,
        editComponent: 'Select',
        editComponentProps: {
          options: registrationErrorStatusOptions,
          // api: optionsListApi,
          // params: {
          //   dictCode: 'appearance_controller_status',
          // },
        },
      },
      {
        title: t('声光报警'),
        dataIndex: 'result4',
        width: 130,
        align: 'center',
        edit: false,
        editRow: true,
        // editable: true,
        editComponent: 'Select',
        editComponentProps: {
          options: acoustoOpticAlarmStatusOptions,
          // api: optionsListApi,
          // params: {
          //   dictCode: 'acousto_optic_alarm_status',
          // },
        },
      },
    ],
  },
  {
    title: t('建议'),
    dataIndex: 'suggestion',
    width: 200,
    align: 'center',
    edit: false,
    editRow: true,
    // editable: true,
    editComponentProps: {
      defaultValue: '请填写建议',
    },
  },
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
  },

  {
    label: t('使用单位'),
    field: 'organizationId',
    component: 'ApiSelect',
    componentProps: {
      disabled: true,
      showSearch: true,
      optionFilterProp: 'label',
      api: enterpriseSelect,
      getPopupContainer: () => document.body,
    },
  },
];
