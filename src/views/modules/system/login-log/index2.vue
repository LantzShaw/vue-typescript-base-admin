<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          v-auth="'log:loginLog:delete'"
          preIcon="ant-design:clear-outlined"
          type="primary"
          @click="handleDelete"
        >
          清空日志
        </a-button>
      </template>
      <template #firstColumn="{ record }">
        <a @click="handleEdit(record)" :title="record.traceId">
          {{ record.traceId }}
        </a>
      </template>
      <template #eventType="{ record }">
        <dict-label :options="loginEventTypeOptions" :value="record.eventType" />
      </template>
      <template #status="{ record }">
        <dict-label :options="logStatusOptions" :value="record.status" />
      </template>
    </BasicTable>
    <LoginLogModal @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { h, onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import LoginLogModal from './LoginLogModal.vue';
  // 接口
  import { loginLogPage, loginLogDelete } from '/@/api/system/loginLog';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    loginEventTypeOptions,
    logStatusOptions,
    searchForm,
    tableColumns,
  } from './loginLog.data';

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
    api: loginLogPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: true,
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
        await loginLogDelete();
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
    const { login_event_type, log_status } = await optionsListBatchApi([
      'login_event_type',
      'log_status',
    ]);

    loginEventTypeOptions.value = login_event_type || [];
    logStatusOptions.value = log_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
