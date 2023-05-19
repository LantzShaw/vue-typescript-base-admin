<template>
  <div class="middle-container">
    <div class="wrapper">
      <div style="width: 442px">
        <SensorEventTriggerTable />
      </div>
      <div style="width: 442px">
        <SensorExceptionTable />
      </div>
    </div>
    <div class="wrapper mt-27px">
      <div style="width: 442px">
        <UnderwayEventTriggerTable />
      </div>
      <div style="width: 442px">
        <ExceptionInformationTable />
      </div>
    </div>
    <div class="wrapper">
      <div style="width: 100%; margin-top: 34px">
        <UnderwayMaintenanceTable />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SensorEventTriggerTable from './SensorEventTriggerTable.vue';
  import SensorExceptionTable from './SensorExceptionTable.vue';
  import UnderwayEventTriggerTable from './UnderwayEventTriggerTable.vue';
  import ExceptionInformationTable from './ExceptionInformationTable.vue';
  import UnderwayMaintenanceTable from './UnderwayMaintenanceTable.vue';
</script>

<style scoped lang="less">
  .middle-container {
    width: 1012px;
    padding: 0 55px;

    .wrapper {
      display: flex;
      justify-content: space-between;
      height: 300px;
    }
  }
</style>
