<template>
  <PageWrapper dense title="" contentFullHeight :contentBackground="false" @back="goBack">
    <div class="m-2">
      <div class="bg-light-50 pt-4 pr-8 text-right">
        <a-button preIcon="ant-design:swap-left-outlined" @click="goBack"> 返回 </a-button>
      </div>
      <div class="h-20 leading-20 text-center font-bold text-xl bg-light-100">
        {{ pageTitle }}
      </div>
      <BasicTable @register="registerTable">
        <!-- 按钮工具栏 -->
        <template #toolbar>
          <a-button
            v-auth="'manage:sensor:export'"
            preIcon="ant-design:download-outlined"
            @click="handleFeedbackReportPreview"
          >
            导出工作记录表单
          </a-button>
          <a-button
            v-auth="'manage:sensor:export'"
            preIcon="ant-design:eye-outlined"
            @click="handleFeedbackReportPreview"
          >
            工作反馈报告
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'sensorName'">
            <a @click="handleEdit(record)" :title="record.sensorName">
              {{ record.sensorName }}
            </a>
          </template>
          <template v-else-if="column.key === 'dtuipSensorTypeId'">
            <dict-label :options="sensorTypeOptions" :value="record.dtuipSensorTypeId" />
          </template>
          <template v-else-if="column.key === 'dtuipIsAlarms'">
            <dict-label :options="alarmStatusOptions" :value="record.dtuipIsAlarms" />
          </template>
          <template v-else-if="column.key === 'dtuipIsDelete'">
            <dict-label :options="deleteStatusOptions" :value="record.dtuipIsDelete" />
          </template>
          <template v-else-if="column.key === 'dtuipIsLine'">
            <dict-label :options="onlineStatusOptions" :value="record.dtuipIsLine" />
          </template>
          <template v-else-if="column.key === 'dtuipValue'">
            {{ record.dtuipValue + record.dtuipUnit }}
          </template>
          <template v-else-if="column.key === 'organizationId'">
            <span
              v-if="record.bizEnterprise?.enterpriseNo"
              style="text-overflow: ellipsis"
              :title="`[${record.bizEnterprise?.enterpriseNo}]${record.bizEnterprise?.enterpriseName}`"
            >
              [{{ record.bizEnterprise?.enterpriseNo }}] {{ record.bizEnterprise?.enterpriseName }}
            </span>
          </template>
          <template v-else-if="column.key === 'regionId'">
            {{ record?.bizInstallRegion?.regionName }}
          </template>

          <!-- 表格按钮 -->
          <template v-else-if="column.key === 'action'">
            <TableAction
              stopButtonPropagation
              :actions="[
                {
                  label: '编辑',
                  onClick: handleEdit.bind(null, record),
                  auth: 'manage:sensor:edit',
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>

    <FeedbackReportModal @register="registerFeedbackReportModal" @success="handleSuccess" />
    <!-- <SensorModal @register="registerModal" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useModal } from '/@/components/Modal';
  // import SensorModal from './SensorModal.vue';

  import FeedbackReportModal from './FeedbackReportModal.vue';

  // 接口
  import { sensorExport } from '/@/api/biz/sensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { workflowDeviceMaintSensorPage } from '/@/api/biz/workflowDeviceMaintSensor';

  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    searchForm,
    tableColumns,
  } from './workflowDeviceMaintRecordReport.data';
  import { downloadByData } from '/@/utils/file/download';

  const go = useGo();
  const { closeCurrent } = useTabs();

  const { currentRoute } = useRouter();

  const isExportLoading = ref<boolean>(false);
  const recordId = ref<string>(unref(currentRoute).params?.id as string);

  const pageTitle = ref<string>(`${unref(currentRoute)?.query.enterpriseName}工作记录表单`);

  /**
   * 构建registerModal
   */
  const [registerFeedbackReportModal, { openModal: openFeedbackReportModal }] = useModal();

  /**
   * 构建registerModal
   */
  const [registerModal, { openModal }] = useModal();

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: workflowDeviceMaintSensorPage,
    beforeFetch: (params) => {
      params.recordId = recordId.value;
      return params;
    },
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: false,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: true,
    actionColumn: {
      ifShow: true,
      width: 140,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    sensorExport({})
      .then((response) => {
        downloadByData(response, `事件触发_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
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
   * 工作反馈报告 - 预览
   */
  function handleFeedbackReportPreview() {
    openFeedbackReportModal(true, {});
  }

  /**
   * 执行成功
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/maint-management/record');
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
  }

  onMounted(() => {
    initDict();
  });
</script>

<style lang="less" scoped>
  // .dict-label {
  //   :deep(.ant-tag) {
  //     margin: 4px;
  //   }
  // }
</style>
