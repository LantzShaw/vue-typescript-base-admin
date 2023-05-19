<template>
  <div class="chart-container" :style="styles">
    <div ref="barChartRef" :style="{ height, width }"></div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted, computed } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

  export default defineComponent({
    name: 'RightBoxBar',
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '41px',
      },
      label: {
        type: String as PropType<string>,
        default: '',
      },
      displayValue: {
        type: String as PropType<string>,
        default: '0',
      },
      color: {
        type: String as PropType<string>,
        default: '#28F2E6',
      },
      backgroundImagePath: {
        type: String as PropType<string>,
        default: '',
      },
    },
    setup(props) {
      const barChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<number[]>([100]);

      const { setOptions, getInstance } = useECharts(barChartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading();
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        let max = 300;

        const seriesOption: any = {
          grid: {
            left: '20px',
            right: '60px',
            top: '70px',
            containLabel: true,
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              return `${params.name} ${params.value}`;
            },
          },
          xAxis: {
            type: 'value',
            max: max,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: [
            {
              type: 'category',
              inverse: false,
              data: [props.label],
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#F0F1F7',
                },
              },
            },
          ],
          series: [],
        };

        seriesOption.series.push(
          {
            //内
            type: 'bar',
            barWidth: 12,
            label: {
              normal: {
                show: false,
                position: 'right',
                textStyle: {
                  color: '#fff',
                },
                formatter: function (e) {
                  return ((e.value / max) * 100).toFixed(2) + '%';
                },
              },
            },
            legendHoverLink: false,
            silent: true,
            itemStyle: {
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: props.color, // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: props.color, // 100% 处的颜色
                  },
                ],
              }, //底色
            },
            data: chartData.value,
          },
          {
            //框
            type: 'bar',
            barWidth: 12,
            barGap: '-100%',
            label: {
              normal: {
                formatter: (e) => {
                  return props.displayValue;
                },
                show: true,
                position: 'right',
                offset: [8, 0],
                textStyle: {
                  fontSize: 18,
                  color: props.color,
                  fontFamily: 'PANG_MEN_ZHENG_DAO',
                },
              },
            },
            itemStyle: {
              normal: {
                color: '#152742', //底色
              },
            },
            data: [max],
            z: 1,
          },
        );

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      const styles = computed(() => {
        // NOTE: vue3 vite 无法使用require 参考文章: https://juejin.cn/post/7125274210120761352

        // require(props.backgroundImagePath)
        const url = new URL(props.backgroundImagePath, import.meta.url).href;
        return {
          background: `url("${url}") top left no-repeat`,
        };
      });

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { barChartRef, styles };
    },
  });
</script>

<style scoped lang="less">
  .chart-container {
    width: 100%;
    // height: 300px;
    // box-sizing: border-box;
    // background: url('/@/assets/images/dataview/line_bg_1.png') top left no-repeat;
    margin-top: 20px;

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
