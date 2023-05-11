import { h, ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';

import { BasicUpload } from '/@/components/Upload';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { Tag } from 'ant-design-vue';
import { sensorPage } from '/@/api/manage/sensor';
import { uploadApi } from '/@/api/sys/upload';

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
export const sensorId = ref<string>('');

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
      field: 'sensorId',
      label: '传感器ID',
      component: 'Input',
      defaultValue: sensorId, // TODO: 设置接收到的路由参数, 并设置默认值
    },
    {
      field: 'certificateNumber',
      label: '证书编号',
      component: 'Input',
    },
    {
      field: 'traceUnit',
      label: '溯源单位',
      component: 'Input',
    },
    // {
    //   field: 'status',
    //   label: '状态',
    //   component: 'Select',
    //   componentProps: {
    //     options: [
    //       { label: '启用', value: '0' },
    //       { label: '停用', value: '1' },
    //     ],
    //   },
    //   colProps: { span: 4 },
    // },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  // {
  //   title: t('传感器名称'),
  //   dataIndex: 'sensorName',
  //   sorter: true,
  //   width: 160,
  //   align: 'center',
  // },
  {
    title: t('履历来源'),
    dataIndex: 'cvSource',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('履历类型'),
    dataIndex: 'cvType',
    width: 130,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('溯源日期'),
    field: 'traceDate',
    component: 'DatePicker',
    required: true,
    componentProps: {
      style: { width: '100%' },
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      // showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // {
  //   label: t('有效期'),
  //   field: 'expirationDate',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {},
  // },
  // {
  //   label: t('有效期'),
  //   field: 'expirationDate',
  //   component: 'DatePicker',
  //   required: true,
  //   componentProps: {
  //     style: { width: '100%' },
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //     // showTime: true,
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //   },
  // },
  {
    label: t('周期'),
    field: 'traceCycle',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入周期',
    },
  },
  {
    label: t('证书编号'),
    field: 'certificateNumber',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入证书编号',
    },
  },
  {
    label: t('溯源单位'),
    field: 'traceUnit',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入溯源单位',
    },
  },
  {
    label: t('附件'),
    field: 'list',
    // slot: 'list',
    colSlot: 'list',
    component: 'Upload',
    // render: () => '<button />',
    // component: 'Upload',
    // componentProps: {
    //   api: uploadApi,
    // },
  },
];
