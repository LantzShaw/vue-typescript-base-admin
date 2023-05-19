import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

import { devicePage } from '/@/api/manage/device';
import { companyPage } from '/@/api/manage/company';
import { installRegionPage } from '/@/api/manage/installRegion';

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
  colon: true,
  schemas: [
    {
      label: t('操作时间'),
      field: 'startDate',
      component: 'DatePicker',
      componentProps: {
        style: { width: '100%' },
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        // placeholder: ['开始时间', '结束时间'],
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
    dataIndex: 'organizationName',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('超期数量(个)'),
    dataIndex: 'count',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('最长超期天数(天)'),
    dataIndex: 'maxDate',
    width: 130,
    align: 'center',
  },
];
