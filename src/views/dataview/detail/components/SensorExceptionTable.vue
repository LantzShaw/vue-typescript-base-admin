<template>
  <div>
    <TableTitle label="传感器异常频繁度" />
    <Table :columns="columns" :data-source="tableData" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import TableTitle from './TableTitle.vue';
  import Table from './Table.vue';

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
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const tableData = ref([
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1301',
      amount: '22',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1302',
      amount: '21',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1002',
      amount: '1',
    },
  ]);
</script>

<style></style>
