<template>
  <div ref="gasPieChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { PropType, Ref, defineComponent, onMounted, ref } from 'vue';

  import { baseOption } from './data';
  import { useECharts } from '/@/hooks/web/useECharts';
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
    setup() {
      const gasPieChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<ChartData[]>([]);

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
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            formatter: function (params, _ticket, _callback) {
              let str =
                '<div style="color: #fff">' +
                params.marker +
                ' ' +
                params.name +
                ': ' +
                params.value +
                '个<br></div>';

              let res =
                `<div style=' border-radius: 8px; color:#0C525D;font-family: PingFang SC; background: #0C525D; padding: 16px; width: 156px;'>` +
                str;

              return res;
            },
          },
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
