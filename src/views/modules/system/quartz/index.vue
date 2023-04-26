<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          v-auth="'system:quartz:add'"
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
        >
          新增
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'jobName'">
          <a @click="handleEdit(record)" :title="record.jobName">
            {{ record.jobName }}
          </a>
        </template>

        <template v-else-if="column.key === 'state'">
          <dict-label :options="quartzJobCodeOptions" :value="record.state" />
        </template>
        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '启动',
                onClick: handlerResume.bind(null, record),
                auth: 'system:quartz:start',
                ifShow: () => record.state === '0',
              },
              {
                label: '停止',
                onClick: handlerPause.bind(null, record),
                auth: 'system:quartz:stop',
                ifShow: () => record.state === '1',
              },
              {
                label: '立即执行',
                auth: 'system:quartz:execute',
                popConfirm: {
                  title: '是否立即执行任务',
                  confirm: handlerExecute.bind(null, record),
                },
              },
              {
                label: '日志',
                onClick: handleLog.bind(null, record),
                auth: 'system:quartz:log',
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
                auth: 'system:quartz:edit',
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDelete.bind(null, record),
                },
                auth: 'system:quartz:delete',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <QuartzModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, unref } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';
  // 组件
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import QuartzModal from './QuartzModal.vue';

  // 接口
  import {
    quartzPage,
    quartzDelete,
    quartzExecute,
    quartzResume,
    quartzPause,
  } from '/@/api/system/quartz';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { quartzJobCodeOptions, searchForm, tableColumns } from './quartz.data';

  const { t } = useI18n();
  const { notification } = useMessage();
  const { hasPermission } = usePermission();
  const go = useGo();
  const { currentRoute } = useRouter();
  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: quartzPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:quartz:operation',
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
   * 启动
   */
  async function handlerResume(record: Recordable) {
    await quartzResume(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  async function handlerPause(record: Recordable) {
    await quartzPause(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  async function handlerExecute(record: Recordable) {
    await quartzExecute(record);
    notification.success({ message: `执行成功` });
  }
  /**
   * 删除
   */
  async function handleDelete(record: Recordable) {
    await quartzDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  function handleLog(record: Recordable) {
    const path = unref(currentRoute).path;
    go(`${path}/log/${record.id}`);
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
    const { quartz_job_code } = await optionsListBatchApi(['quartz_job_code']);
    quartzJobCodeOptions.value = quartz_job_code || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
