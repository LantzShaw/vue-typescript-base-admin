<template>
  <div ref="lifecycleAnnularChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  // import { baseOption } from './data';
  // import echarts from '/@/utils/lib/echarts';

  import annular_icon from '/@/assets/images/dataview/annular_icon.png';

  type ChartData = {
    name: string;
    value: number;
    percent: string;
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
        default: '360px',
      },
    },
    setup(props) {
      const lifecycleAnnularChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<ChartData[]>([
        { value: 1048, name: '甲烷', percent: '0%' },
        { value: 735, name: '氯化氢', percent: '0%' },
        { value: 580, name: '环氧乙烷', percent: '0%' },
        { value: 580, name: '硫化氢', percent: '0%' },
      ]);

      const color = ['#2D6DEA', '#DECF38', '#00BCBB', '#CAC9C9'];

      let arrName: any = [];
      let arrValue: any = [];
      let sum = 0;
      let lineYAxis: any = [];

      // 数据处理
      chartData.value.forEach((v) => {
        arrName.push(v.name);
        arrValue.push(v.value);
        sum = sum + v.value;
      });

      const { setOptions, getInstance } = useECharts(
        lifecycleAnnularChartRef as Ref<HTMLDivElement>,
      );

      const getChartData = async () => {
        getInstance()?.showLoading();
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const chartOption: any = {
          grid: {
            top: '10%',
            bottom: '60%',
            left: '40%',
            containLabel: true,
          },
          color: color,
          graphic: {
            // 图形中间图片
            elements: [
              {
                type: 'image',
                style: {
                  image: annular_icon,
                  width: 38,
                  height: 41,
                },
                left: '35%',
                top: '40%',
              },
            ],
          },
          legend: {
            show: true,
            top: '15%',
            // left: '70%',
            data: arrName,
            itemWidth: 12,
            itemHeight: 12,
            // width: 50,
            padding: [0, 5],
            itemGap: 25,
            icon: 'circle',
            orient: 'vertical',
            left: 'right',
            align: 'left',

            formatter: function (name) {
              return '{title|' + name + '}';
            },
            textStyle: {
              rich: {
                title: {
                  fontSize: 10,
                  lineHeight: 10,
                  color: '#fff',
                },
                value: {
                  fontSize: 14,
                  lineHeight: 18,
                  color: '#fff',
                },
              },
            },
          },
          yAxis: [
            {
              type: 'category',
              inverse: true,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                formatter: function (params) {
                  let item = chartData.value[params];

                  return '{circle|●}{bd|}{value|' + item.value + '}{percent|' + item.percent + '}';
                },
                interval: 0,
                inside: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 16,
                  rich: {
                    bd: {
                      // color: '#ccc',
                      fontSize: 16,
                    },
                    percent: {
                      padding: [10, 10],
                      // color: '#fff',
                      fontSize: 16,
                    },
                    value: {
                      // color: '#fff',
                      fontSize: 16,
                      fontWeight: 500,
                      padding: [0, 0, 0, 10],
                    },
                    unit: {
                      fontSize: 16,
                    },
                  },
                },
                show: true,
              },
              data: lineYAxis,
            },
          ],
          xAxis: [
            {
              show: false,
            },
          ],
          series: [],
        };

        chartData.value.forEach((v, i) => {
          chartOption.series.push({
            name: '生命周期',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [62 - i * 15 + '%', 60 - i * 15 + '%'],
            center: ['40%', '45%'],
            label: {
              show: false,
            },
            data: [
              {
                value: v.value,
                name: v.name,
              },
              {
                value: sum - v.value,
                name: '',
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                },
                tooltip: {
                  show: false,
                },
              },
            ],
            minAngle: 10,
            itemStyle: {
              normal: {
                color: () => {
                  const colorList = ['#2D6DEA', '#DECF38', '#00BCBB', '#CAC9C9'];
                  return colorList[i];
                },
              },
            },
          });
          chartOption.series.push({
            name: '',
            type: 'pie',
            silent: true,
            z: 1,
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [62 - i * 15 + '%', 60 - i * 15 + '%'],
            center: ['40%', '45%'],
            label: {
              show: false,
            },
            data: [
              {
                value: 7.5,
                itemStyle: {
                  color: '#282B4E',
                },
                // label: {
                //   normal: {
                //     show: true,
                //     position: 'center',
                //     color: '#4c4a4a',
                //     formatter: '{total|' + 200 + '}' + '\n\r' + '{active|共发布活动}',
                //     rich: {
                //       total: {
                //         fontSize: 14,
                //         fontFamily: '微软雅黑',
                //         color: '#454c5c',

                //       },
                //       active: {
                //         fontFamily: '微软雅黑',
                //         fontSize: 16,
                //         color: '#6c7a89',
                //         lineHeight: 30,
                //       },
                //     },
                //   },
                //   emphasis: {
                //     //中间文字显示
                //     show: true,
                //   },
                // },
              },
              {
                value: 2.5,
                name: '',
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                },
              },
            ],
          });

          v.percent = ((v.value / sum) * 100).toFixed(1) + '%';

          lineYAxis.push({
            value: i,
            textStyle: {
              rich: {
                circle: {
                  color: color[i],
                  padding: [0, 5],
                },
              },
            },
          });
        });

        // const mergedOptions = echarts.util.merge(chartOption, baseOption);

        await setOptions(chartOption);

        getInstance()?.hideLoading();
      };

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { lifecycleAnnularChartRef };
    },
  });
</script>
