import { ref, unref, h } from 'vue';

// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { Input } from 'ant-design-vue';
// 接口
import { orgTree } from '/@/api/system/org';
import { optionsListApi } from '/@/api/sys/dict';
import { checkRoleCode } from '/@/api/system/role';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const requestMethodOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);
export const dataScopeTypeOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);

const { t } = useI18n();

// 自定义数据权限
const isCustom = (type: string) => type === '5';

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('角色名称'),
      field: 'roleName',
      component: 'Input',
    },
    {
      label: t('角色标识'),
      field: 'roleCode',
      component: 'Input',
    },
    {
      label: t('状态'),
      field: 'status',
      component: 'Select',
      componentProps: {
        options: dataItemStatusOptions,
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
    title: t('角色名称'),
    dataIndex: 'roleName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('角色标识'),
    dataIndex: 'roleCode',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    sorter: true,
    width: 90,
    align: 'center',
  },
  {
    title: t('创建时间'),
    dataIndex: 'createTime',
    sorter: true,
    width: 100,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('角色名称'),
    field: 'roleName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('角色标识'),
    field: 'roleCode',
    component: 'Input',
    helpMessage: ['角色标识必须以ROLE_开头'],
    componentProps: {
      maxlength: 100,
    },
    rules: [
      {
        required: true,
        validator: async (_rule, value) => {
          if (!/^(ROLE_)[a-zA-Z0-9]*/.test(value)) {
            return Promise.reject('必须以ROLE_开头并且只能包含字母和数字');
          }
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkRoleCode(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('角色标识已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
        trigger: 'blur',
      },
    ],
  },
  {
    label: t('状态'),
    field: 'status',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'data_item_status',
        excludeItems: ['2', '3'],
      },
    },
  },
  {
    label: t('备注'),
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入备注',
      maxlength: 255,
      rows: 4,
      allowClear: true,
      showCount: true,
    },
    colProps: { lg: 24, md: 24 },
  },
];
