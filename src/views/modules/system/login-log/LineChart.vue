<template>
  <div id="lineChart" style="height: 180px"></div>
</template>
<script lang="ts" setup>
  import { Line } from '@antv/g2plot';
  import { onMounted } from 'vue';
  import { lineChartData } from '/@/api/authorize/compliance';
  const seriesKey = 'series';
  const valueKey = 'value';
  const processData = (data, yFields, meta) => {
    const result = [] as any;

    data.forEach((d) => {
      yFields.forEach((yField) => {
        const name = meta?.[yField]?.alias || yField;
        result.push({ ...d, [seriesKey]: name, [valueKey]: d[yField] });
      });
    });
    return result;
  };
  onMounted(async () => {
    const lineMeta = {
      date: {
        alias: '登录登出周统计',
      },
      loginCount: {
        alias: '登录',
      },
      logoutCount: {
        alias: '登出',
      },
    };
    const data = await lineChartData();
    const line = new Line('lineChart', {
      data: processData(data, ['loginCount', 'logoutCount'], lineMeta),
      padding: 'auto',
      xField: 'date',
      yField: valueKey,
      seriesField: seriesKey,
      color: ['#1890ff', 'rgb(188, 189, 190)'],
      appendPadding: [0, 8, 0, 0],
    });
    line.render();
  });
</script>
