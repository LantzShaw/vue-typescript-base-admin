import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

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
  baseColProps: { lg: 10, md: 8 },
  labelWidth: 90,
  colon: true,
  schemas: [
    {
      label: t('操作时间'),
      field: '[startDate, endDate]',
      component: 'RangePicker',
      componentProps: {
        style: { width: '100%' },
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        placeholder: ['开始时间', '结束时间'],
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
    title: t('单位名称'),
    dataIndex: 'enterpriseName',
    width: 180,
    align: 'center',
  },
  {
    title: t('报警器名称'),
    dataIndex: 'sensorName',
    width: 130,
    align: 'center',
  },
  {
    title: t('位号'),
    dataIndex: 'locationNo',
    width: 100,
    align: 'center',
  },
  {
    title: t('所属区域'),
    dataIndex: 'regionName',
    width: 100,
    align: 'center',
  },
  {
    title: t('日期'),
    dataIndex: 'changeDate',
    width: 120,
    align: 'center',
  },
];
