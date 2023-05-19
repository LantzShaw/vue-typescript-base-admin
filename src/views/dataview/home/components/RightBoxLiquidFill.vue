<template>
  <div class="chart-container">
    <div ref="liquidFillChartRef" :style="{ height, width }"></div>
    <div class="text-center">
      <div class="h-6 leading-6 chart-container--clip-text" :style="[{ ...textStyle }]">{{
        displayValue
      }}</div>
      <div class="text-white">{{ title }}</div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted, computed } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

  export default defineComponent({
    name: 'RightBoxLiquidFill',
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '180px',
      },
      title: {
        type: String as PropType<string>,
        default: '',
      },
      displayValue: {
        type: String as PropType<string>,
        default: '0',
      },
      colorList: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    setup(props) {
      const liquidFillChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<number[]>([0.45]);

      const { setOptions, getInstance } = useECharts(liquidFillChartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading();
      };

      const textStyle = computed(() => {
        return {
          background: `linear-gradient(-15deg, ${props.colorList[0]} 0%, ${props.colorList[1]} 80%, ${props.colorList[2]} 100%)`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        };
      });

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          // title: [
          //   {
          //     show: false,
          //     x: '34%',
          //     y: '58%',
          //     text: `{value|3}\n{title|有效}`,
          //     textStyle: {
          //       rich: {
          //         value: {
          //           color: '#5ed6ae',
          //           // color: [
          //           //   {
          //           //     type: 'linear',
          //           //     x: 0,
          //           //     y: 0,
          //           //     x2: 0,
          //           //     y2: 1,
          //           //     colorStops: [
          //           //       {
          //           //         offset: 0,
          //           //         color: '#B2E72A',
          //           //       },
          //           //       {
          //           //         offset: 0.5,
          //           //         color: '#0ABD9C',
          //           //       },
          //           //       {
          //           //         offset: 1,
          //           //         color: '#1FBB9B',
          //           //       },
          //           //     ],
          //           //     globalCoord: false,
          //           //   },
          //           // ],
          //           fontSize: 20,
          //           textAlign: 'center',
          //           padding: [10, 0, 6, 10],
          //         },
          //         title: {
          //           fontSize: 16,
          //           textAlign: 'center',
          //           color: '#fff',
          //           padding: [0, 0, 1, 0],
          //         },
          //       },
          //     },
          //   },
          // ],
          series: [],
        };

        seriesOption.series.push({
          type: 'liquidFill',
          radius: '78%',
          center: ['55%', '42%'],
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: props.colorList[0],
                },
                {
                  offset: 0.5,
                  color: props.colorList[1],
                },
                {
                  offset: 1,
                  color: props.colorList[2],
                },
              ],
              globalCoord: false,
            },
          ],
          data: chartData, // data个数代表波浪数
          backgroundStyle: {
            borderWidth: 1,
            color: '#0C1A88',
          },
          label: {
            normal: {
              textStyle: {
                fontSize: 20,
                color: '#fff',
              },
            },
          },
          outline: {
            show: false,
            // borderDistance: 0,
            // itemStyle: {
            //   borderWidth: 2,
            //   borderColor: '#112165',
            // },
          },
        });

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { liquidFillChartRef, textStyle };
    },
  });
</script>

<style scoped lang="less">
  .chart-container {
    width: 250px;
    height: 300px;
    padding: 0 20px;
    box-sizing: border-box;
    background: url('/@/assets/images/dataview/chart_background.png') top left no-repeat;

    &--title {
      font-size: 16px;
    }

    &--clip-text {
      font-family: 'PANG_MEN_ZHENG_DAO';
      font-size: 20px;
      color: #fff;
      // background: linear-gradient(-15deg, #afe71c 0%, #15c29b 80.8837890625%, #05b48d 100%);
      // background: var(--background);
      font-weight: bold;
    }
  }
</style>
