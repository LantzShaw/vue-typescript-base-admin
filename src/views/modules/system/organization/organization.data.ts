import { ref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { TreeItem } from '/@/components/Tree/index';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { orgTreeForEdit, checkId } from '/@/api/system/org';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const dataScopeTypeOptions = ref<any[]>([]);
export const orgTypeOptions = ref<any[]>([]);
export const organizationTypeOptions = ref<any[]>([]);
export const organizationTreeOptions = ref<any[]>([]);

export const treeData = ref<TreeItem[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('编码'),
      field: 'id',
      component: 'Input',
    },
    {
      label: t('机构名称'),
      field: 'organizationName',
      component: 'Input',
    },
    {
      label: t('机构类型'),
      field: 'organizationType',
      component: 'Select',
      componentProps: {
        options: orgTypeOptions,
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
    title: t('编码'),
    dataIndex: 'id',
    width: 120,
    align: 'left',
    // slots: { customRender: 'firstColumn' },
  },
  {
    title: t('机构名称'),
    dataIndex: 'organizationName',
    width: 130,
    align: 'left',
  },
  {
    title: t('排序'),
    dataIndex: 'ranking',
    width: 80,
  },
  {
    title: t('类型'),
    dataIndex: 'organizationType',
    sorter: true,
    width: 90,
    align: 'center',
    // slots: { customRender: 'orgType' },
  },
  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('备注'),
    dataIndex: 'remark',
    width: 130,
    align: 'left',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('编码'),
    field: 'id',
    helpMessage: '为空则自动生成',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    rules: [
      {
        validator(_rule, value) {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkId(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('编码已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
  },
  {
    label: t('上级机构'),
    field: 'parentId',
    component: 'TreeSelect',
    componentProps: {
      treeData: [],
      placeholder: '无',
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    label: t('机构名称'),
    field: 'organizationName',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('机构类型'),
    field: 'organizationType',
    component: 'ApiRadioGroup',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'organization_type',
      },
      isBtn: true,
    },
  },

  {
    label: t('排序'),
    field: 'ranking',
    helpMessage: '升序',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
    },
    required: true,
  },
];

/**
 * 表单字段
 */
export const editFormSchemas: FormSchema[] = [
  {
    label: t('编码'),
    field: 'id',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      disabled: true,
    },
  },
  {
    label: t('上级机构'),
    field: 'parentId',
    component: 'TreeSelect',
    componentProps: {
      treeData: [],
      placeholder: '无',
      disabled: true,
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('机构名称'),
    field: 'organizationName',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
  },
  {
    label: t('机构类型'),
    field: 'organizationType',
    component: 'RadioButtonGroup',
    required: true,
    componentProps: {
      options: [],
    },
  },
  {
    label: t('排序'),
    field: 'ranking',
    helpMessage: '升序',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
    },
    required: true,
  },
];
