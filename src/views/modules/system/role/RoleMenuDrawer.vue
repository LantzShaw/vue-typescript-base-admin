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
    <CollapseContainer
      v-for="item in applicationMenus"
      :key="item.sysApplication.id"
      :title="item.sysApplication.applicationName"
      class="my-4 application-container"
    >
      <BasicTree
        checkable
        search
        toolbar
        :checkStrictly="true"
        :treeData="item.sysMenuTreeNodeVoList"
        :checkedKeys="item.grantMenuIdList"
        :expandedKeys="item.grantMenuIdList"
        :ref="setTreeRefs(item.sysApplication.id)"
      />
    </CollapseContainer>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  // 组件
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { CollapseContainer } from '/@/components/Container';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  // 接口
  import { roleGrantMenu, roleOwnMenu } from '/@/api/system/role';
  // data
  import { idRef } from './role.data';
  import { isArray } from '/@/utils/is';

  const emit = defineEmits(['success', 'register']);

  const treeRefs: Recordable<TreeActionType> = {};

  const setTreeRefs = (key: string) => (el: any) => {
    if (el) treeRefs[key] = el;
  };

  const applicationMenus = ref<Array<Recordable>>([]);
  const roleName = ref<String>('');

  /**
   * 构建表单
   */

  /**
   * 构建Drawer
   */
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: true, confirmLoading: true });

    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告

    // 请求数据
    applicationMenus.value = (await roleOwnMenu({ roleId: data.record.id })) || [];
    roleName.value = data.record.roleName;
    idRef.value = data.record.id;

    setDrawerProps({ loading: false, confirmLoading: false });
  });

  function getGrantMenuIdList() {
    const keys = Object.keys(treeRefs);
    let ids: Array<any> = [];
    for (const key of keys) {
      const ks = treeRefs[key].getCheckedKeys();
      if (isArray(ks)) {
        for (const k of ks as Array<any>) {
          ids.push(k);
        }
      } else {
        for (const k of ks.checked as Array<any>) {
          ids.push(k);
        }
      }
    }
    return ids;
  }
  /**
   * 提交表单
   */
  async function handleSubmit() {
    try {
      setDrawerProps({ loading: true, confirmLoading: true });
      let grantMenuIdList = getGrantMenuIdList();
      await roleGrantMenu({ id: idRef.value, menuIds: grantMenuIdList });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ loading: false, confirmLoading: false });
    }
  }

  /**
   * 标题
   */
  const getTitle = computed(() => `授权菜单[${roleName.value}]`);
</script>
<style lang="less">
  .application-container {
    border: 1px solid #d9d9d9;
  }
</style>
