<template>
  <PageWrapper
    dense
    title="报警器事件触发统计"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
    <BasicTable @register="registerTable">
      <!-- 按钮工具栏 -->
      <template #toolbar>
        <a-button
          :loading="isExcelExportLoading"
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
  import { onMounted, ref } from 'vue';

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
    eventTriggerStatusOptions,
    searchForm,
    tableColumns,
  } from './eventStatistic.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { alarmNumPage } from '/@/api/manage/summaryReport';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';

  const isExcelExportLoading = ref<boolean>(false);

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  /**
   * 构建registerTable
   */
  const [registerTable, { getDataSource, getColumns, getForm }] = useTable({
    title: '',
    api: alarmNumPage,
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

    go('/summary/report/list');
  }

  /**
   * 跳转至报警器事件触发明细表
   *
   * @param record
   */
  function navigateToReport(record) {
    go(`/summary/event/report?id=${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let tableData: any = getDataSource().map((item) => {
      return [item.enterpriseName, item.enterpriseNo, item.statisticsNum];
    });
    const header = getColumns().map((column) => column.title);

    aoaToSheetXlsx({
      data: tableData,
      header: header,
      filename: `报警器事件触发统计_${new Date().getTime()}.xlsx`,
    });

    isExcelExportLoading.value = false;

    // console.log(tableData, header);

    // let workSheet = XLSX.utils.aoa_to_sheet(tableData);

    // let bookNew = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(bookNew, workSheet, '作品名称'); // 工作簿名称
    // let name = '参赛人员选中' + '.xlsx';
    // XLSX.writeFile(bookNew, name); // 保存的文件名

    // jsonToSheetXlsx({
    //   data: getDataSource(),

    //   header: getColumns().map((column) => column.title),
    //   filename: `报警器事件触发明细表_${new Date().getTime()}.xls`,
    // });
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

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
