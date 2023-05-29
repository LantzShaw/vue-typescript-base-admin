<template>
  <PageWrapper
    dense
    title="报警器新增情况统计"
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
  import { BasicTable, useTable } from '/@/components/Table';

  // 接口
  import { sensorChangeNumPage } from '/@/api/manage/summaryReport';

  // data
  import { searchForm, tableColumns } from './additionStatistic.data';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  const route = useRoute();
  const go = useGo();
  const { closeCurrent } = useTabs();

  const isExcelExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getColumns, getDataSource, getForm }] = useTable({
    title: '',
    api: sensorChangeNumPage,
    columns: tableColumns,
    searchInfo: {
      type: '1',
    },
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
   * 跳转至报警器新增情况明细表
   *
   * @param record
   */
  function navigateToReport(record) {
    go(`/biz/summary/addition/report?id=${record.id}`);
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
      filename: `报警器新增情况统计_${new Date().getTime()}.xlsx`,
    });

    isExcelExportLoading.value = false;
  }

  onMounted(() => {
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
    name: 'SummaryReportAdditionStatisticPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
