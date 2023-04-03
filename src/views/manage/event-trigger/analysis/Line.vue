<template>
  <div ref="lineRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { getLineData } from './data';

  export default defineComponent({
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: 'calc(100vh - 78px)',
      },
    },
    setup() {
      const lineRef = ref<HTMLDivElement | null>(null);
      const { setOptions, echarts, getInstance } = useECharts(lineRef as Ref<HTMLDivElement>);
      const { barData, lineData, category } = getLineData;

      onMounted(() => {
        setOptions({
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                backgroundColor: '#333',
              },
            },
          },
          legend: {
            data: ['line', 'bar'],
            textStyle: {
              color: '#ccc',
            },
          },
          xAxis: {
            data: category,
            axisLine: {
              lineStyle: {
                color: '#ccc',
              },
            },
          },
          yAxis: {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#ccc',
              },
            },
          },
          dataZoom: {
            show: true,
            start: 0,
            end: 50,
          },
          series: [
            {
              name: 'line',
              type: 'line',
              smooth: true,
              showAllSymbol: 'auto',
              symbol: 'emptyCircle',
              symbolSize: 15,
              data: lineData,
            },
            {
              name: 'line',
              type: 'bar',
              barGap: '-100%',
              barWidth: 10,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(20,200,212,0.5)' },
                  { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                  { offset: 1, color: 'rgba(20,200,212,0)' },
                ]),
              },
              z: -12,
              data: lineData,
            },
          ],
        });

        // props.imageUrl = getInstance()?.getDataURL({
        //   type: 'png',
        // })
      });
      return { lineRef };
    },
  });
</script>
