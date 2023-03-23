<template>
  <PageWrapper :title="`定时任务的基本信息`" contentFullHeight dense @back="goBack">
    <template #headerContent>
      <a-descriptions :column="2">
        <a-descriptions-item label="任务名称"> {{ record.jobName }} </a-descriptions-item>
        <a-descriptions-item label="任务类名"> {{ record.beanName }} </a-descriptions-item>
        <a-descriptions-item label="Cron表达式"> {{ record.cronExpression }} </a-descriptions-item>
        <a-descriptions-item label="参数"> {{ record.params }} </a-descriptions-item>
      </a-descriptions>
    </template>
    <BasicTable @register="registerTable">
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
        <template v-if="column.key === 'jobName'">
          <a @click="handleEdit(record)" :title="record.jobName">
            {{ record.jobName }}
          </a>
        </template>

        <template v-else-if="column.key === 'success'">
          <dict-label :options="quartzLogStateOptions" :value="record.success" />
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

    <QuartzModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, unref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { usePermission } from '/@/hooks/web/usePermission';

  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  import QuartzModal from './QuartzModal.vue';

  // 接口
  import { quartzForm } from '/@/api/system/quartz';
  import { quartzLogPage, quartzLogDelete } from '/@/api/system/quartzLog';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { quartzLogStateOptions, searchForm, tableColumns, record } from './quartzLog.data';
  const ADescriptions = Descriptions;
  const ADescriptionsItem = Descriptions.Item;
  const go = useGo();
  const { closeCurrent } = useTabs();
  const { t } = useI18n();
  const { notification } = useMessage();
  const { hasPermission } = usePermission();
  const { currentRoute } = useRouter();
  const route = useRoute();

  // 通过路由获取字典code
  const jobId = unref(currentRoute).params?.jobId ?? '';

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: quartzLogPage,
    beforeFetch: (params) => {
      params.jobId = jobId || '';
      return params;
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      auth: 'system:dict:operation',
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
    await quartzLogDelete(record);
    notification.success({ message: `执行成功` });
    handleSuccess();
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/item/');
    go(paths[0]);
    closeCurrent();
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { quartz_log_state } = await optionsListBatchApi(['quartz_log_state']);
    quartzLogStateOptions.value = quartz_log_state || [];
  }

  async function initRecord() {
    record.value = ((await quartzForm({ id: jobId })) || {}) as Recordable;
  }

  onMounted(() => {
    initDict();
    initRecord();
  });
</script>
