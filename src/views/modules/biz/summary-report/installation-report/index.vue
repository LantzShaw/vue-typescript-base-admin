<template>
  <PageWrapper
    dense
    title="报警器安装情况明细表"
    contentFullHeight
    :contentBackground="false"
    @back="goBack"
  >
    <div class="leading-10 pl-10 pt-4 bg-white m-2">
      <div class="pl-4 pr-10 flex" style="justify-content: space-between">
        <div>
          <span class="font-bold mr-4 prefix">操作时间: </span>
          <a-space>
            <a-range-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model:value="params" />
            <a-button type="primary" @click="clickHandler">查询</a-button>
          </a-space>
        </div>
        <div>
          <a-button
            :loading="isExcelExportLoading"
            v-auth="'manage:summary:export'"
            preIcon="ant-design:download-outlined"
            @click="handleExport"
          >
            导出Excel
          </a-button>
        </div>
      </div>

      <a-spin :spinning="isLoading">
        <div class="p-10">
          <div class="h-10 leading-10 text-center text-lg font-bold">报警器安装情况明细表</div>
          <table>
            <thead>
              <tr>
                <th style="width: 300px" v-for="item in header">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="items in tableData">
                <td v-for="item in items">{{ item }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </a-spin>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { RangePicker as ARangePicker, Space as ASpace, Spin as ASpin } from 'ant-design-vue';
  import { jsPDF } from 'jspdf';
  import autoTable from 'jspdf-autotable';
  import { defineComponent, onMounted, ref } from 'vue';

  // import { myFont } from '/@/assets/fonts/ZiTiQuanWeiJunHei-W2-2-normal';

  // 组件
  import { PageWrapper } from '/@/components/Page';

  // 接口
  import { installationReportPage } from '/@/api/manage/summaryReport';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { useRoute } from 'vue-router';
  import {
    alarmStatusOptions,
    deleteStatusOptions,
    onlineStatusOptions,
    sensorTypeOptions,
  } from './installationReport.data';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';

  const isExcelExportLoading = ref<boolean>(false);
  const isPdfExportLoading = ref<boolean>(false);
  const tableRef = ref<Element | null>(null);

  const tableData = ref<any>([]);
  const header = ref<any>([]);
  const isLoading = ref<boolean>(false);

  const route = useRoute();
  const go = useGo();
  const { closeCurrent } = useTabs();

  const params = ref<[string, string] | undefined>([
    route?.query?.startDate as string,
    route?.query?.endDate as string,
  ]);

  /**
   * 返回报表总览页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/summary/report/list');
  }

  /**
   * 时间查询
   */
  function clickHandler() {
    getList();
  }

  /**
   * 导出
   */
  function handleExport() {
    isExcelExportLoading.value = true;

    // let tableData: any = getDataSource().map((item) => {
    //   return [
    //     item.organizationName,
    //     item.dtuipTriggerDate,
    //     '--',
    //     '--',
    //     item.eventStatus === '0' ? '待处理' : item.eventStatus === '1' ? '进行中' : '已完成',
    //   ];
    // });
    // const header = getColumns().map((column) => column.title);

    // header.pop();

    // tableData = [...header, ...tableData];

    aoaToSheetXlsx({
      data: tableData.value,
      header: header.value,
      filename: `报警器安装情况明细表_${new Date().getTime()}.xlsx`,
    });

    isExcelExportLoading.value = false;
  }

  /**
   * 导出PDF
   */
  function handlePdfExport() {
    isPdfExportLoading.value = true;

    console.log('--------columns-------------', tableRef.value);

    // const columns = getColumns().map((column) => column.title);

    // const rows = getDataSource().map((item) => {
    //   return [item.sensorName];
    // });

    // console.log('---------rows---------', rows);

    const doc = new jsPDF('p', 'pt');

    // 设置中文字体
    //  doc.addFileToVFS('myFont.ttf', myFont);
    // doc.addFont('myFont.ttf', 'myFont', 'normal');
    // doc.setFont('myFont');

    // NOTE: 方式一
    // doc.autoTable(columns, rows, {
    //   addPageContent: function (data) {
    //     doc.text('This is header', 40, 30);
    //   },
    // });

    // NOTE: 方式二
    autoTable(doc, { html: `table` });

    // const res = doc.autoTableHtmlToJson(document.getElementById('indexTable'));
    // // 设置中文字体
    // doc.addFileToVFS('myFont.ttf', font);
    // doc.addFont('myFont.ttf', 'font', 'normal');
    // doc.setFont('font');

    // autoTable(doc, {
    //   styles: {
    //     //设置表格的字体，不然表格中文也乱码
    //     fillColor: [255, 255, 255],
    //     font: 'myFont',
    //     textColor: [0, 0, 0],
    //     halign: 'left',
    //     fontSize: 12,
    //   },
    //   headStyles: { lineWidth: 1, halign: 'center' },
    //   columnStyles: {
    //     0: { valign: 'middle', cellWidth: 50 },
    //     1: { valign: 'middle', cellWidth: 50 },
    //     2: { valign: 'middle' },
    //     3: { valign: 'middle', cellWidth: 200 },
    //     4: { valign: 'middle', minCellWidth: 30 }, // 第4列居中,宽度最小30
    //   },
    //   theme: 'grid', // 主题
    //   startY: 80, // 距离上边的距离
    //   margin: 20, // 距离左右边的距离
    //   body: res.data, // 表格内容
    //   columns: [
    //     // 表头
    //     { header: '类', dataKey: 'lei' },
    //     { header: '指标', dataKey: 'zhibiao' },
    //     { header: '要点及要素', dataKey: 'yaosu' },
    //     { header: '大数据计分方案', dataKey: 'fangan' },
    //     { header: '得分', dataKey: 'defen' },
    //   ],
    // });

    // const pageWidth = doc.getPageWidth(); // A4纸:595.28
    // const x1 = (pageWidth - doc.getTextWidth(indexTitle)) / 2;
    // doc.text(x1, 40, indexTitle); // x坐标,y坐标,文字
    // doc.setFontSize(12); // 设置文字大小,下一行起有效
    // doc.text(20, 60, `总分:${score}`);

    doc.save(`-大数据指数.pdf`);

    isPdfExportLoading.value = false;
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
  }

  async function getList() {
    isLoading.value = true;

    try {
      const response = await installationReportPage({
        startDate: params.value?.[0],
        endDate: params.value?.[1],
      });

      if (response) {
        const { list = [], texts = [] } = response;

        const tailRow: Array<string | number> = ['列统计总数量(个)'];

        const tempArr: number[][] = [];

        header.value = ['使用单位', ...texts, '行统计数量(个)'];

        tableData.value = list.map((item, index) => {
          const formatValues: number[] = item.value.map(Number);

          // 行统计数量
          const values: number[] = [...formatValues, sum(formatValues)];

          tempArr.push(values);

          return [item.name, ...values];
        });

        // 设置列统计数量
        for (let i = 0; i < header.value.length - 1; i++) {
          let total = 0;

          tempArr.forEach((item, index) => {
            total += +item[i];
          });

          tailRow.push(total);
        }

        tableData.value.push(tailRow);
      }
    } catch (e) {
      console.error(e);
    }

    isLoading.value = false;
  }

  /**
   * 求和
   *
   *  @param arr
   */
  function sum(arr: number[]) {
    return arr.reduce(function (prev, curr) {
      return +prev + curr;
    }, 0);
  }

  onMounted(() => {
    initDict();
    getList();
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportInstallationReportPage',
  });
</script>
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }

  body {
    height: auto;
    margin: 0;
  }

  table,
  td,
  th {
    padding: 0;
    border: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #eee;
  }

  table {
    width: 100%;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
  }

  td {
    height: 40px;
    padding-left: 4px;
    line-height: 40px;
  }

  .perpage {
    page-break-after: always;
  }

  .border-line {
    padding-right: 10px;
    padding-left: 4px;
    border-bottom: 1px solid #000;
    font-weight: bold;
  }
</style>
