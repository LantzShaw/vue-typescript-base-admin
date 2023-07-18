<template>
  <div ref="gasBarChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { PropType, Ref, defineComponent, onMounted, ref } from 'vue';

  import { baseOption } from './data';
  import { useECharts } from '/@/hooks/web/useECharts';
  import echarts from '/@/utils/lib/echarts';

  import { statisticsGasDistribution } from '/@/api/dataview';

  type ChartData = {
    name: string;
    data: Array<string | number>;
  };

  export default defineComponent({
    name: 'LeftBoxGasBar',
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '280px',
      },
      colorList: {
        type: Array as PropType<string[]>,
        default: () => [
          '42, 207, 255',
          '33, 255, 148',
          '239, 234, 55',
          '236, 137, 43',
          '231, 21, 25',
          '158, 42, 139',
          '97, 54, 143',
          '40, 71, 151',
          '29, 165, 99',
          '121, 188, 82',
        ],
      },
    },
    setup(props) {
      const gasBarChartRef = ref<HTMLDivElement | null>(null);
      const xAxisList = ref<string[]>([]);
      const chartData = ref<ChartData[]>([]);

      const { setOptions, getInstance } = useECharts(gasBarChartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading({
          text: '加载中...',
          color: 'rgba(1, 167, 204, 1)',
          textColor: 'rgba(1, 167, 204, 1)',
          maskColor: '#05132c',
        });

        try {
          const response = await statisticsGasDistribution();

          chartData.value = response.dataList;
          xAxisList.value = response.xaxisList;
        } catch (error) {
          console.log('error', error);
        }
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          color: props.colorList,
          grid: {
            top: '8%',
            bottom: '10%',
            left: '1%',
            right: '18%',
            containLabel: true,
          },
          legend: {
            icon: 'rect',
            orient: 'vertical',
            left: 'right',
            top: 'middle',
            align: 'left',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              color: '#fff',
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#14223C',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#14223C',
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#14223C',
              },
            },
          },
          yAxis: {
            type: 'category',
            data: xAxisList.value,
            axisLabel: {
              color: '#fff',
            },
            axisLine: {
              lineStyle: {
                color: '#14223C',
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#14223C',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#14223C',
              },
            },
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            formatter: function (params) {
              let str =
                '<div style="color: #fff;">' +
                params.name +
                '<br/>' +
                params.marker +
                ' ' +
                params.seriesName +
                ': ' +
                params.value +
                '个<br></div>';

              let res =
                `<div style=' border-radius: 8px; color:#0C525D;font-family: PingFang SC; background: #0C525D; padding: 16px; '>` +
                str;

              return res;
            },
          },
          series: [],
        };

        chartData.value.forEach((item, index) => {
          seriesOption.series.push({
            name: item.name,
            type: 'bar',
            stack: 'total',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: `rgba(${props.colorList[index]}, 0.4)`,
                borderWidth: 1,
                borderColor: `rgb(${props.colorList[index]})`,
              },
            },
            label: {
              show: true,
            },
            data: item.data,
          });
        });

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { gasBarChartRef };
    },
  });
</script>
