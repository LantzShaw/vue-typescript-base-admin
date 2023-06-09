import { ref } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const sensorTypeOptions = ref<any[]>([]);
export const eventTriggerStatusOptions = ref<any[]>([]);
export const gasTypeOptions = ref<any[]>([]);
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
      label: t('设备名称'),
      field: 'dtuipDeviceName',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
      },
    },
    {
      label: t('传感器名称'),
      field: 'dtuipSensorName',
      component: 'Input',
      componentProps: {
        placeholder: '请输入传感器名称',
      },
    },
    {
      label: t('事件状态'),
      field: 'eventStatus',
      component: 'Select',
      componentProps: {
        options: eventTriggerStatusOptions,
        allowClear: true,
      },
    },
    // {
    //   label: t('触发时间'),
    //   field: 'dtuipTriggerDate',
    //   component: 'RangePicker',
    // },
    // {
    //   label: t('是否删除'),
    //   field: 'dtuipIsDelete',
    //   component: 'Select',
    //   componentProps: {
    //     options: deleteStatusOptions,
    //     allowClear: true,
    //   },
    // },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('使用单位'),
    dataIndex: 'bizEnterprise',
    width: 120,
    ellipsis: true,
    align: 'center',
    // customRender: ({ record }) => {
    //   return (
    //     <a-Tooltip placement="top">
    //       <template #title>
    //         <span>{{ record }}</span>
    //       </template>
    //       <span>{{ record.bizEnterprise }}</span>
    //     </a-Tooltip>
    //   )

    //   // return thumbUrl && <ThumbUrl fileUrl={thumbUrl} />;
    // },
  },
  {
    title: t('所属区域'),
    dataIndex: 'bizInstallRegion',
    width: 120,
    align: 'center',
  },
  {
    title: t('安装位置'),
    dataIndex: 'installLocation',
    width: 120,
    align: 'center',
  },
  {
    title: t('位号'),
    dataIndex: 'locationNo',
    width: 120,
    align: 'center',
  },
  {
    title: t('气体类型'),
    dataIndex: 'gasType',
    width: 120,
    align: 'center',
  },
  {
    title: t('气体名称'),
    dataIndex: 'gasName',
    width: 120,
    align: 'center',
  },
  {
    title: t('触发时间'),
    dataIndex: 'dtuipTriggerDate',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('触发值'),
    dataIndex: 'dtuipTriggerVal',
    width: 100,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('事件状态'),
    dataIndex: 'eventStatus',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    width: 90,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('传感器名称'),
    field: 'sensorName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入传感器名称',
    },
  },
  {
    label: t('传感器编号'),
    field: 'sensorNo',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入传感器编号',
    },
  },
  {
    label: t('传感器IP ID'),
    field: 'dtuipId',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
      placeholder: '请输入传感器编号',
    },
  },
  {
    label: t('传感器类型'),
    field: 'dtuipSensorTypeId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'sensor_type',
      },
    },
  },
];
