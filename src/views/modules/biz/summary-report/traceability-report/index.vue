<template>
  <PageWrapper
    dense
    title="报警器溯源超期明细表"
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
            v-auth="'manage:sensor:export'"
            preIcon="ant-design:download-outlined"
            @click="handleExport"
          >
            导出Excel
          </a-button>
        </template>
        <!-- 表格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'organizationId'">
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
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';

  // 接口

  import { traceabilityReport } from '/@/api/manage/summaryReport';

  // data
  import { searchForm, tableColumns } from './traceabilityReport.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { aoaToSheetXlsx } from '/@/components/Excel';

  const go = useGo();
  const { closeCurrent } = useTabs();

  const isExcelExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getDataSource, getColumns }] = useTable({
    title: '',
    api: traceabilityReport,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: false,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      ifShow: false,
      width: 140,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: 'right',
      // fixed: undefined,
      // auth: 'system:application:operation',
    },
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/traceability/list');
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let tableData: any = getDataSource().map((item) => {
      return [item.organizationName, '--', item.maxDate];
    });
    const header = getColumns().map((column) => column.title);

    header.pop();

    aoaToSheetXlsx({
      data: tableData,
      header: header,
      filename: `报警器溯源超期明细表_${new Date().getTime()}.xlsx`,
    });

    isExcelExportLoading.value = false;
  }

  onMounted(() => {});
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportTraceabilityReportPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
