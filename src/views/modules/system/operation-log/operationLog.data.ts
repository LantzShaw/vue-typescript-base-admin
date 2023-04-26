import { ref, h } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';
import { JsonPreview } from '/@/components/CodeEditor';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const operationTypeOptions = ref<any[]>([]);
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
      label: t('追踪ID'),
      field: 'traceId',
      component: 'Input',
    },

    {
      label: t('日志消息'),
      field: 'msg',
      component: 'Input',
    },
    {
      label: t('请求IP'),
      field: 'remoteIp',
      component: 'Input',
    },
    {
      label: t('请求URI'),
      field: 'requestUri',
      component: 'Input',
    },
    {
      label: t('状态'),
      field: 'status',
      component: 'Select',
      componentProps: {
        options: logStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('类型'),
      field: 'type',
      component: 'Select',
      componentProps: {
        options: operationTypeOptions,
        allowClear: true,
      },
    },
    {
      field: 'timeRange',
      component: 'RangePicker',
      label: '操作时间',
      componentProps: {
        showTime: true,
        style: { width: '100%' },
      },
    },
  ],
  fieldMapToTime: [['timeRange', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('追踪ID'),
    dataIndex: 'traceId',
    width: 150,
  },
  {
    title: t('日志消息'),
    dataIndex: 'msg',
    width: 160,
    align: 'left',
  },
  {
    title: t('类型'),
    dataIndex: 'type',
    width: 90,
    align: 'center',
  },
  {
    title: t('请求IP'),
    dataIndex: 'remoteIp',
    width: 100,
    align: 'left',
  },
  {
    title: t('请求URI'),
    dataIndex: 'requestUri',
    width: 160,
    align: 'left',
  },
  {
    title: t('请求方式'),
    dataIndex: 'method',
    width: 80,
    align: 'center',
  },
  {
    title: t('耗时'),
    dataIndex: 'time',
    width: 90,
  },
  {
    title: t('操作人'),
    dataIndex: 'operator',
    width: 90,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    width: 90,
    align: 'center',
  },
  {
    title: t('操作时间'),
    dataIndex: 'requestTime',
    width: 120,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: DescItem[] = [
  {
    field: 'traceId',
    label: '追踪ID',
  },
  {
    field: 'msg',
    label: '日志消息',
  },
  {
    field: 'method',
    label: '请求方式',
  },
  {
    field: 'remoteIp',
    label: '请求IP',
  },
  {
    field: 'requestUri',
    label: '请求URI',
  },
  {
    field: 'methodClass',
    label: '方法类',
  },
  {
    field: 'methodName',
    label: '方法名',
  },
  {
    field: 'userAgent',
    label: 'userAgent',
  },
  {
    field: 'requestTime',
    label: '操作时间',
  },
  {
    field: 'operator',
    label: '操作人',
  },
  {
    field: 'time',
    label: '耗时',
    render: (curVal) => {
      return `${curVal}ms`;
    },
  },
  {
    field: 'status',
    label: '状态',
    render: (curVal) => {
      if (curVal == 1) {
        return `成功`;
      } else {
        return `失败`;
      }
    },
  },
  {
    field: 'params',
    label: '执行参数',
    render: (curVal) => {
      if (curVal) {
        return h(JsonPreview, { data: JSON.parse(curVal) });
      }
      return h('span', curVal);
    },
  },
  {
    field: 'result',
    label: '响应结果',
    render: (curVal) => {
      if (curVal) {
        return h(JsonPreview, { data: JSON.parse(curVal) });
      }
      return h('span', curVal);
    },
    show: (data) => {
      if (data && data.status === 1) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'exception',
    label: '异常信息',
    show: (data) => {
      if (data && data.status === 0) {
        return true;
      }
      return false;
    },
  },
];
