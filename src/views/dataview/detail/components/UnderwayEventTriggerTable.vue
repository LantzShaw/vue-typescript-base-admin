<template>
  <div>
    <TableTitle label="进行中的触发事件" />
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
      title: '时间',
      dataIndex: 'triggerDate',
      key: 'triggerDate',
    },
  ];

  const tableData = ref([
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1301',
      triggerDate: '2023-05-18 12:00:00',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1302',
      triggerDate: '2023-05-18 12:00:00',
    },
    {
      sensorName: '传感器名称',
      locationNo: 'GT-1002',
      triggerDate: '2023-05-18 12:00:00',
    },
  ]);
</script>

<style></style>
