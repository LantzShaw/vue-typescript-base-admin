import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { checkId } from '/@/api/system/organization';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const organizationLevelOptions = ref<any[]>([]);
export const organizationTypeOptions = ref<any[]>([]);
export const organizationTreeOptions = ref<any[]>([]);
export const treeData = ref<any[]>([]);

const { t } = useI18n();

const isDepartment = (type: string) => type === '2';
/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('名称'),
      field: 'organizationName',
      component: 'Input',
    },
    {
      label: t('类型'),
      field: 'organizationType',
      component: 'Select',
      componentProps: {
        options: organizationTypeOptions,
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
    title: t('名称'),
    dataIndex: 'organizationName',
    width: 280,
    align: 'left',
  },
  {
    title: t('类型'),
    dataIndex: 'organizationType',
    width: 90,
  },
  {
    title: t('排序'),
    dataIndex: 'ranking',
    width: 90,
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
    label: t('机构级别'),
    field: 'organizationLevel',
    component: 'ApiRadioGroup',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'organization_level',
      },
      isBtn: true,
    },
    required: true,
  },
  {
    label: t('机构类型'),
    field: 'organizationType',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'organization_type',
      },
    },
    ifShow: ({ values }) => !isDepartment(values.organizationLevel),
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
