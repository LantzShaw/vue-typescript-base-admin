import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { orgTree } from '/@/api/system/org';

import { checkApplicationCode } from '/@/api/system/application';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const organizationOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('所属单位'),
      field: 'organizationId',
      component: 'ApiTreeSelect',
      componentProps: {
        api: orgTree,
        immediate: true,
        allowClear: true,
      },
    },
    {
      label: t('部门名称'),
      field: 'departmentName',
      component: 'Input',
    },
    {
      label: t('部门简称'),
      field: 'shortName',
      component: 'Input',
    },
  ],
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('部门名称'),
    dataIndex: 'departmentName',
    width: 130,
    align: 'left',
  },
  {
    title: t('部门简称'),
    dataIndex: 'shortName',
    width: 130,
    align: 'center',
  },
  {
    title: t('分区代码'),
    dataIndex: 'partitionCode',
    width: 130,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('部门名称'),
    field: 'departmentName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('部门分区码'),
    field: 'partitionCode',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('部门简称'),
    field: 'shortName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255,
    },
  },
  {
    label: t('所属单位'),
    field: 'organizationId',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({}) => unref(isUpdate),
  },
  {
    label: t('上级部门'),
    field: 'parentId',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
];
