<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:data-scope:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
        <a-button
          v-auth="'system:data-scope:add'"
          type="primary"
          preIcon="ant-design:interaction-outlined"
          @click="handleRefreshCache"
        >
          刷新缓存
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'dataName'">
          <a @click="handleEdit(record)" :title="record.dataName">
            {{ record.dataName }}
          </a>
        </template>

        <template v-else-if="column.key === 'dataScopeType'">
          <dict-label :options="dataScopeTypeOptions" :value="record.dataScopeType" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:data-scope:edit',
              },
              {
                label: '复制',
                color: 'warning',
                onClick: handleCopy.bind(null, record),
                auth: 'system:data-scope:add',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:data-scope:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <DataScopeModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, unref } from 'vue';

  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import DataScopeModal from './DataScopeModal.vue';

  // 接口
  import { dataScopePage, dataScopeDelete, dataScopeRefreshCache } from '/@/api/system/dataScope';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { dataScopeTypeOptions, searchForm, tableColumns } from './dataScope.data';

  const { t } = useI18n();
  const { notification } = useMessage();
  const { hasPermission } = usePermission();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: dataScopePage,
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
      fixed: 'right',
      auth: 'system:data-scope:operation',
    },
  });

  /**
   * 新增
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 刷新缓存
   */
  async function handleRefreshCache() {
    await dataScopeRefreshCache();
    notification.success({ message: `执行成功` });
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
   * 复制
   */
  function handleCopy(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: false,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await dataScopeDelete(record);
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
    const { data_scope_type } = await optionsListBatchApi(['data_scope_type']);
    dataScopeTypeOptions.value = data_scope_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
