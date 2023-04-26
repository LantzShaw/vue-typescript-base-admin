<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4">
      <div class="m-2 mr-0 p-2 overflow-hidden bg-white">
        <BasicTree
          ref="treeRef"
          title="企业列表"
          toolbar
          search
          treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
          :clickRowToExpand="false"
          :treeData="treeData"
          @select="handleSelect"
        />
      </div>
    </div>

    <BasicTable @register="registerTable" class="w-3/4" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'regionName'">
          <a @click="handleEdit(record)" :title="record.regionName">
            {{ record.regionName }}
          </a>
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <InstallRegionModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, computed, onMounted, ref, reactive, unref } from 'vue';

  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import InstallRegionModal from './InstallRegionModal.vue';
  // 接口
  import { enterpriseTree } from '/@/api/manage/enterprise';
  import {
    installRegionPage,
    installRegionDelete,
    installRegionSync,
  } from '/@/api/manage/installRegion';
  // data
  import { treeData, searchForm, tableColumns } from './installRegion.data';

  const { notification } = useMessage();

  const organizationId = ref('');

  const searchInfo = reactive<Recordable>({});
  const treeRef = ref<Nullable<TreeActionType>>(null);

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: installRegionPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  // 部门选中
  function handleSelect(keys: string[]) {
    searchInfo.organizationId = keys[0];
    organizationId.value = keys[0];
    reload();
  }

  /**
   * 新增
   */
  async function handleCreate() {
    openModal(true, {
      organizationId: organizationId.value,
      isUpdate: false,
    });
  }

  /**
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await installRegionDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 加载树
   */
  async function fetchTree() {
    treeData.value = (await enterpriseTree({})) || [];
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {}

  onMounted(() => {
    fetchTree();
    initDict();
  });
</script>

<style lang="less" scoped></style>
