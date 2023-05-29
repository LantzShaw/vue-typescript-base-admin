<template>
  <PageWrapper
    dense
    title="报警器维护保养统计"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          :loading="isExportLoading"
          v-auth="'manage:sensor:export'"
          preIcon="ant-design:download-outlined"
          @click="handleExport"
        >
          导出Excel
        </a-button>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'enterpriseName'">
          <a @click="navigateToReport(record)">{{ record.enterpriseName }}</a>
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

  // 接口
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
    maintenanceStatusOptions,
    searchForm,
    tableColumns,
  } from './maintenanceStatistic.data';
  import { maintRecordNumPage } from '/@/api/manage/summaryReport';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  const isExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getDataSource, getColumns, getForm }] = useTable({
    title: '',
    api: maintRecordNumPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/report/list');
  }

  /**
   * 跳转至报警器维护保养明细表
   *
   * @param record
   */
  function navigateToReport(record) {
    go(`/biz/summary/maintenance/report?id=${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    let tableData: any = getDataSource().map((item) => {
      return [item.enterpriseName, item.enterpriseNo, item.statisticsNum];
    });
    const header = getColumns().map((column) => column.title);

    aoaToSheetXlsx({
      data: tableData,
      header: header,
      filename: `报警器维护保养统计_${new Date().getTime()}.xlsx`,
    });

    isExportLoading.value = false;
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type, maintenance_status } =
      await optionsListBatchApi([
        'alarm_status',
        'delete_status',
        'online_status',
        'sensor_type',
        'maintenance_status',
      ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
    maintenanceStatusOptions.value = maintenance_status || [];
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
    name: 'SummaryReportMaintenanceStatisticPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
