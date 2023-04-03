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

    <div :ref="setRef" :style="{ height, width }" v-for="item in itemList" :key="item"></div>
  </a-card>
  <!-- <img :src="item" alt="" srcset="" v-for="item in printList" /> -->

  <img :src="imageUrl" alt="" srcset="" />
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted, nextTick } from 'vue';
  import {
    Card as ACard,
    TypographyText as ATypographyText,
    Divider as ADivider,
  } from 'ant-design-vue';
  import printJS from 'print-js';

  import { useECharts } from '/@/hooks/web/useECharts';
  import { getLineData, baseOption } from './data';
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
    },
    components: {
      ACard,
      ATypographyText,
      ADivider,
    },
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);
      const { lineData, category } = getLineData;

      // const myecharts = echarts.init(chartRef.value as HTMLDivElement);

      const itemList = ref<number[]>([1, 2]);

      const echartsRef = ref<HTMLDivElement[]>([]);

      const printList = ref<string[]>([]);

      const imageUrl = ref('');

      const setRef = (el: HTMLDivElement): void => {
        echartsRef.value?.push(el);
      };

      function createBase64(ele) {
        let docEle = ele + ' canvas';
        let canvasFixed: any = document.querySelector(docEle), //获取图表元素
          canvasWidth = canvasFixed.width, //获取图表元素宽度
          canvasHeigth = canvasFixed.heigth, //获取图表元素高度
          canvas2D = canvasFixed.getContext('2d');

        canvas2D.drawImage(canvasFixed, canvasWidth, canvasHeigth);
        return canvasFixed.toDataURL();
      }

      function onPrint() {
        console.log('image list', printList.value);

        printJS({
          printable: printList.value,
          type: 'image',
          // type: 'pdf',
          // base64: true,
          header: 'Multiple Images',
          imageStyle: 'width:50%;margin-bottom:20px;',
        });
      }

      const generageEchartsDom = () => {
        echartsRef.value.forEach((item) => {
          const { setOptions, getInstance } = useECharts(item as any);

          const seriesOption = {
            legend: {
              data: ['line1'],
            },
            xAxis: { data: category },
            series: [
              {
                name: 'line1',
                type: 'line',
                smooth: true,
                showAllSymbol: 'auto',
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
              },
            ],
          };

          const mergedOptions = echarts.util.merge(seriesOption, baseOption);

          setOptions(mergedOptions);

          nextTick(() => {
            console.log(
              'getInstance()',
              getInstance()?.getDataURL({ type: 'png', backgroundColor: 'rgba(255, 255, 255, 1)' }),
            );
          });

          // decodeURIComponent(getInstance()?.getDataURL() as string)

          nextTick(() => {
            printList.value.push(
              getInstance()?.getDataURL({
                type: 'png',
                pixelRatio: 1.5,
                backgroundColor: 'rgba(255,255,255, 1)',
              }) as string,
            );
          });
        });
      };

      const onSetOptions = () => {
        const seriesOption = {
          legend: {
            data: ['line1'],
          },
          xAxis: { data: category },
          series: [
            {
              name: 'line1',
              type: 'line',
              smooth: true,
              showAllSymbol: 'auto',
              symbol: 'emptyCircle',
              symbolSize: 15,
              data: lineData,
            },
          ],
        };

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        setOptions(mergedOptions);
      };

      onMounted(() => {
        onSetOptions();

        generageEchartsDom();

        nextTick(() => {
          // imageUrl.value = getInstance()?.getDataURL({
          //   type: 'svg',
          //   backgroundColor: '#fff',
          //   // excludeComponents: ['dataZoom'],
          // }) as string;

          imageUrl.value = createBase64(chartRef.value);
        });
      });

      return { chartRef, itemList, setRef, onPrint, printList, imageUrl };
    },
  });
</script>
