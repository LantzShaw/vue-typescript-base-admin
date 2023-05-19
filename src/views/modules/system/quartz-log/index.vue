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
          v-auth="'system:quartz-log:delete'"
          preIcon="ant-design:clear-outlined"
          type="primary"
          @click="handleDelete"
        >
          清空日志
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'jobName'">
          {{ record.jobName }}
        </template>
        <template v-else-if="column.key === 'success'">
          <dict-label :options="quartzLogStateOptions" :value="record.success" />
        </template>
        <!-- 表格按钮 -->
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { h, onMounted, unref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  // 组件
  import { Descriptions } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

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
  const { notification, createConfirm } = useMessage();

  const { currentRoute } = useRouter();
  const route = useRoute();

  // 通过路由获取ID
  const jobId = unref(currentRoute).params?.jobId ?? '';

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
  });

  /**
   * 删除
   */
  async function handleDelete() {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('确认清空日志')),
      onOk: async () => {
        await quartzLogDelete({ jobId: jobId });
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

  function goBack() {
    const path = unref(currentRoute).path;
    var paths = path.split('/item/');
    closeCurrent();
    go(paths[0]);
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
