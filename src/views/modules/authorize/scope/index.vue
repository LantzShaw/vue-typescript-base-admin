<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="'authorize:scope:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'scopeCode'">
          <a @click="handleEdit(record)" :title="record.scopeCode">
            {{ record.scopeCode }}
          </a>
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '配置权限',
                onClick: handleAuthorize.bind(null, record),
                auth: 'authorize:scope:authorize',
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'authorize:scope:edit',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'authorize:scope:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ScopeDrawer @register="registerDrawer" @success="handleSuccess" />
    <ScopeAuthorityModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import ScopeDrawer from './ScopeDrawer.vue';

  import { useModal } from '/@/components/Modal';
  import ScopeAuthorityModal from './ScopeAuthorityModal.vue';
  // 接口
  import { scopePage, scopeDelete } from '/@/api/authorize/scope';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dataItemStatusOptions, tfOptions, searchForm, tableColumns } from './scope.data';

  const { t } = useI18n();
  const { notification } = useMessage();

  /**
   * 构建registerDrawer
   */
  const [registerDrawer, { openDrawer }] = useDrawer();
  /**
   * registerModal
   */
  const [registerModal, { openModal }] = useModal();
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: scopePage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'authorize:scope:operation',
    },
  });

  /**
   * 配置权限
   */
  function handleAuthorize(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: false,
    });
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
   * 编辑
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await scopeDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
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
  async function initDict() {
    const { data_item_status, tf } = await optionsListBatchApi(['data_item_status', 'tf']);
    dataItemStatusOptions.value = data_item_status || [];
    tfOptions.value = tf || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
