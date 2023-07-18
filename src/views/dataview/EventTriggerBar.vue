<template>
  <div class="chart-container" :style="styles">
    <div ref="barChartRef" :style="{ height, width }"></div>
  </div>
</template>
<script lang="ts">
  import { PropType, Ref, computed, defineComponent, onMounted, ref, watchEffect } from 'vue';

  import { baseOption } from './data';
  import { useECharts } from '/@/hooks/web/useECharts';
  import echarts from '/@/utils/lib/echarts';

  export default defineComponent({
    name: 'EventTriggerBar',
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
        type: Number as PropType<number>,
        default: 0,
      },
      color: {
        type: String as PropType<string>,
        default: '#28F2E6',
      },
      backgroundImagePath: {
        type: String as PropType<string>,
        default: '',
      },
      totalRecords: {
        type: Number as PropType<number>,
        default: 0,
      },
    },
    setup(props) {
      const barChartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(barChartRef as Ref<HTMLDivElement>);

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          grid: {
            left: '20px',
            right: '60px',
            top: '70px',
            containLabel: true,
          },
          tooltip: {
            show: false,
          },
          xAxis: {
            type: 'value',
            max: props.totalRecords,
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
            // 内
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
                  return ((e.value / props.totalRecords) * 100).toFixed(2) + '%';
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
              }, // 底色
            },
            data: [props.displayValue],
          },
          {
            // 框
            type: 'bar',
            barWidth: 12,
            barGap: '-100%',
            label: {
              normal: {
                formatter: () => {
                  // return `{value|${props.displayValue}} unit|条`;
                  return '{value|' + props.displayValue + '}' + '{unit|' + ' 条}';
                },
                show: true,
                position: 'right',
                offset: [20, 0],
                rich: {
                  value: {
                    fontSize: 18,
                    color: props.color,
                    fontFamily: 'PANG_MEN_ZHENG_DAO',
                  },
                  unit: {
                    fontSize: 16,
                    color: '#fff',
                  },
                },

                // textStyle: {
                //   fontSize: 18,
                //   color: props.color,
                //   fontFamily: 'PANG_MEN_ZHENG_DAO',
                // },
              },
            },
            itemStyle: {
              normal: {
                color: '#152742', // 底色
              },
            },
            data: [props.totalRecords],
            z: 1,
          },
        );

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);
      };

      const styles = computed(() => {
        const url = new URL(props.backgroundImagePath, import.meta.url).href;
        return {
          background: `url("${url}") top left no-repeat`,
        };
      });

      watchEffect(() => {
        onSetOptions();
      });

      onMounted(async () => {
        onSetOptions();
      });

      return { barChartRef, styles };
    },
  });
</script>

<style scoped lang="less">
  .chart-container {
    width: 100%;
    margin-top: 20px;

    &--title {
      font-size: 16px;
    }

    &--clip-text {
      font-family: 'PANG_MEN_ZHENG_DAO';
      font-size: 20px;
      color: #fff;
      font-weight: bold;
    }
  }
</style>
