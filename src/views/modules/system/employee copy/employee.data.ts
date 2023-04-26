import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { TreeItem } from '/@/components/Tree/index';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
import { orgTreeForEdit, orgTree } from '/@/api/system/org';
import { checkUsername } from '/@/api/system/user';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const dataItemStatusOptions = ref<any[]>([]);
export const dataScopeTypeOptions = ref<any[]>([]);
export const orgTypeOptions = ref<any[]>([]);

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
      label: t('机构名称'),
      field: 'name',
      component: 'Input',
    },
    {
      label: t('机构类型'),
      field: 'type',
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
    title: t('姓名'),
    dataIndex: 'realName',
    width: 120,
    align: 'left',
    slots: { customRender: 'firstColumn' },
  },
  {
    title: t('登录账号'),
    dataIndex: 'username',
    width: 120,
    align: 'left',
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    sorter: true,
    width: 90,
    align: 'center',
    slots: { customRender: 'status' },
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
    label: t('登录账号'),
    field: 'username',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    rules: [
      { required: true },
      {
        validator(_rule, value) {
          return new Promise((resolve, reject) => {
            if (!value || value === '') return resolve();
            checkUsername(idRef.value || '', value)
              .then((res) => (res ? resolve() : reject(t('登录账号已存在'))))
              .catch((err) => reject(err.message || t('验证失败')));
          });
        },
      },
    ],
    dynamicDisabled: ({}) => unref(isUpdate),
  },

  {
    label: t('姓名'),
    field: 'realName',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    required: true,
  },
  {
    label: t('密码'),
    field: 'password',
    component: 'StrengthMeter',
    required: true,
    ifShow: ({}) => !unref(isUpdate),
  },
  {
    label: t('确认密码'),
    field: 'confirmPass',
    component: 'InputPassword',
    required: true,
    ifShow: ({}) => !unref(isUpdate),
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },

  {
    label: t('邮箱'),
    field: 'email',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('手机号码'),
    field: 'mobile',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
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
      },
      isBtn: true,
    },
  },
  {
    label: t('所属部门'),
    field: 'organizationIds',
    component: 'ApiTreeSelect',
    componentProps: {
      api: orgTree,
      immediate: true,
      allowClear: true,
      multiple: true,
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
