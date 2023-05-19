<template>
  <div>
    <TableTitle label="异常信息提示" />
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
      title: '当前值',
      dataIndex: 'triggerValue',
      key: 'triggerValue',
    },
  ];

  const tableData = ref([
    {
      regionName: '分区一',
      sensorName: '传感器名称',
      locationNo: 'GT-1301',
      triggerValue: '12',
    },
    {
      regionName: '分区二',
      sensorName: '传感器名称',
      locationNo: 'GT-1302',
      triggerValue: '12',
    },
    {
      regionName: '分区三',
      sensorName: '传感器名称',
      locationNo: 'GT-1002',
      triggerValue: '12',
    },
  ]);
</script>

<style></style>
