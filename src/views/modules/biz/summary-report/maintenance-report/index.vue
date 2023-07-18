<template>
  <PageWrapper
    dense
    title="报警器维护保养明细表"
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
        <template v-if="column.key === 'eventStatus'">
          <dict-label :options="maintenanceStatusOptions" :value="record.eventStatus" />
        </template>

        <!-- 表格按钮 -->
        <template v-else-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '工单报告',
                onClick: navigateToEquipmentMaintenanceReport.bind(null, record),
                auth: 'manage:maintenance-record:report',
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
    maintenanceStatusOptions,
    searchForm,
    tableColumns,
  } from './maintenanceReport.data';
  import { maintenanceReport, maintenanceReportExport } from '/@/api/manage/summaryReport';

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
  const [registerTable, { getForm }] = useTable({
    title: '',
    api: maintenanceReport,
    searchInfo: {
      organizationId: route?.query?.id,
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
      auth: 'manage:maintenance-record:report',
    },
  });

  /**
   * 返回报警器维护保养统计
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/maintenance/statistic');
  }

  /**
   * 跳转至工单报告
   */
  function navigateToEquipmentMaintenanceReport(record: Recordable) {
    go(`/equipment/maintenance/report/${record.id}`);
  }

  /**
   * 导出
   */
  function handleExport() {
    isExportLoading.value = true;

    let params: Recordable = {
      ...getForm().getFieldsValue(),
      organizationId: route?.query?.id,
    };
    maintenanceReportExport(params)
      .then((response) => {
        downloadByData(response, `报警器溯源超期列表_${new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        isExportLoading.value = false;
      });
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { maintenance_status } = await optionsListBatchApi(['maintenance_status']);

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
    name: 'SummaryReportMaintenanceReportPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
