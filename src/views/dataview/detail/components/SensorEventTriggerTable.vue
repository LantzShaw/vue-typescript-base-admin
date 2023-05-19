<template>
  <div>
    <TableTitle label="传感器触发频繁度" />
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
      title: '触发次数',
      dataIndex: 'triggerAmount',
      key: 'triggerAmount',
    },
  ];

  const tableData = ref([
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1301',
      triggerAmount: '22',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1302',
      triggerAmount: '21',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1002',
      triggerAmount: '1',
    },
  ]);
</script>

<style></style>
