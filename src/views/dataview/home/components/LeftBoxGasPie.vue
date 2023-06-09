<template>
  <div ref="gasPieChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

  import { statisticsGasType } from '/@/api/dataview';

  type ChartData = {
    name: string;
    value: number;
  };

  export default defineComponent({
    name: 'LeftBoxGasPie',
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '280px',
      },
    },
    setup(props) {
      const gasPieChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<ChartData[]>([
        // { value: 1048, name: '甲烷' },
        // { value: 735, name: '氯化氢' },
        // { value: 580, name: '环氧乙烷' },
        // { value: 484, name: '氨气' },
        // { value: 320, name: '硫化氢' },
        // { value: 310, name: '二氧化氯' },
        // { value: 350, name: '正乙烷' },
        // { value: 360, name: '其他' },
      ]);

      const { setOptions, getInstance } = useECharts(gasPieChartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading({
          text: '加载中...',
          color: 'rgba(1, 167, 204, 1)',
          textColor: 'rgba(1, 167, 204, 1)',
          maskColor: '#05132c',
        });

        const response = await statisticsGasType();

        chartData.value = response;
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          // TODO: 这里设置颜色不行
          // color: [
          //   '#1D75F0',
          //   '#FF701A',
          //   '#FFEA00',
          //   '#FFEA00',
          //   '#00A8FF',
          //   '#3FFFEA',
          //   '#00E436',
          //   '#78FF00',
          // ],
          series: [],
        };

        seriesOption.series.push({
          type: 'pie',
          right: '50',
          radius: ['40%', '65%'],
          data: chartData.value,
          itemStyle: {
            normal: {
              color: function (colors) {
                const colorList = [
                  '#1D75F0',
                  '#FF701A',
                  '#FFEA00',
                  '#FFEA00',
                  '#00A8FF',
                  '#3FFFEA',
                  '#00E436',
                  '#78FF00',
                ];
                return colorList[colors.dataIndex];
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          selectedMode: 'single',
          selectedOffset: 10,
          clockwise: true,
          labelLine: {
            length: 10,
            length2: 20,
            lineStyle: {
              color: '#fff',
            },
          },
          label: {
            color: '#fff',
            normal: {
              formatter: function (params) {
                const index = params.dataIndex;
                const name = params.name;
                const percent = params.percent;

                return [`{value${index}|${name}}\n{normal${index}|${percent}%}`].join('\n');
              },
              rich: getRich(),
            },
          },
        });

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      function getRich() {
        let result = {};
        chartData.value.forEach((v, i) => {
          (result[`normal${i}`] = {
            fontSize: 16,
            align: 'left',
            padding: [8, 2],
            color: '#fff',
          }),
            (result[`value${i}`] = {
              color: '#fff',
              align: 'left',
              fontSize: 16,
              padding: [8, 2],
            });
        });
        return result;
      }

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { gasPieChartRef };
    },
  });
</script>
