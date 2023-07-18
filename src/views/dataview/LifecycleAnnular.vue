<template>
  <div style="position: relative">
    <div ref="lifecycleAnnularChartRef" :style="{ height, width }"></div>
    <div style="position: absolute; height: 200px; width: 120px; right: 20px; top: 50px">
      <LifecycleAnnularLegend
        v-for="item in legendDataList"
        :name="item.name"
        :display-value="item.displayValue"
        :color="item.color"
        :key="item.id"
      />
    </div>
  </div>
</template>
<script lang="ts">
  import { PropType, Ref, defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';

  import { statisticsLifeCycle } from '/@/api/dataview';

  import LifecycleAnnularLegend from './LifecycleAnnularLegend.vue';

  import annular_icon from '/@/assets/images/dataview/annular_icon.png';

  type ChartData = {
    name: string;
    value: number;
    percent: string;
  };

  type LegendData = {
    id?: string;
    name?: string;
    color?: string;
    displayValue?: number;
  };

  export default defineComponent({
    name: 'LifecycleAnnular',
    components: {
      LifecycleAnnularLegend,
    },
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
    setup() {
      const userStore = useUserStore();
      const route = useRoute();
      const { hasPermission } = usePermission();

      const organizationId = ref<string | null>('');

      const lifecycleAnnularChartRef = ref<HTMLDivElement | null>(null);
      const chartData = ref<ChartData[]>([]);
      const legendDataList = ref<LegendData[]>([]);

      const color = ['#2D6DEA', '#DECF38', '#00BCBB', '#CAC9C9'];

      let arrName: any = [];
      let arrValue: any = [];
      let sum = 0;
      let lineYAxis: any = [];

      const { setOptions, getInstance } = useECharts(
        lifecycleAnnularChartRef as Ref<HTMLDivElement>,
      );

      // NOTE: organizationId传null - 表示维护方、监管方查所有数据， 否则查对应id的数据
      if (
        !route.query.id &&
        (hasPermission('biz:whf:privileges') || hasPermission('biz:jgf:privileges'))
      ) {
        organizationId.value = null;
      } else {
        organizationId.value = userStore.getOrganizationId;
      }

      const getChartData = async () => {
        getInstance()?.showLoading({
          text: '加载中...',
          color: 'rgba(1, 167, 204, 1)',
          textColor: 'rgba(1, 167, 204, 1)',
          maskColor: '#05132c',
        });

        const response = await statisticsLifeCycle({ organizationId: organizationId.value });

        legendDataList.value = response.map((item, index) => {
          return {
            id: index,
            name: item.name,
            color: color[index],
            displayValue: item.value,
          };
        });

        chartData.value = response;

        // 数据处理
        chartData.value.forEach((v) => {
          arrName.push(v.name);
          arrValue.push(v.value);
          sum = sum + v.value;
        });
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const chartOption: any = {
          grid: {
            top: '10%',
            bottom: '60%',
            left: '35%',
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
                left: '30%',
                top: '40%',
              },
            ],
          },
          legend: {
            show: false,
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

                  return '{circle|●}{bd|}{value|' + item.name + '}';
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
            center: ['35%', '45%'],
            label: {
              show: false,
            },
            data: [
              {
                value: v.value,
                name: v.name,
              },
              {
                value: sum + 50 - v.value,
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
            // maxAngle: 100,
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
            clockWise: false, // 顺时加载
            hoverAnimation: false, // 鼠标移入变大
            radius: [62 - i * 15 + '%', 60 - i * 15 + '%'],
            center: ['35%', '45%'],
            label: {
              show: false,
            },
            data: [
              {
                value: 7.5,
                itemStyle: {
                  color: '#282B4E',
                },
              },
              {
                value: 2.5,
                // value: 25,
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

        await setOptions(chartOption);

        getInstance()?.hideLoading();
      };

      onMounted(async () => {
        await getChartData();

        onSetOptions();
      });

      return { lifecycleAnnularChartRef, legendDataList };
    },
  });
</script>
