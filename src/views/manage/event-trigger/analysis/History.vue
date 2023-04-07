<template>
  <a-card title="历史曲线" :bordered="false">
    <template #extra>
      <a-typography-text style="margin-right: 12px" strong type="secondary"
        >时间: 2023-03-18 12:00:00</a-typography-text
      >
      <a-divider type="vertical" style="background-color: #ddd" />
      <a-button @click="onPrint" type="link" postIcon="ant-design:printer-outlined">
        打印
      </a-button>
    </template>
    <div ref="chartRef" :style="{ height, width }"></div>

    <div
      :ref="setRef"
      :style="{ height: '300px', width: '800px', display: 'none' }"
      v-for="item in itemList"
      :key="item"
    ></div>
  </a-card>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted } from 'vue';
  import {
    Card as ACard,
    TypographyText as ATypographyText,
    Divider as ADivider,
  } from 'ant-design-vue';
  import printJS from 'print-js';

  import { sensorHistoryData } from '/@/api/manage/sensor';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { baseOption } from './data';
  import echarts from '/@/utils/lib/echarts';

  export default defineComponent({
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: 'calc(100vh - 78px)',
      },
      id: {
        type: String as PropType<string>,
      },
    },
    components: {
      ACard,
      ATypographyText,
      ADivider,
    },
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const lineData = ref<string[]>([]);
      const category = ref<string[]>([]);
      const legend = ref<string[]>([]);

      const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

      const itemList = ref<number[]>([1, 2, 3, 4]);

      const echartsRef = ref<HTMLDivElement[]>([]);

      const printList = ref<string[]>([]);

      const getChartData = async () => {
        getInstance()?.showLoading();

        const response = await sensorHistoryData({
          // id: props.id,
          // startDate: '2023-03-18 00:00:00',
          // endDate: '2023-03-19 00:00:00',
        });

        const { date, value, name } = response;

        lineData.value = value;
        category.value = date;
        legend.value = name;
      };

      /**
       * 设置ref数组
       */
      const setRef = (el: HTMLDivElement): void => {
        echartsRef.value?.push(el);
      };

      /**
       * 打印 - 按钮事件
       */
      const onPrint = () => {
        // NOTE: 去除页眉页脚
        // const style = '@page {margin:0 20mm};';

        printJS({
          printable: printList.value,
          type: 'image',
          documentTitle: '大衡精密仪器设备管理平台',
          header: '历史曲线',
          // targetStyles: ['*'],
          // style,
          imageStyle: 'width:100%;margin-bottom:20px;',
        });
      };

      /**
       * 动态生成 echarts初始化依赖的DOM，并绘制图表，生成图片URL数据
       */
      const generageEchartsDom = () => {
        echartsRef.value.forEach((item) => {
          const chart = echarts.init(item as HTMLDivElement, 'light', {
            renderer: 'canvas',
          });

          const seriesOption = {
            legend: {
              data: [legend.value],
            },
            xAxis: { data: category.value },
            series: [
              {
                name: legend.value,
                type: 'line',
                smooth: true,
                showAllSymbol: 'auto',
                symbol: 'none',
                symbolSize: 15,
                data: lineData.value,
                animation: false,
              },
            ],
          };

          const mergedOptions = echarts.util.merge(seriesOption, baseOption);

          chart.setOption(mergedOptions);

          printList.value.push(
            chart.getDataURL({
              type: 'png',
              backgroundColor: '#fff',
              excludeComponents: ['dataZoom'],
            }) as string,
          );
        });
      };

      /**
       * 设置echarts option
       */
      const onSetOptions = async () => {
        const seriesOption = {
          legend: {
            data: [legend.value],
          },
          xAxis: { data: category.value },
          series: [
            {
              name: legend.value,
              type: 'line',
              smooth: true,
              showAllSymbol: 'auto',
              symbol: 'none',
              symbolSize: 15,
              data: lineData.value,
              // animation: false, // NOTE: 如果不设置该属性，折线、柱状等内容将失效, 也可以在最外层设置该属性
            },
          ],
        };

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      onMounted(async () => {
        await getChartData();
        onSetOptions();
        generageEchartsDom();
      });

      return { chartRef, itemList, setRef, onPrint, printList };
    },
  });
</script>
