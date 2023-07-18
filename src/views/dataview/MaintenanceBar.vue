<template>
  <div ref="gasBarChartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { PropType, Ref, defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { baseOption } from './data';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useUserStore } from '/@/store/modules/user';
  import echarts from '/@/utils/lib/echarts';

  import { statisticsMaintProcess } from '/@/api/dataview';
  import { usePermission } from '/@/hooks/web/usePermission';

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
      const xAxisList = ref<string[]>(['计划', '其他']);
      const chartData = ref<ChartData[]>([]);

      const userStore = useUserStore();
      const route = useRoute();

      const { hasPermission } = usePermission();

      const organizationId = ref<string | null>('');

      const { setOptions, getInstance } = useECharts(gasBarChartRef as Ref<HTMLDivElement>);

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

        try {
          const { dataList = [], xaxisList = [] } = await statisticsMaintProcess({
            organizationId: organizationId.value,
          });

          chartData.value = dataList;
          xAxisList.value = xaxisList;
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
            top: '12%',
            bottom: '4%',
            left: '3%',
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
            name: '类型',
            nameTextStyle: {
              color: '#fff',
            },
            type: 'category',
            data: xAxisList.value,
            axisLabel: {
              color: '#fff',
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#024d70',
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#024d70',
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#024d70',
              },
              symbol: ['none', 'arrow'],
            },
          },
          yAxis: {
            type: 'value',
            name: '数量(条)',
            nameTextStyle: {
              color: '#fff',
            },
            axisLabel: {
              color: '#fff',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#024d70',
              },
              symbol: ['none', 'arrow'],
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#024d70',
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#024d70',
              },
            },
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            formatter: function (params, _ticket, _callback) {
              let str =
                '<div style="color: #fff">' +
                params.name +
                '<br/>' +
                params.marker +
                ' ' +
                params.seriesName +
                ': ' +
                params.value +
                '条<br></div>';

              let res =
                `<div style=' border-radius: 8px; color:#0C525D;font-family: PingFang SC; background: #0C525D; padding: 16px; width: 156px;'>` +
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
