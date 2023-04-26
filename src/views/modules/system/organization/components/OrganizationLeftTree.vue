<template>
  <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
    <!--操作-->
    <div style="margin-bottom: 8px">
      <a-button
        type="default"
        preIcon="ant-design:plus-outlined"
        class="mr-2"
        @click="handleCreate"
      >
        新增
      </a-button>

      <a-button
        type="default"
        preIcon="ant-design:plus-outlined"
        class="mr-2"
        @click="handleCreateChild()"
      >
        添加下级
      </a-button>

      <a-button
        v-auth="'system:org:revised'"
        type="primary"
        danger
        preIcon="ant-design:interaction-outlined"
        class="mr-2"
        @click="handleRevised"
      >
        校正层级深度
      </a-button>

      <template v-if="checkedKeys.length > 0">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="handleDelete">
                <Icon icon="ant-design:delete-outlined" />
                <span>删除</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            <span>批量操作 </span>
            <Icon icon="akar-icons:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
    </div>
    <!--alert-->
    <a-alert type="info" show-icon style="margin-bottom: 8px">
      <template #message>
        <template v-if="checkedKeys.length > 0">
          <span>已选中 {{ checkedKeys.length }} 条记录</span>
          <a-divider type="vertical" />
          <a @click="checkedKeys = []">清空</a>
        </template>
        <template v-else>
          <span>未选中任何数据</span>
        </template>
      </template>
    </a-alert>
    <!--树-->
    <a-spin :spinning="loading">
      <a-input-search
        placeholder="按机构名称搜索…"
        style="margin-bottom: 10px"
        @search="onSearch"
      />
      <!--组织机构树-->
      <template v-if="treeData.length > 0">
        <a-tree
          v-if="!treeReloading"
          checkable
          :clickRowToExpand="false"
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          :checkStrictly="true"
          :load-data="loadChildrenTreeData"
          :checkedKeys="checkedKeys"
          v-model:expandedKeys="expandedKeys"
          @check="onCheck"
          @select="onSelect"
        />
      </template>
      <a-empty v-else description="暂无数据" />
    </a-spin>
    <!--弹窗-->
    <OrganizationModal @register="registerModal" @success="loadRootTreeData" />
  </div>
</template>

