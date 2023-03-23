<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :okAuth="'system:role:grant'"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicTree ref="treeRef" search toolbar checkable :treeData="authorityTreeData">
      <template #title="item">
        {{ item.title }}

        <dict-label :options="requestMethodOptions" :value="item.requestMethod" />
        {{ item.url }}
      </template>
    </BasicTree>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  // 组件
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { TreeItem } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  // 接口
  import { roleGrantAuthority, roleOwnAuthority } from '/@/api/system/role';
  import { authorityTree } from '/@/api/system/authority';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { idRef, requestMethodOptions } from './role.data';

  const emit = defineEmits(['success', 'register']);

  const authorityTreeData = ref<TreeItem[]>([]);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  const roleName = ref<String>('');

  /**
   * 构建表单
   */

  /**
   * 构建Drawer
   */
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: true, confirmLoading: true });
    authorityTreeData.value = (await authorityTree({})) || [];
    const { request_method } = await optionsListBatchApi(['request_method']);
    requestMethodOptions.value = request_method || [];
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告

    // 请求数据
    roleName.value = data.record.roleName;
    idRef.value = data.record.id;
    const authorityIds = (await roleOwnAuthority({ id: data?.record?.id })) || [];
    getTree().setCheckedKeys(authorityIds);
    getTree().expandAll(false);
    setDrawerProps({ loading: false, confirmLoading: false });
  });

  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      setDrawerProps({ loading: true, confirmLoading: true });
      const keys = getTree().getCheckedKeys();
      await roleGrantAuthority({ id: idRef.value, authorityIds: keys });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 标题
   */
  const getTitle = computed(() => `授权[${roleName.value}]`);
</script>
<style lang="less">
  .application-container {
    border: 1px solid #d9d9d9;
  }
</style>
