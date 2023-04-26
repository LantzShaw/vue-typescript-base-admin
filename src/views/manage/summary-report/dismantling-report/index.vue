<template>
  <PageWrapper
    dense
    title="报警器拆除情况明细表"
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
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  // 组件
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';

  // 接口
  import { sensorPage } from '/@/api/manage/sensor';

  // data
  import { searchForm, tableColumns } from './dismantlingReport.data';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { aoaToSheetXlsx } from '/@/components/Excel';

  const route = useRoute();
  const { closeCurrent } = useTabs();
  const go = useGo();

  const isExcelExportLoading = ref<boolean>(false);

  /**
   * 构建registerTable
   */
  const [registerTable, { getForm, getColumns, getDataSource }] = useTable({
    title: '',
    api: sensorPage,
    columns: tableColumns,
    formConfig: searchForm,
    useSearchForm: true,
    canResize: false,
    showTableSetting: true,
    showIndexColumn: false,
    // actionColumn: {
    //   width: 140,
    //   title: '操作',
    //   dataIndex: 'action',
    //   // slots: { customRender: 'action' },
    //   fixed: 'right',
    //   // fixed: undefined,
    //   // auth: 'system:application:operation',
    // },
  });

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/summary/report/list');
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    let tableData: any = getDataSource().map((item) => {
      return [item.organizationName, item.createTime, item.regionName, item.locationno];
    });
    const header = getColumns().map((column) => column.title);

    header.pop();

    aoaToSheetXlsx({
      data: tableData,
      header: header,
      filename: `报警器拆除情况明细表_${new Date().getTime()}.xlsx`,
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

<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
