<template>
  <div ref="eventTriggerPieChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { PropType, Ref, defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { baseOption } from './data';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useUserStore } from '/@/store/modules/user';
  import echarts from '/@/utils/lib/echarts';

  import { statisticsMaintProcess } from '/@/api/dataview';

  type ChartData = {
    name: string;
    value: number;
  };

  export default defineComponent({
    name: 'MaintenancePie',
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
      const eventTriggerPieChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<ChartData[]>([]);

      const userStore = useUserStore();
      const route = useRoute();

      const organizationId = ref<string>((route.query.id as string) ?? userStore.getOrganizationId);

      const { setOptions, getInstance } = useECharts(
        eventTriggerPieChartRef as Ref<HTMLDivElement>,
      );

      const getChartData = async () => {
        getInstance()?.showLoading({
          text: '加载中...',
          color: 'rgba(1, 167, 204, 1)',
          textColor: 'rgba(1, 167, 204, 1)',
          maskColor: '#05132c',
        });

        try {
          const response = await statisticsMaintProcess({ organizationId: organizationId.value });

          chartData.value = response;
        } catch (error) {
          console.log(error);
        }
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption: any = {
          legend: {
            icon: 'circle',
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            align: 'left',
            textStyle: {
              color: '#fff',
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

      return { eventTriggerPieChartRef };
    },
  });
</script>
