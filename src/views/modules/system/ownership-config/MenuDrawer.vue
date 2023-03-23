<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="'system:menu:edit'"
    :title="getTitle"
    width="75%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #authority>
        <div class="scroll-wrap">
          <ScrollContainer ref="scrollRef">
            <BasicTree ref="treeRef" checkable :treeData="authorityTreeData">
              <template #title="item">
                {{ item.title }}

                <dict-label :options="requestMethodOptions" :value="item.requestMethod" />
                {{ item.url }}
              </template>
            </BasicTree>
          </ScrollContainer>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  export default defineComponent({
    name: 'ViewsSysMenuForm',
  });
</script>
<script lang="ts" setup>
  import { defineComponent, ref, unref, computed, nextTick } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件

  import { ScrollContainer } from '/@/components/Container/index';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { TreeItem } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  // 接口
  import {
    menuAdd,
    menuUpdate,
    menuForm,
    menuTreeForEdit,
    menuOwnAuthority,
  } from '/@/api/system/menu';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { applicationSelect } from '/@/api/system/application';
  import { authorityTree } from '/@/api/system/authority';

  // data
  import {
    requestMethodOptions,
    applicationOptions,
    tfOptions,
    menuTypeOptions,
    isUpdate,
    idRef,
    record,
    inputFormSchemas,
  } from './menu.data';
  const { t } = useI18n();

  const emit = defineEmits(['success', 'register']);

  const { createMessage, notification } = useMessage();

  const authorityTreeData = ref<TreeItem[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

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
    authorityTreeData.value = (await authorityTree({})) || [];
    const { tf, menu_type, request_method } = await optionsListBatchApi([
      'tf',
      'menu_type',
      'request_method',
    ]);
    tfOptions.value = tf || [];
    menuTypeOptions.value = menu_type || [];
    requestMethodOptions.value = request_method || [];
    // 请求数据
    applicationOptions.value = (await applicationSelect({})) || [];
    record.value = ((await menuForm({ id: data?.record?.id })) || {}) as Recordable;
    // 判断是否是更新
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idRef.value = data.record.id;
      const authorityIds = (await menuOwnAuthority({ id: data?.record?.id })) || [];
      getTree().setCheckedKeys(authorityIds);
    } else {
      idRef.value = '';
      getTree().setCheckedKeys([]);
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
            // 如果applicationId没变
            if (record.value.applicationId == e) {
            } else {
              setFieldsValue({ parentId: '0' });
            }
          },
        },
      },
      {
        field: 'defaultGrant',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'keepAlive',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'affix',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'hideTab',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'hideMenu',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'hideChildrenInMenu',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'carryParam',
        componentProps: {
          options: tfOptions,
        },
      },
      {
        field: 'ignoreRoute',
        componentProps: {
          options: tfOptions,
        },
      },
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

    getTree().expandAll(false);
    setDrawerProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      const keys = getTree().getCheckedKeys();
      setDrawerProps({ loading: true, confirmLoading: true });
      if (unref(isUpdate)) {
        await menuUpdate({
          ...values,
          id: idRef.value,
          authorityIds: keys,
        });
      } else {
        await menuAdd({ ...values, authorityIds: keys });
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
<style lang="less" scoped>
  .scroll-wrap {
    height: 300px;
    background-color: @component-background;

    :deep(.scrollbar__wrap) {
      padding-top: 5px !important;
    }
  }
</style>
