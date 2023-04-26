import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

import { deviceGroupPage } from '/@/api/manage/deviceGroup';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);
export const deviceGroupOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('设备组'),
      field: 'groupId',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备分组',
        options: deviceGroupOptions,
      },
    },
    {
      label: t('设备名称'),
      field: 'deviceName',
      component: 'Input',
    },
    {
      label: t('设备编号'),
      field: 'deviceNo',
      component: 'Input',
    },
    {
      label: t('是否报警'),
      field: 'dtuipIsAlarms',
      component: 'Select',
      componentProps: {
        options: alarmStatusOptions,
        allowClear: true,
      },
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
      colProps: { span: 8 },
    },
    // {
    //   label: t('是否删除'),
    //   field: 'dtuipIsDelete',
    //   component: 'Select',
    //   componentProps: {
    //     options: deleteStatusOptions,
    //     allowClear: true,
    //   },
    // },
    {
      label: t('是否在线'),
      field: 'dtuipIsLine',
      component: 'Select',
      componentProps: {
        options: onlineStatusOptions,
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
    title: t('设备分组名称'),
    dataIndex: 'bizDeviceGroup',
    width: 130,
    align: 'center',
  },
  {
    title: t('设备名称'),
    dataIndex: 'deviceName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('设备编号'),
    dataIndex: 'deviceNo',
    sorter: true,
    width: 160,
    align: 'center',
  },
  {
    title: t('是否在线'),
    dataIndex: 'dtuipIsLine',
    width: 90,
    align: 'center',
  },
  {
    title: t('协议类型'),
    dataIndex: 'dtuipLinktype',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('启用状态'),
    dataIndex: 'status',
    width: 120,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('是否报警'),
    dataIndex: 'dtuipIsAlarms',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    width: 90,
    align: 'center',
  },
  {
    title: t('经度'),
    dataIndex: 'dtuipLng',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('维度'),
    dataIndex: 'dtuipLat',
    sorter: true,
    width: 120,
    align: 'center',
  },
  {
    title: t('设备平台添加时间'),
    dataIndex: 'createTime',
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
  //   label: t('设备名称'),
  //   field: 'deviceName',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入设备名称',
  //   },
  // },
  // {
  //   label: t('设备编号'),
  //   field: 'deviceNo',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入设备编号',
  //   },
  // },
  // {
  //   label: t('协议类型'),
  //   field: 'dtuipLinktype',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     maxlength: 100,
  //     placeholder: '请输入协议类型',
  //   },
  // },
  {
    label: t('经度'),
    field: 'dtuipLng',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入经度',
    },
  },
  {
    label: t('维度'),
    field: 'dtuipLat',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入维度',
    },
  },
];
