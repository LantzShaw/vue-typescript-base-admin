<template>
  <div>
    <TableTitle label="进行中的维保任务" />
    <Table :columns="columns" :data-source="tableData" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import TableTitle from './TableTitle.vue';
  import Table from './Table.vue';

  const columns = [
    {
      title: '区域',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '传感器数量',
      dataIndex: 'sensorAccount',
      key: 'sensorAccount',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  const tableData = ref([
    {
      regionName: '分区一',
      sensorAccount: '2',
      locationNo: 'GT-1301',
      startDate: '2023-05-18',
      endDate: '2023-05-20',
    },
    {
      regionName: '分区一',
      sensorAccount: '4',
      locationNo: 'GT-1302',
      startDate: '2023-05-18',
      endDate: '2023-05-20',
    },
    {
      regionName: '分区一',
      sensorAccount: '11',
      locationNo: 'GT-1002',
      startDate: '2023-05-18',
      endDate: '2023-05-20',
    },
  ]);
</script>

<style></style>
