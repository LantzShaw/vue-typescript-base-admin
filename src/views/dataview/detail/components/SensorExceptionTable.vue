<template>
  <div>
    <TableTitle label="传感器异常频繁度" @on-show="showModalHandler">
      <a-date-picker
        @change="onDatePickerChange"
        dropdownClassName="dropdown-date-picker"
        v-model:value="calYearMonth"
        picker="month"
        :suffixIcon="null"
        :allowClear="false"
      />
    </TableTitle>
    <Table :loading="isTableLoading" :columns="columns" :data-source="tableData" />
  </div>

  <a-modal
    :bodyStyle="{ background: '#19305e' }"
    :closable="false"
    :footer="null"
    width="800px"
    v-model:visible="isModalVisible"
  >
    <div>
      <div
        style="
          background-color: #243a66;
          height: 50px;
          color: #fff;
          line-height: 50px;
          font-weight: bold;
          padding-left: 10px;
        "
        >传感器异常频繁度</div
      >

      <div style="padding: 20px 10px">
        <a-space>
          <a-date-picker
            dropdownClassName="dropdown-date-picker"
            style="width: 240px"
            v-model:value="calYearMonth_2"
            picker="month"
            :suffixIcon="null"
            :allowClear="false"
          />
          <a-button type="primary" @click="clickHandler">查询</a-button>
        </a-space>
      </div>

      <BasicTable :scroll="{ x: 700, y: 400 }" @register="registerTable" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { DatePicker as ADatePicker, Modal as AModal, Space as ASpace } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';

  import { useRoute } from 'vue-router';
  import { getAbnormalStatistics } from '/@/api/dataview';
  import { useUserStore } from '/@/store/modules/user';

  import Table from './Table.vue';
  import TableTitle from './TableTitle.vue';

  import { BasicTable, useTable } from '/@/components/Table';

  import { dateUtil } from '/@/utils/dateUtil';

  const userStore = useUserStore();
  const route = useRoute();

  const organizationId = ref<string>((route.query.id as string) ?? userStore.getOrganizationId);

  const calYearMonth = ref<any>(dateUtil());
  const calYearMonth_2 = ref<any>(dateUtil());

  const isTableLoading = ref<boolean>(false);

  const columns = [
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
      key: 'sensorName',
    },
    {
      title: '位号',
      dataIndex: 'locationNo',
      key: 'locationNo',
    },
    {
      title: '异常次数',
      dataIndex: 'exceptionNum',
      key: 'exceptionNum',
    },
  ];

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: getAbnormalStatistics,
    beforeFetch: (params) => {
      params.organizationId = organizationId.value;
      params.calYearMonth = dateUtil(calYearMonth_2.value).format('YYYY-MM');
      return params;
    },
    columns: columns,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    clickToRowSelect: false,
    clearSelectOnPageChange: true,
    maxHeight: 350,
  });

  const tableData = ref([]);
  const isModalVisible = ref<boolean>(false);

  function showModalHandler(open) {
    isModalVisible.value = open;

    reload();
  }

  function onDatePickerChange(date) {
    calYearMonth.value = date;

    getTableData();
  }

  function clickHandler() {
    reload();
  }

  async function getTableData() {
    isTableLoading.value = true;

    try {
      const response = await getAbnormalStatistics({
        pageSize: 5,
        organizationId: organizationId.value,
        calYearMonth: dateUtil(calYearMonth.value).format('YYYY-MM'),
      });

      if (response) {
        tableData.value = response.records;
      } else {
        tableData.value = [];
      }
    } catch (error) {
      console.log(error);
    } finally {
      isTableLoading.value = false;
    }
  }

  onMounted(() => {
    getTableData();
  });
</script>

<style scoped lang="less">
  @import url('./styles.less');

  .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }
</style>

<style>
  .dropdown-date-picker .ant-picker-panel {
    border-bottom: 1px solid rgba(0, 168, 255, 1) !important;
  }
  .dropdown-date-picker .ant-picker-month-panel {
    background-color: #082345 !important;
  }

  .dropdown-date-picker .ant-picker-header {
    color: rgba(0, 168, 255, 1) !important;

    border-bottom: 1px solid rgba(0, 168, 255, 1) !important;
  }

  .dropdown-date-picker .ant-picker-content {
    color: rgba(0, 168, 255, 1) !important;
  }

  .dropdown-date-picker .ant-picker-cell-in-view {
    color: rgba(0, 168, 255, 1) !important;
  }

  .dropdown-date-picker .ant-picker-header-super-prev-btn {
    color: rgba(0, 168, 255, 1) !important;
  }

  .dropdown-date-picker .ant-picker-header-super-next-btn {
    color: rgba(0, 168, 255, 1) !important;
  }

  .dropdown-date-picker .ant-picker-cell:hover:not(.ant-picker-cell-in-view) .ant-picker-cell-inner,
  .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(
      .ant-picker-cell-range-end
    ):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end)
    .ant-picker-cell-inner {
    background: #0960bd;
    color: #fff;
  }
</style>
