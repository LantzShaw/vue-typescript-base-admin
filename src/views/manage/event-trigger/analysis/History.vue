<template>
  <a-card title="历史曲线" :bordered="false">
    <template #extra>
      <a-typography-text style="margin-right: 12px" strong type="secondary"
        >时间: {{ displayDate }}</a-typography-text
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
  import { defineComponent, PropType, ref, Ref, onMounted, watch } from 'vue';
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
        default: '400px',
      },
      ids: {
        // type: Array as PropType<string[] | number[]>,
        type: Array<string | number>,
        default: [],
      },
    },
    components: {
      ACard,
      ATypographyText,
      ADivider,
    },
    setup(props) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const lineData = ref<string[]>([]);
      const category = ref<string[]>([]);
      const legend = ref<string[]>([]);
      const displayDate = ref<string>('');

      const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

      // const itemList = ref<number[]>(Array.from({ length: props.ids.length }, (v, i) => i));
      const itemList = ref<number[]>([]);

      const echartsRef = ref<HTMLDivElement[]>([]);

      const printList = ref<string[]>([]);

      const getChartData = async () => {
        getInstance()?.showLoading();

        // TODO: 展示没有数据
        const response = await sensorHistoryData({
          ids: props.ids,
          // ids: [
          //   '1635874344712802304',
          //   '1635874345341816832',
          //   '1635874345002078208',
          //   '1635874345199472640',
          //   '1635874345271955456',
          //   '1635874345585217536',
          // ],
          // startDate: '2023-03-18 00:00:00',
          // endDate: '2023-03-19 00:00:00',
        });

        const { date = [], list = [] } = response;

        displayDate.value = date.length > 0 ? `${date[0]} ~ ${date[date.length - 1]}` : '--';

        category.value = date;
        // lineData.value = list;
        // legend.value = name;

        list.forEach((item, index) => {
          if (item) {
            legend.value.push(item?.name);
            lineData.value.push(item?.value);

            itemList.value.push(index);
          }
        });
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
          documentTitle: '嘉兴港区气体泄漏检测管理平台',
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
        echartsRef.value.forEach((item, index) => {
          const chart = echarts.init(item as HTMLDivElement, 'light', {
            renderer: 'canvas',
          });

          const seriesOption: any = {
            legend: {
              data: [],
            },
            xAxis: { data: category.value },
            series: [],
          };

          lineData.value.forEach((data) => {
            seriesOption.legend.data = [legend.value[index]];

            seriesOption.series.push({
              name: legend.value[index],
              type: 'line',
              smooth: true,
              showAllSymbol: 'auto',
              symbol: 'none',
              symbolSize: 15,
              data,
              // animation: false, // NOTE: 如果不设置该属性，折线、柱状等内容将失效, 也可以在最外层设置该属性
            });
          });

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
        const seriesOption: any = {
          legend: {
            data: legend.value,
          },
          xAxis: { data: category.value },
          series: [],
        };

        lineData.value.forEach((item, index) => {
          seriesOption.series.push({
            name: legend.value[index],
            type: 'line',
            smooth: true,
            showAllSymbol: 'auto',
            symbol: 'none',
            symbolSize: 15,
            data: item,
            // animation: false, // NOTE: 如果不设置该属性，折线、柱状等内容将失效, 也可以在最外层设置该属性
          });
        });

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        await setOptions(mergedOptions);

        getInstance()?.hideLoading();
      };

      watch(
        () => props.ids,
        async () => {
          await getChartData();
          onSetOptions();
          generageEchartsDom();
        },
      );

      onMounted(async () => {
        await getChartData();
        onSetOptions();
        generageEchartsDom();
      });

      return { chartRef, itemList, displayDate, setRef, onPrint, printList };
    },
  });
</script>
