<template>
  <PageWrapper contentFullHeight>
    <a-row :gutter="10" class="mb-2">
      <a-col :span="16">
        <a-card :bordered="false" title="周统计">
          <ColumnChart />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" title="总比例"> <PieChart /> </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false" class="operation-log-list-card">
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button preIcon="ant-design:clear-outlined" type="primary" @click="handleDelete">
            清空日志
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'msg'">
            <a @click="handleEdit(record)" :title="record.msg">
              {{ record.msg }}
            </a>
          </template>
          <template v-else-if="column.key === 'type'">
            <dict-label :options="operationTypeOptions" :value="record.type" />
          </template>
          <template v-else-if="column.key === 'status'">
            <dict-label :options="logStatusOptions" :value="record.status" />
          </template>
          <template v-else-if="column.key === 'time'"> {{ record.time }} ms </template>
        </template>
      </BasicTable>
    </a-card>
    <OperationLogModal @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { h, onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import OperationLogModal from './OperationLogModal.vue';
  import ColumnChart from './ColumnChart.vue';
  import PieChart from './PieChart.vue';
  // 接口
  import { operationLogPage, operationLogDelete } from '/@/api/system/operationLog';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    operationTypeOptions,
    logStatusOptions,
    searchForm,
    tableColumns,
  } from './operationLog.data';

  const ACard = Card;
  const ARow = Row;
  const ACol = Col;

  const { t } = useI18n();
  const { notification, createConfirm } = useMessage();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: operationLogPage,
    beforeFetch: (params) => {
      return params;
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
  });

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
  function handleDelete() {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('确认清空日志')),
      onOk: async () => {
        await operationLogDelete();
        notification.success({ message: `执行成功` });
        handleSuccess();
      },
    });
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
    const { operation_type, log_status } = await optionsListBatchApi([
      'operation_type',
      'log_status',
    ]);

    operationTypeOptions.value = operation_type || [];
    logStatusOptions.value = log_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
<style lang="less" scoped>
  .operation-log-list-card {
    :deep(.ant-card-body) {
      padding: 0;
    }

    :deep(.vben-basic-table-form-container) {
      padding: 0;
    }
  }
</style>
