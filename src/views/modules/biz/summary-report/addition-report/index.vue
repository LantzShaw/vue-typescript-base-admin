<template>
  <PageWrapper
    dense
    title="报警器新增情况明细表"
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
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { downloadByData } from '/@/utils/file/download';
  // 接口
  import { additionReportPage, sensorChangeExportData } from '/@/api/manage/summaryReport';

  // data
  import { searchForm, tableColumns } from './additionReport.data';

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
  const [registerTable, { getForm }] = useTable({
    title: '',
    api: additionReportPage,
    columns: tableColumns,
    searchInfo: {
      changeType: '1',
      organizationId: route?.query?.id,
    },
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
  });

  /**
   * 返回报警器新增情况统计
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/addition/statistic');
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let params: Recordable = {
      ...getForm().getFieldsValue(),
      changeType: '1',
      organizationId: route?.query?.id,
    };
    sensorChangeExportData(params)
      .then((response) => {
        downloadByData(response, `报警器新增情况明细表_${new Date().getTime()}.xlsx`);
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
    name: 'SummaryReportAdditionReportPage',
  });
</script>
<style lang="less" scoped></style>
