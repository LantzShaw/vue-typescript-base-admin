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

    <!-- <div ref="card" :style="{ height, width, background: '#f40' }"></div> -->
    <div ref="chartRef" :style="{ height, width }"></div>

    <div
      :ref="setRef"
      :style="{ height: '300px', width: '800px', display: 'none' }"
      v-for="item in itemList"
      :key="item"
    ></div>
  </a-card>
  <!-- <img :src="item" alt="" srcset="" v-for="item in printList" /> -->
  <!-- <img :src="imageUrl" alt="" srcset="" /> -->
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, Ref, onMounted, nextTick } from 'vue';
  import {
    Card as ACard,
    TypographyText as ATypographyText,
    Divider as ADivider,
  } from 'ant-design-vue';
  import printJS from 'print-js';
  import html2canvas from 'html2canvas';

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
      const chart = ref<HTMLDivElement | null>(null);
      const card = ref<HTMLDivElement | null>(null);

      const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);
      const { lineData, category } = getLineData;

      const itemList = ref<number[]>([1, 2, 3, 4]);

      const echartsRef = ref<HTMLDivElement[]>([]);

      const printList = ref<string[]>([]);

      const imageUrl = ref('');

      const setRef = (el: HTMLDivElement): void => {
        echartsRef.value?.push(el);
      };

      const canvasToImage = () => {
        console.log('chartRef.value', card.value);

        html2canvas(card.value as any).then(function (canvas) {
          var img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

          console.log('--------card image-------', img);

          imageUrl.value = img;

          // 创建a标签，实现下载
          // var creatIMg = document.createElement('a');
          // creatIMg.download = '图表.png'; // 设置下载的文件名，
          // creatIMg.href = img; // 下载url
          // document.body.appendChild(creatIMg);
          // creatIMg.click();
          // creatIMg.remove(); // 下载之后把创建的元素删除
        });
      };

      function createBase64(ele) {
        // let docEle = ele + ' canvas';
        let canvasFixed: any = document.querySelector('#chartID'); //获取图表元素
        let canvasWidth = '100%'; //获取图表元素宽度
        let canvasHeigth = '100%'; //获取图表元素高度
        console.log(canvasFixed);

        let canvas2D = canvasFixed.getContext('2d');

        canvas2D.drawImage(canvasFixed, canvasWidth, canvasHeigth);
        return canvasFixed.toDataURL();
      }

      function onPrint() {
        console.log('image list', printList.value);

        printJS({
          printable: printList.value,
          // printable: imageUrl.value,

          type: 'image',
          // type: 'pdf',
          // base64: true,
          header: 'Multiple Images',
          imageStyle: 'width:100%;margin-bottom:20px;',
        });
      }

      const generageEchartsDom = () => {
        echartsRef.value.forEach((item) => {
          // TODO: 使用useEcharts 打印的是空白的
          // const { setOptions, getInstance } = useECharts(item as any);
          const chart = echarts.init(item as HTMLDivElement, 'light', {
            renderer: 'canvas',
          });

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
                animation: false,
              },
            ],
          };

          const mergedOptions = echarts.util.merge(seriesOption, baseOption);

          // setOptions(mergedOptions);

          chart.setOption(mergedOptions);

          // nextTick(() => {
          //   console.log(
          //     'getInstance()',
          //     getInstance()?.getDataURL({ type: 'png', backgroundColor: 'rgba(255, 255, 255, 1)' }),
          //   );
          // });

          // decodeURIComponent(getInstance()?.getDataURL() as string)

          printList.value.push(
            chart.getDataURL({
              type: 'png',
              // pixelRatio: 1.5,
              backgroundColor: 'rgba(255,255,255, 1)',
              excludeComponents: ['dataZoom'],
            }) as string,
          );

          nextTick(() => {
            // printList.value.push(
            //   getInstance()?.getDataURL({
            //     type: 'png',
            //     pixelRatio: 1.5,
            //     backgroundColor: 'rgba(255,255,255, 1)',
            //   }) as string,
            // );
          });
        });
      };

      const onSetOptions = () => {
        console.log('---------my--------', chart.value);

        // const myecharts = echarts.init(card.value as HTMLDivElement, 'light', {
        //   renderer: 'canvas',
        // });

        const seriesOption = {
          legend: {
            data: ['line1'],
          },
          xAxis: { data: category },
          series: [
            {
              name: 'line1',
              type: 'bar',
              smooth: true,
              showAllSymbol: 'auto',
              symbol: 'emptyCircle',
              symbolSize: 15,
              data: lineData,
              // animation: false, // NOTE: 如果不设置该属性，折线、柱状等内容将失效, 也可以在最外层设置该属性
            },
          ],
        };

        const mergedOptions = echarts.util.merge(seriesOption, baseOption);

        console.log('step 1');
        setOptions(mergedOptions);
        console.log('step 3');

        // myecharts.setOption(mergedOptions);

        // canvasToImage();
        console.log('step 4');

        // imageUrl.value = getInstance()?.getDataURL({
        //   type: 'png',
        //   backgroundColor: '#fff',
        //   // excludeComponents: ['dataZoom'],
        // }) as string;

        // nextTick(() => {
        //   imageUrl.value = myecharts.getDataURL({
        //     type: 'png',
        //     backgroundColor: '#fff',
        //   });
        // });
      };

      onMounted(() => {
        console.log('step 2');

        nextTick(() => {
          onSetOptions();

          generageEchartsDom();

          // canvasToImage();
          // imageUrl.value = createBase64('ddd');

          // canvasToImage();
        });
      });

      return { chartRef, itemList, setRef, onPrint, printList, imageUrl, card };
    },
  });
</script>
