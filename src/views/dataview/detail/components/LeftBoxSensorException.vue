<template>
  <div>
    <Table
      :evenCellStyle="{ backgroundColor: '#0D316E' }"
      :oddCellStyle="{ backgroundColor: 'transparent' }"
      :columns="columns"
      :data-source="tableData"
    >
      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'regionName'"> ddd{{ record.regionName }} </template>
      </template> -->

      <!-- :cell-style="{ backgroundColor: '#f40' }" -->

      <template #regionName="{ record }">
        <span style="color: #7bbcee">{{ record.regionName }}</span>
      </template>

      <template #sensorAmount="{ record }">
        <span style="color: #ffbc38">{{ record.sensorAmount }}</span>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import Table from './Table.vue';

  const columns = [
    {
      title: '区域名称',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '传感器数量',
      dataIndex: 'sensorAmount',
      key: 'sensorAmount',
    },
  ];

  const tableData = ref([
    {
      regionName: '分区一',
      sensorAmount: '20',
    },
    {
      regionName: '分区二',
      sensorAmount: '33',
    },
    {
      regionName: '分区三',
      sensorAmount: '22',
    },
  ]);
</script>

<style></style>
