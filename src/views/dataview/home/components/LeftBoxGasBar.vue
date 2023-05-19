<template>
  <div ref="gasBarChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

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
        default: [
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
      const chartData = ref<ChartData[]>([
        { name: '氢气', data: [320, 302, 301, 334, 390, 330, 320] },
        { name: '苯', data: [120, 132, 101, 134, 90, 230, 210] },
        { name: '二氯甲烷', data: [120, 132, 101, 134, 90, 230, 210] },
      ]);

      const { setOptions, getInstance } = useECharts(gasBarChartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading();
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
            data: ['星星新能源', '嘉华新材料', '美福石油', '和盛工业', '信汇新材料'],
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
                // color: props.colorList[index],
                color: `rgba(${props.colorList[index]}, 0.4)`,
                borderWidth: 1,
                borderColor: `rgb(${props.colorList[index]})`,
              },
            },
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
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
