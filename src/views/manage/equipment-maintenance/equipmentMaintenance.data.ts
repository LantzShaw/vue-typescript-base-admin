import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';
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
      label: t('状态'),
      field: 'planStatus',
      component: 'Select',
      componentProps: {
        options: alarmStatusOptions,
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
    title: t('企业名称'),
    dataIndex: 'companyName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('计划目标'),
    dataIndex: 'planContent',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('开始日期'),
    dataIndex: 'planStartDate',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('结束日期'),
    dataIndex: 'planEndDate',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'planStatus',
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
    label: t('计划目标'),
    field: 'planContent',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入计划目标',
      rows: 4,
    },
  },
  {
    label: t('日期'),
    field: 'dtuipTriggerDate',
    component: 'RangePicker',
  },
];
