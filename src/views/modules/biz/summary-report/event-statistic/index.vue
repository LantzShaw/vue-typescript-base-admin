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
          v-auth="'manage:summary:export'"
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
  import { downloadByData } from '/@/utils/file/download';
  // 接口
  import { alarmNumPage, alarmNumExport } from '/@/api/manage/summaryReport';
  // data
  import { searchForm, tableColumns } from './eventStatistic.data';
  import { useGo } from '/@/hooks/web/usePage';

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
    pagination: false,
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/report/list');
  }

  /**
   * 跳转至报警器事件触发明细表
   *
   * @param record
   */
  function navigateToReport(record) {
    go(`/biz/summary/event/report?id=${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;
    let params: Recordable = {
      ...getForm().getFieldsValue(),
    };
    alarmNumExport(params)
      .then((response) => {
        downloadByData(response, `报警器事件触发统计_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExcelExportLoading.value = false;
      });
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
    name: 'SummaryReportEventStatisticPage',
  });
</script>
<style lang="less" scoped></style>