<script lang="ts" setup>
  import { inject, nextTick, ref, unref, defineExpose } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Dropdown, Menu, Divider, Alert, Tree, Spin, Empty } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  const ADropdown = Dropdown;
  const AMenu = Menu;
  const AMenuItem = Menu.Item;
  const ADivider = Divider;
  const AAlert = Alert;
  const ATree = Tree;
  const AEmpty = Empty;
  const ASpin = Spin;

  import { useModal } from '/@/components/Modal';
  import OrganizationModal from './OrganizationModal.vue';
  import { orgTreeSync, orgSearch, orgDelete, orgRevised } from '/@/api/system/org';

  const { t } = useI18n();
  const { createMessage, notification } = useMessage();

  const emit = defineEmits(['select', 'root-tree-data']);

  const loading = ref<boolean>(false);
  // 部门树列表数据
  const treeData = ref<any[]>([]);
  // 当前选中的项
  const checkedKeys = ref<any[]>([]);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);
  // 当前选中的项
  const selectedKeys = ref<any[]>([]);
  // 树组件重新加载
  const treeReloading = ref<boolean>(false);
  // 当前选中的组织机构
  const currentOrganization = ref<any>(null);
  // 搜索关键字
  const searchKeyword = ref('');

  const [registerModal, { openModal }] = useModal();

  // 加载顶级部门信息
  async function loadRootTreeData() {
    try {
      loading.value = true;
      treeData.value = [];
      checkedKeys.value = [];
      expandedKeys.value = [];
      const result = await orgTreeSync();
      if (Array.isArray(result)) {
        treeData.value = result;
      }
      // 当前展开的项为0
      if (expandedKeys.value.length === 0) {
        autoExpandParentNode();
      } else {
        if (selectedKeys.value.length === 0) {
          let item = treeData.value[0];
          if (item) {
            // 默认选中第一个
            setSelectedKey(item.id, item);
          }
        } else {
          emit('select', currentOrganization.value);
        }
      }
      // 触发数据回传
      emit('root-tree-data', treeData.value);
    } finally {
      loading.value = false;
    }
  }

  loadRootTreeData();

  // 加载子级部门信息
  async function loadChildrenTreeData(treeNode) {
    try {
      const result = await orgTreeSync({
        parentId: treeNode.dataRef.id,
      });

      if (result.length == 0) {
        treeNode.dataRef.isLeaf = true;
      } else {
        treeNode.dataRef.children = result;
        if (expandedKeys.value.length > 0) {
          // 判断获取的子级是否有当前展开的项
          let subKeys: any[] = [];
          for (let key of expandedKeys.value) {
            if (result.findIndex((item) => item.id === key) !== -1) {
              subKeys.push(key);
            }
          }
          if (subKeys.length > 0) {
            expandedKeys.value = [...expandedKeys.value];
          }
        }
      }
      treeData.value = [...treeData.value];
      emit('root-tree-data', treeData.value);
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  // 自动展开父节点，只展开一级
  function autoExpandParentNode() {
    let item = treeData.value[0];
    if (item) {
      // 不是叶子
      if (!item.isLeaf) {
        expandedKeys.value = [item.key];
      }
      // 默认选中第一个
      setSelectedKey(item.id, item);
      reloadTree();
    } else {
      emit('select', null);
    }
  }

  // 重新加载树组件，防止无法默认展开数据
  async function reloadTree() {
    await nextTick();
    treeReloading.value = true;
    await nextTick();
    treeReloading.value = false;
  }
  /**
   * 设置当前选中的行
   */
  function setSelectedKey(key: string, data?: object) {
    // alert('setSelectedKey');
    console.log(key, data);
    selectedKeys.value = [key];
    if (data) {
      // alert('setSelectedKey');
      currentOrganization.value = data;
      emit('select', data);
    }
  }
  // 搜索事件
  async function onSearch(value: string) {
    if (value) {
      try {
        loading.value = true;
        treeData.value = [];
        checkedKeys.value = [];
        let result = await orgSearch({ keyWord: value });
        if (Array.isArray(result)) {
          treeData.value = result;
        }
        autoExpandParentNode();
      } finally {
        loading.value = false;
      }
    } else {
      loadRootTreeData();
    }
    searchKeyword.value = value;
  }

  // 树复选框选择事件
  function onCheck(e) {
    if (Array.isArray(e)) {
      checkedKeys.value = e;
    } else {
      checkedKeys.value = e.checked;
    }
  }

  // 树选择事件
  function onSelect(selKeys, event) {
    console.log('selKeys', selKeys);
    console.log('event', event);
    // alert('onSelect');
    if (selKeys.length > 0 && selectedKeys.value[0] !== selKeys[0]) {
      // alert('1');
      setSelectedKey(selKeys[0], event.selectedNodes[0]);
    } else {
      // alert('2');
      // 这样可以防止用户取消选择
      setSelectedKey(selectedKeys.value[0]);
    }
  }
  /**
   * 新增根目录
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 添加下级
   */
  function handleCreateChild(data = currentOrganization.value) {
    if (data == null) {
      createMessage.warning('请先选择一个组织机构');
      return;
    }

    openModal(true, {
      parentId: data.id,
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete() {
    if (checkedKeys.value.length <= 0) {
      createMessage.warning('请选择要操作的数据');
    }
    try {
      const idList = unref(checkedKeys);
      if (idList.length > 0) {
        try {
          loading.value = true;
          await orgDelete({ ids: idList });
          checkedKeys.value = [];
          notification.success({ message: `执行成功` });
          await loadRootTreeData();
        } finally {
          loading.value = false;
        }
      }
    } finally {
    }
  }
  /**
   * 校正层级深度
   */
  async function handleRevised() {
    await orgRevised();
    notification.success({ message: `执行成功` });
    await loadRootTreeData();
  }

  function handleSuccess() {}

  defineExpose({
    loadRootTreeData,
  });
</script>
