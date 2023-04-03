<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4">
      <div class="m-4 mr-0 p-2 overflow-hidden bg-white">
        <BasicTree
          ref="treeRef"
          toolbar
          search
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="handleSelect"
        />
      </div>
    </div>

    <BasicTable @register="registerTable" class="w-3/4" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:organization:revised'"
          type="primary"
          danger
          preIcon="ant-design:interaction-outlined"
          @click="handleRevised"
        >
          校正层级深度
        </a-button>
        <a-button
          v-auth="'system:organization:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'organizationName'">
          <a @click="handleEdit(record)" :title="record.organizationName">
            <span class="flex">
              <dict-label :options="organizationLevelOptions" :value="record.organizationLevel" />
              <span class="ml-1"> {{ record.organizationName }}</span>
            </span>
          </a>
        </template>

        <template v-if="column.key === 'organizationType'">
          <dict-label :options="organizationTypeOptions" :value="record.organizationType" />
        </template>

        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:organization:edit',
              },
              {
                label: '新增下级',
                onClick: handleCreateChild.bind(null, record),
                auth: 'system:organization:add',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:organization:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <OrganizationModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, reactive, unref } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import OrganizationModal from './OrganizationModal.vue';
  // 接口
  import {
    organizationTree,
    organizationUnitTree,
    organizationDelete,
    organizationRevised,
  } from '/@/api/system/organization';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    organizationLevelOptions,
    organizationTypeOptions,
    treeData,
    searchForm,
    tableColumns,
  } from './organization.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  /**
   * 构建registerDrawer
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: organizationTree,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    isTreeTable: true,
    pagination: false,
    actionColumn: {
      width: 130,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
      auth: 'system:organization:operation',
    },
  });

  // 菜单选中
  function handleSelect(keys: string[]) {
    searchInfo.id = keys[0];
    reload();
  }

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 新增下级
   */
  function handleCreateChild(record: Recordable) {
    openModal(true, {
      parentId: record.id,
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      // parentId: record.parentId,
      record,
      isUpdate: true,
    });
  }

  /**
   * 校正层级深度
   */
  async function handleRevised() {
    await organizationRevised();
    notification.success({ message: `执行成功` });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await organizationDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await organizationUnitTree({})) || [];
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
   * 初始化字典
   */
  async function initDict() {
    const { organization_type, organization_level } = await optionsListBatchApi([
      'organization_type',
      'organization_level',
    ]);
    organizationTypeOptions.value = organization_type || [];
    organizationLevelOptions.value = organization_level || [];
  }

  onMounted(() => {
    fetchTree();
    initDict();
  });
</script>
