<template>
  <PageWrapper
    dense
    title="报警器事件触发明细表"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          :loading="isExcelExportLoading"
          v-auth="'manage:summary:export'"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出Excel
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'bizEnterprise'">
          <a-tooltip placement="top">
            <template #title>
              <span
                >[{{ record.bizDeviceSensor?.bizEnterprise?.enterpriseNo }}]
                {{ record.bizDeviceSensor?.bizEnterprise?.enterpriseName }}</span
              >
            </template>
            <span v-if="record.bizDeviceSensor?.bizEnterprise?.enterpriseNo">
              [{{ record.bizDeviceSensor?.bizEnterprise?.enterpriseNo }}]
              {{ record.bizDeviceSensor?.bizEnterprise?.enterpriseName }}
            </span>
          </a-tooltip>
        </template>
        <template v-else-if="column.key === 'bizInstallRegion'">
          {{ record.bizDeviceSensor?.bizInstallRegion?.regionName }}
        </template>
        <template v-else-if="column.key === 'installLocation'">
          <span v-if="record.bizDeviceSensor">
            {{ record.bizDeviceSensor?.installLocation }}
          </span>
        </template>
        <template v-else-if="column.key === 'locationNo'">
          <span v-if="record.bizDeviceSensor">
            {{ record.bizDeviceSensor?.locationNo }}
          </span>
        </template>

        <template v-else-if="column.key === 'eventStatus'">
          <dict-label :options="eventTriggerStatusOptions" :value="record.eventStatus" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '查看报告',
                onClick: navigateToReport.bind(null, record),
                auth: 'manage:event:report',
                disabled: record.eventStatus !== '2',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { downloadByData } from '/@/utils/file/download';
  // 接口
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    eventTriggerStatusOptions,
    searchForm,
    tableColumns,
  } from './eventReport.data';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    workflowAlarmDealRecordPage,
    workflowAlarmDealRecordExport,
  } from '/@/api/biz/workflowAlarmDealRecord';

  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';

  const isExcelExportLoading = ref<boolean>(false);

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  /**
   * 构建registerTable
   */
  const [registerTable, { getForm }] = useTable({
    title: '',
    api: workflowAlarmDealRecordPage,
    searchInfo: {
      organizationId: route?.query?.id,
      eventStatus: '1',
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
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
    },
  });

  /**
   * 返回报警器事件触发统计
   */
  function goBack() {
    closeCurrent();

    go(`/biz/summary/event/statistic`);
  }

  /**
   * 形成报告跳转
   *
   * @param record
   */
  function navigateToReport(record: Recordable) {
    go(`/biz/alarm-management/record/report/${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let params: Recordable = {
      ...getForm().getFieldsValue(),
      organizationId: route?.query?.id,
      eventStatus: '1',
    };
    workflowAlarmDealRecordExport(params)
      .then((response) => {
        downloadByData(response, `报警器事件触发明细表_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExcelExportLoading.value = false;
      });
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type, event_trigger_status } =
      await optionsListBatchApi([
        'alarm_status',
        'delete_status',
        'online_status',
        'sensor_type',
        'event_trigger_status',
      ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    eventTriggerStatusOptions.value = event_trigger_status || [];
  }

  onMounted(() => {
    initDict();

    // NOTE: 根据路由参数 - 设置默认查询时间区间
    getForm().setFieldsValue({
      startDate: route?.query?.startDate,
      endDate: route?.query?.endDate,
    });
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportEventReportPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
