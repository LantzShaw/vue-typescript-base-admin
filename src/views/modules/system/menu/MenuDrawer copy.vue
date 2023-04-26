<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="okAuth"
    :title="getTitle"
    width="60%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #authority="{ field }">
        <BasicTable @register="registerTable" />
        <BasicTree
          ref="treeRef"
          checkable
          :treeData="treeData2"
          :checkedKeys="checkedKeys"
          :expandedKeys="expandedKeys"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, unref, computed, nextTick } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { TreeItem } from '/@/components/Tree/index';
  // 接口
  import { menuAdd, menuUpdate, menuForm, menuTreeForEdit } from '/@/api/system/menu';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { applicationSelect } from '/@/api/system/application';
  import { authorityTreeForEdit } from '/@/api/system/authority';
  import { authorityPage, authorityDelete, authorityTree } from '/@/api/system/authority';

  // data
  import {
    applicationOptions,
    tfOptions,
    menuTypeOptions,
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
  } from './menu.data';
  const { t } = useI18n();
  const okAuth = ref(['system:menu:edit']);
  const emit = defineEmits(['success', 'register']);

  const { notification } = useMessage();

  const treeData = ref<TreeItem[]>([]);
  const treeData2 = ref<TreeItem[]>([]);

  // 当前选中的项
  const checkedKeys = ref<any[]>([]);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);

  const columns: BasicColumn[] = [
    {
      title: '权限名称',
      dataIndex: 'authorityName',
      width: 130,
      align: 'left',
    },
    {
      title: '关联URL',
      dataIndex: 'url',
      width: 130,
      align: 'left',
    },
  ];

  /**
   * 构建registerTable
   */
  const [registerTable, { setLoading, getForm, reload, getSelectRowKeys, clearSelectedRowKeys }] =
    useTable({
      title: '',
      api: authorityTree,
      columns: columns,
      useSearchForm: false,
      canResize: true,
      rowSelection: {
        type: 'checkbox',
      },
      showTableSetting: true,
      isTreeTable: true,
      pagination: false,
      showIndexColumn: true,
      maxHeight: 300,
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        auth: 'system:application:operation',
      },
    });
  /**
   * 构建表单
   */
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 120,
    schemas: inputFormSchemas,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  /**
   * 构建Drawer
   */
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ loading: true, confirmLoading: true });

    const { tf, menu_type } = await optionsListBatchApi(['tf', 'menu_type']);
    tfOptions.value = tf || [];
    menuTypeOptions.value = menu_type || [];
    // 请求数据
    record.value = ((await menuForm({ id: data?.record?.id })) || {}) as Recordable;
    applicationOptions.value = (await applicationSelect({})) || [];
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
    } else {
      idRef.value = '';
    }

    // 添加下级时候，赋值applicationId、parentId
    if (data.applicationId) {
      record.value.applicationId = data.applicationId;
      const treeData = await menuTreeForEdit({ applicationId: data.applicationId });
      updateSchema([
        {
          field: 'parentId',
          componentProps: {
            treeData,
          },
        },
      ]);
    }
    const treeData22 = await authorityTreeForEdit({});
    treeData2.value = treeData22;

    if (data.parentId) {
      record.value.parentId = data.parentId;
    }

    // 请求菜单数据
    updateSchema([
      {
        field: 'applicationId',
        componentProps: {
          options: applicationOptions,

          onChange: async (e: any) => {
            const treeData = await menuTreeForEdit({ applicationId: e });

            await updateSchema([
              {
                field: 'parentId',
                componentProps: {
                  treeData,
                },
              },
            ]);

            setFieldsValue({ parentId: '0' });
          },
        },
      },
    ]);

    await updateSchema([
      {
        field: 'defaultGrant',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'keepAlive',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'affix',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'hideTab',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'hideMenu',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'hideChildrenInMenu',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'carryParam',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'ignoreRoute',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    updateSchema([
      {
        field: 'hidePathForChildren',
        componentProps: {
          options: tfOptions,
        },
      },
    ]);

    setFieldsValue({
      ...record.value,
    });

    setDrawerProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      if (getSelectRowKeys().length > 0) {
      }

      const values = await validate();
      console.log('values', values);
      console.log('checkedKeys', checkedKeys.value);
      console.log('expandedKeys', expandedKeys.value);
      console.log('getSelectRowKeys()', getSelectRowKeys());
      setDrawerProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await menuUpdate({
          ...values,
          id: idRef.value,
        });
      } else {
        // await menuAdd({ ...values });
      }

      notification.success({ message: `执行成功` });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ loading: false, confirmLoading: false });
    }
  }
  /**
   * 标题
   */
  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
</script>
