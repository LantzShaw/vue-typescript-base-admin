<template>
  <PageWrapper
    dense
    title="报警器溯源超期列表"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
    <div class="ml-2 mr-2 mt-2">
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
            <a @click="navigateToTraceabilityReport(record)" :title="record.enterpriseName">
              {{ record.enterpriseName }}
            </a>
          </template>
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { downloadByData } from '/@/utils/file/download';
  // 接口
  import { traceabilityListPage, traceabilityListExport } from '/@/api/manage/summaryReport';

  // data
  import { tableColumns } from './traceabilityList.data';

  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  const go = useGo();
  const { closeCurrent } = useTabs();

  const isExcelExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getForm }] = useTable({
    title: '',
    api: traceabilityListPage,
    columns: tableColumns,
    useSearchForm: false,
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
   * 跳转至报警器溯源超期明细表
   */
  function navigateToTraceabilityReport(record) {
    go(`/biz/summary/traceability/report?id=${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let params: Recordable = {
      ...getForm().getFieldsValue(),
    };
    traceabilityListExport(params)
      .then((response) => {
        downloadByData(response, `报警器溯源超期列表_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExcelExportLoading.value = false;
      });
  }
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportTraceabilityListPage',
  });
</script>
<style lang="less" scoped></style>
