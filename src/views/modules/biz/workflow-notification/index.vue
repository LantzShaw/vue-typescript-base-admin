<template>
  <PageWrapper dense contentFullHeight>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar> </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <!-- <template v-if="column.key === 'noticeTitle'">
          <a @click="handleEdit(record)" :title="record.noticeTitle">
            {{ record.noticeTitle }}
          </a>
        </template> -->

        <template v-if="column.key === 'workflowCurrentStep'">
          {{
            record?.workflowType === '2'
              ? record?.dmrProcessStepDisplayName
              : record?.adrProcessStepDisplayName
          }}
        </template>

        <template v-else-if="column.key === 'readFlag'">
          <dict-label :options="tfOptions" :value="record.readFlag" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '查看',
                onClick: navigateToReport.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <WorkflowNotificationModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import WorkflowNotificationModal from './WorkflowNotificationModal.vue';
  // 接口
  import {
    workflowNotificationPage,
    workflowNotificationDelete,
  } from '/@/api/biz/workflowNotification';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    tfOptions,
    dataItemStatusOptions,
    searchForm,
    tableColumns,
  } from './workflowNotification.data';

  const go = useGo();
  const { currentRoute } = useRouter();

  const { notification } = useMessage();

  /**
   * 构建registerModal
   */
  // 编辑
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '',
    api: workflowNotificationPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: true,
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

  /**
   * 跳转至关联设备
   */
  function navigateToReport(record: Recordable) {
    if (record.workflowType === '1') {
      go(`/biz/alarm-management/record/report/${record.recordId}`);
    } else if (record.workflowType === '2') {
      go(`/biz/maint-management/record/report/${record.recordId}`);
    }
  }

  /**
   * 导出
   */
  function handleExport() {
    jsonToSheetXlsx({
      data: getDataSource(),
      // header: getColumns().map((column) => column.title),
      filename: `设备维护计划列表_${new Date().getTime()}.xls`,
    });
  }

  /**
   * 导入
   */
  function handleImport() {}

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
    await workflowNotificationDelete({ id: record.id });
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
    const { tf } = await optionsListBatchApi(['tf']);

    tfOptions.value = tf || [];
  }

  onMounted(() => {
    initDict();
  });
</script>

<style lang="less" scoped></style>
