<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4 xl:w-1/5">
      <div class="m-2 mr-0 p-2 overflow-hidden bg-white">
        <Select
          :options="applicationOptions"
          v-model:value="applicationId"
          @change="handleChange"
          style="width: 100%; margin-bottom: 1rem"
        />
        <BasicTree
          ref="treeRef"
          title=""
          toolbar
          search
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="handleSelect"
        />
      </div>
    </div>

    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:menu:revised'"
          type="primary"
          danger
          preIcon="ant-design:interaction-outlined"
          @click="handleRevised"
        >
          校正层级深度
        </a-button>
        <a-button
          v-auth="'system:menu:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a @click="handleEdit(record)" :title="record.title">
            <span class="flex">
              <dict-label :options="menuTypeOptions" :value="record.type" />
              <span class="ml-1"> {{ record.title }}</span>
            </span>
          </a>
        </template>

        <template v-else-if="column.key === 'defaultGrant'">
          <dict-label :options="tfOptions" :value="record.defaultGrant" />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:menu:edit',
              },
              {
                label: '复制',
                color: 'warning',
                onClick: handleCopy.bind(null, record),
                auth: 'system:menu:add',
              },
              {
                label: '新增下级',
                onClick: handleCreateChild.bind(null, record),
                auth: 'system:menu:add',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:menu:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, reactive, unref } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Select } from 'ant-design-vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  // 接口
  import { menuTree, menuDelete, menuRevised } from '/@/api/system/menu';
  import { applicationSelect } from '/@/api/system/application';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    tfOptions,
    dataItemStatusOptions,
    menuWeightOptions,
    menuTypeOptions,
    applicationOptions,
    treeData,
    searchForm,
    tableColumns,
  } from './menu.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  const applicationId = ref('');
  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: menuTree,
    beforeFetch: (params) => {
      // params.applicationId = applicationId.value;
      // params.parentId = menuId.value;
      return params;
    },
    // 立即加载
    immediate: false,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    isTreeTable: true,
    pagination: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:menu:operation',
    },
  });

  // 菜单选中
  function handleSelect(keys: string[]) {
    searchInfo.id = keys[0];
    reload();
  }

  // 应用变更
  function handleChange(value) {
    searchInfo.applicationId = value;
    searchInfo.id = '';

    getTree().setSelectedKeys([]);
    fetchTree();
    reload();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  /**
   * 新增下级
   */
  function handleCreateChild(record: Recordable) {
    openDrawer(true, {
      applicationId: record.applicationId,
      parentId: record.id,
      record,
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      // applicationId: record.applicationId,
      // parentId: record.parentId,
      record,
      isUpdate: true,
    });
  }

  /**
   * 复制
   */
  function handleCopy(record: Recordable) {
    openDrawer(true, {
      applicationId: record.applicationId,
      parentId: record.parentId,
      record,
      isUpdate: false,
    });
  }

  /**
   * 校正层级深度
   */
  async function handleRevised() {
    await menuRevised();
    notification.success({ message: `执行成功` });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await menuDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess(record);
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value =
      (await menuTree({
        applicationId: applicationId.value,
      })) || [];
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    fetchTree();
    reload();
  }

  /**
   * 获取树
   */
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  /**
   * 初始化应用
   */
  async function initApplication() {
    const data = await applicationSelect({});
    applicationId.value = data[0]?.value || '';
    applicationOptions.value = data || [];
    searchInfo.applicationId = data[0]?.value || '';
    fetchTree();
    reload();
  }

  /**
   * 初始化字典
   */
  async function initDict() {
    const { tf, menu_type, menu_weight, data_item_status } = await optionsListBatchApi([
      'tf',
      'menu_type',
      'menu_weight',
      'data_item_status',
    ]);
    tfOptions.value = tf || [];
    menuTypeOptions.value = menu_type || [];
    menuWeightOptions.value = menu_weight || [];
    dataItemStatusOptions.value = data_item_status || [];
  }

  onMounted(() => {
    initApplication();
    initDict();
  });
</script>
