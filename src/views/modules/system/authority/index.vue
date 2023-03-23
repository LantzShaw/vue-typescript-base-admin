<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:dict:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <a @click="handleEdit(record)" :title="record.url">
            <a-row type="flex">
              <a-col flex="60px">
                <dict-label :options="requestMethodOptions" :value="record.requestMethod" />
              </a-col>
              <a-col flex="auto">{{ record.url }}</a-col>
            </a-row>
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
                auth: 'system:dict:edit',
              },

              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:dict:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <AuthorityModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, computed, ref, unref, h, reactive } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  // 组件

  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  import { Row, Col } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import AuthorityModal from './AuthorityModal.vue';

  // 接口

  import { authorityPage, authorityDelete, authorityTree } from '/@/api/system/authority';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { searchForm, tableColumns, requestMethodOptions } from './authority.data';

  const { t } = useI18n();

  const ARow = Row;
  const ACol = Col;

  const searchInfo = reactive<Recordable>({});

  const { createConfirm, notification } = useMessage();
  const { hasPermission } = usePermission();

  /**
   * registerModal
   */
  const [registerModal, { openModal }] = useModal();
  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: authorityTree,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: true,
    showTableSetting: true,
    isTreeTable: true,
    pagination: false,
    showIndexColumn: true,
    actionColumn: {
      width: 90,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:application:operation',
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
    await authorityDelete(record);
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
    const { request_method } = await optionsListBatchApi(['request_method']);

    requestMethodOptions.value = request_method || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
<style lang="less" scoped></style>
