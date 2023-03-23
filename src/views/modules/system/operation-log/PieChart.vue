<template>
  <div id="pieChart" style="height: 180px"></div>
</template>
<script lang="ts" setup>
  import { Pie } from '@antv/g2plot';
  import { onMounted } from 'vue';
  import { operationLogPage3 } from '/@/api/system/operationLog';

  onMounted(async () => {
    const data = await operationLogPage3();
    const piePlot = new Pie('pieChart', {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.9,
      color: ['#1890ff', '#F5222D'],
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    });
    piePlot.render();
  });
</script>
