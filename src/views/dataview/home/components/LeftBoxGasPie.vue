<template>
  <div ref="gasPiechartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

  type PieData = {
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
      const gasPiechartRef = ref<HTMLDivElement | null>(null);
      const pieData = ref<PieData[]>([
        { value: 1048, name: '甲烷' },
        { value: 735, name: '氯化氢' },
        { value: 580, name: '环氧乙烷' },
        { value: 484, name: '氨气' },
        { value: 320, name: '硫化氢' },
        { value: 310, name: '二氧化氯' },
        { value: 350, name: '正乙烷' },
        { value: 360, name: '其他' },
      ]);

      const { setOptions, getInstance } = useECharts(gasPiechartRef as Ref<HTMLDivElement>);

      const getChartData = async () => {
        getInstance()?.showLoading();
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          series: [],
        };

        seriesOption.series.push({
          type: 'pie',
          right: '50',
          radius: ['40%', '65%'],
          data: pieData.value,
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
                console.log('params:', params);

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
        pieData.value.forEach((v, i) => {
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

      return { gasPiechartRef };
    },
  });
</script>
