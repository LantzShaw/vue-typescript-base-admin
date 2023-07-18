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
            v-auth="'manage:summary:export'"
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
  import { downloadByData } from '/@/utils/file/download';
  // 接口

  import { traceabilityReport, traceabilityReportExport } from '/@/api/manage/summaryReport';

  // data
  import { searchForm, tableColumns } from './traceabilityReport.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  const isExcelExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getForm }] = useTable({
    title: '',
    api: traceabilityReport,
    searchInfo: {
      organizationId: route?.query?.id,
    },
    columns: tableColumns,
    formConfig: searchForm,
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

    go('/biz/summary/traceability/list');
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let params: Recordable = {
      ...getForm().getFieldsValue(),
      organizationId: route?.query?.id,
    };
    traceabilityReportExport(params)
      .then((response) => {
        downloadByData(response, `报警器溯源超期明细表_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExcelExportLoading.value = false;
      });
  }

  onMounted(() => {});
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportTraceabilityReportPage',
  });
</script>
<style lang="less" scoped></style>
