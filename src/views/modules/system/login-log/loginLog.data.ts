import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});
export const tfOptions = ref<any[]>([]);

export const loginEventTypeOptions = ref<any[]>([]);
export const logStatusOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('用户名'),
      field: 'principalName',
      component: 'Input',
    },
    {
      label: t('客户端ID'),
      field: 'clientId',
      component: 'Input',
    },
    {
      label: t('IP地址'),
      field: 'remoteIp',
      component: 'Input',
    },
    {
      label: t('类型'),
      field: 'operationType',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '登录',
            value: '1',
          },
          {
            label: '登出',
            value: '2',
          },
        ],
        allowClear: true,
      },
    },
    {
      field: 'timeRange',
      component: 'RangePicker',
      label: '时间',
      componentProps: {
        style: { width: '100%' },
      },
    },
  ],
  fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'YYYY-MM-DD']],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('类型'),
    dataIndex: 'operationTypeDisplayName',
    width: 100,
  },
  {
    title: t('用户名'),
    dataIndex: 'principalName',
    sorter: true,
    width: 100,
  },
  {
    title: t('客户端ID'),
    dataIndex: 'clientId',
    sorter: true,
    width: 100,
  },
  {
    title: t('IP地址'),
    dataIndex: 'remoteIp',
    sorter: true,
    width: 120,
  },
  {
    title: t('操作系统'),
    dataIndex: 'osName',
    sorter: true,
    width: 90,
  },
  {
    title: t('浏览器'),
    dataIndex: 'browserName',
    sorter: true,
    width: 100,
  },
  {
    title: t('时间'),
    dataIndex: 'createTime',
    sorter: true,
    width: 120,
  },
];

/**
 * 表单字段
 */

export const inputFormSchemas: DescItem[] = [
  {
    field: 'operationType',
    label: '类型',
    render: (curVal) => {
      if (curVal == '') {
        return `登录`;
      } else {
        return `登出`;
      }
    },
  },
  {
    field: 'principalName',
    label: '用户名',
  },
  {
    field: 'clientId',
    label: '客户端ID',
  },
  {
    field: 'remoteIp',
    label: 'IP地址',
  },
  {
    field: 'mobileFlag',
    label: '移动端',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'osName',
    label: '操作系统',
  },

  {
    field: 'browserName',
    label: '浏览器',
  },
  {
    field: 'engineName',
    label: '浏览器引擎',
  },
  {
    field: 'mobilePlatformFlag',
    label: '移动端平台',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'iphoneOrIpodFlag',
    label: 'Iphone Or Ipod',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'ipadFlag',
    label: 'Ipad',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'iosFlag',
    label: 'IOS操作系统',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'androidFlag',
    label: 'Android操作系统',
    render: (curVal) => {
      if (curVal == 1) {
        return `是`;
      } else {
        return `否`;
      }
    },
  },
  {
    field: 'createTime',
    label: '时间',
  },
];
