import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';
// 公共组件
import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

// 接口
import { optionsListApi } from '/@/api/sys/dict';
// 接口
import {
  menuAdd,
  menuUpdate,
  menuForm,
  menuTreeForEdit,
  menuOwnAuthority,
} from '/@/api/system/menu';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const tfOptions = ref<any[]>([]);
export const dataItemStatusOptions = ref<any[]>([]);
export const menuTypeOptions = ref<any[]>([]);
export const menuWeightOptions = ref<any[]>([]);
export const applicationOptions = ref<any[]>([]);
export const requestMethodOptions = ref<any[]>([]);
// export const treeData = ref<TreeItem[]>([]);
export const treeData = ref<any[]>([]);
export const treeData2 = ref<any[]>([]);

const { t } = useI18n();

const isMenu = (type: string) => type === '1';
const isButton = (type: string) => type === '2';

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('菜单名称'),
      field: 'title',
      component: 'Input',
    },
    {
      label: t('菜单类型'),
      field: 'type',
      component: 'Select',
      componentProps: {
        options: menuTypeOptions,
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
    title: t('菜单名称'),
    dataIndex: 'title',
    width: 150,
    align: 'left',
  },
  {
    title: t('路由地址'),
    dataIndex: 'path',
    width: 130,
    align: 'left',
  },
  {
    title: t('组件'),
    dataIndex: 'component',
    width: 130,
    align: 'left',
  },
  {
    title: t('权限标识'),
    dataIndex: 'permission',
    width: 90,
    align: 'left',
  },
  {
    title: t('排序'),
    dataIndex: 'ranking',
    width: 80,
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('菜单类型'),
    field: 'type',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'menu_type',
      },
      isBtn: true,
    },
    colProps: { lg: 24, md: 24 },
    dynamicDisabled: ({}) => unref(isUpdate),
  },
  {
    label: t('所属应用'),
    field: 'applicationId',
    component: 'Select',
    required: true,
  },
  {
    label: t('上级菜单'),
    field: 'parentId',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    label: t('菜单名称'),
    field: 'title',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    required: true,
  },

  {
    label: t('权限标识'),
    field: 'permission',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    required: ({ values }) => isButton(values.type),
  },

  {
    label: t('排序'),
    field: 'ranking',
    helpMessage: '升序',
    component: 'InputNumber',
    defaultValue: '30',
    componentProps: {
      maxlength: 10,
    },
    required: true,
  },

  {
    label: t('菜单图标'),
    field: 'icon',
    component: 'IconPicker',
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('备注信息'),
    field: 'remarks',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 200,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('路由信息'),
    field: 'router',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('路由名称'),
    field: 'name',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('访问路径'),
    field: 'path',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('重定向'),
    field: 'redirect',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('组件名称'),
    field: 'component',
    component: 'Input',
    componentProps: {
      maxlength: 500,
    },
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('Meta信息'),
    field: 'meta',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('内链地址'),
    field: 'frameSrc',
    helpMessage: '内嵌iframe的地址',
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    label: t('组件缓存'),
    field: 'keepAlive',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('是否固定标签'),
    field: 'affix',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('标签页隐藏'),
    field: 'hideTab',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('菜单隐藏'),
    field: 'hideMenu',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('隐藏所有子菜单'),
    field: 'hideChildrenInMenu',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('carryParam'),
    field: 'carryParam',
    helpMessage: '该路由是否会携带参数，且需要在tab页上面显示',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('realPath'),
    field: 'realPath',
    helpMessage: '动态路由的实际Path, 即去除路由的动态部分',
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },

    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    label: t('Tab页数'),
    field: 'dynamicLevel',
    helpMessage: '动态路由可打开Tab页数',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    label: t('当前活动菜单'),
    field: 'currentActiveMenu',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('忽略路由'),
    field: 'ignoreRoute',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },

  {
    label: t('忽略本级path'),
    field: 'hidePathForChildren',
    helpMessage: '是否在子级菜单的完整path中忽略本级path',
    component: 'Select',
    componentProps: {
      allowClear: true,
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    label: t('授权'),
    field: 'authorityDivider',
    component: 'Divider',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('菜单权重'),
    field: 'weight',
    helpMessage: '超级管理员无法访问业务权重菜单',
    component: 'ApiRadioGroup',
    defaultValue: '1',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'menu_weight',
      },
      isBtn: true,
    },
    required: true,
  },
  {
    label: t('默认授权'),
    field: 'defaultGrant',
    helpMessage: '无需授权就可访问',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {},
    required: true,
  },
  {
    field: 'authority',
    component: 'Input',
    label: '',
    disabledLabelWidth: true,
    slot: 'authority',
    colProps: { lg: 24, md: 24 },
  },
];
