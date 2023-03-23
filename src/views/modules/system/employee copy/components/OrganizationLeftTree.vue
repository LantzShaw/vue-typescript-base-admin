<template>
  <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
    <!--操作-->
    <div style="margin-bottom: 8px"> <a-checkbox @change="onChange">本级及子集</a-checkbox> </div>

    <!--树-->
    <a-spin :spinning="loading">
      <template v-if="treeData.length > 0">
        <BasicTree
          v-if="!treeReloading"
          title="组织机构"
          toolbar
          search
          showLine
          :checkStrictly="true"
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="onSelect"
        />
      </template>
      <a-empty v-else description="暂无数据" />
    </a-spin>
    <!--弹窗-->
  </div>
</template>

<script lang="ts" setup>
  import { watch, inject, nextTick, ref, unref, onMounted, defineExpose } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Checkbox, Dropdown, Menu, Divider, Alert, Tree, Spin, Empty } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  const ADropdown = Dropdown;
  const AMenu = Menu;
  const AMenuItem = Menu.Item;
  const ADivider = Divider;
  const AAlert = Alert;
  const ATree = Tree;
  const AEmpty = Empty;
  const ASpin = Spin;
  const ACheckbox = Checkbox;

  import { orgTree, orgTreeSync, orgSearch, orgDelete, orgRevised } from '/@/api/system/org';

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();
  const treeRef = ref<Nullable<TreeActionType>>(null);

  const emit = defineEmits(['select', 'on-change']);

  const loading = ref<boolean>(false);
  // 部门树列表数据
  const treeData = ref<TreeItem[]>([]);

  // 树组件重新加载
  const treeReloading = ref<boolean>(false);

  // 树选择事件
  function onSelect(selKeys) {
    emit('select', selKeys[0]);
  }

  function onChange(e) {
    emit('on-change', e.target.checked);
  }
  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await orgTree({})) as unknown as TreeItem[];
  }

  onMounted(() => {
    // data 变化，重填表单
    fetchTree();
    // 更新 父部门 选项
  });
</script>
