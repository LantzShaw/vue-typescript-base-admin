<template>
  <BasicModal
    width="90%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    title="预览"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    :centered="true"
  >
    <div style="height: auto; padding: 20px; background-color: #fff">
      <div style="text-align: right">
        <a-space>
          <a-button
            :loading="isButtonLoading"
            @click="exportAsPDF"
            postIcon="ant-design:save-filled"
            >保存为PDF</a-button
          >
          <a-button @click="onPrint" postIcon="ant-design:printer-filled">打印</a-button>
        </a-space>
      </div>

      <template v-if="isLoading">
        <div
          style="height: calc(100vh - 152px)"
          v-loading="isLoading"
          loading-tip="正在生成工单报告..."
        >
        </div>
      </template>

      <!-- 页面显示的工单报告 -->
      <template v-else>
        <div class="pl-24 pr-24 pt-2 text-lg tracking-2px h-376">
          <div class="text-right text-lg h-10 leading-10">
            <span class="mr-2">编号:</span>
            <span>{{ maintenanceInformation.id }}</span>
          </div>

          <div class="text-3xl text-center h-20 leading-20 tracking-2px">
            气体检测报警器技术服务工作单
          </div>
          <div class="text-right">
            <Barcode :data="maintenanceInformation.recordNo" />
          </div>

          <div class="text-lg h-12 leading-12">
            <span class="tracking-4px">甲 方</span>
            <span class="border-line">{{ maintenanceInformation.apReceiveName ?? '--' }}</span>
            <span>联 系 人</span>
            <span>: </span>
            <span class="border-line">
              {{ maintenanceInformation.accompanyUser }}、
              {{ maintenanceInformation.apReceiveContacts ?? '--' }}
            </span>
          </div>
          <div class="h-12 leading-10">
            <span class="tracking-4px">乙方根据</span>
            <span class="border-line">{{ maintenanceInformation.agreement ?? '--' }}</span>
            <span class="tracking-4px">对甲方气体检测报警器开展技术服务，具体内容如下：</span>

            <div>
              <span>服务类型</span>
              <span class="border-line">{{ maintenanceInformation.taskTypeDisplayName }}</span>
            </div>

            <div>
              <span>计划时间</span>
              <span class="border-line">{{ maintenanceInformation.startDate }}</span>
              <span>预计时长</span>
              <span class="border-line">{{ maintenanceInformation.duration }}</span>
              <span>天</span>
            </div>

            <div>
              <div>实施目标:</div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th v-for="column in sensorTableColumn" :key="column.key">
                        {{ column.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sensor, index) in sensorTableData" :key="sensor.id">
                      <td>{{ index + 1 }}</td>
                      <td>{{ sensor?.sensorName }}</td>
                      <td>{{ sensor.regionName }}</td>
                      <td>{{ sensor?.locationNo }}</td>
                      <td>{{ sensor?.specification ?? '--' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="h-12 leading-12 tracking-4px mt-20px">
              <span>备注说明:</span>
              <span class="ml-4">{{ maintenanceInformation.remark }}</span>
            </div>
            <div class="h-50 leading-50 flex">
              <div style="width: 50%">
                <span>实施人员: </span>
                <span>{{ maintenanceInformation.implementationUser }}</span>
              </div>
              <div>
                <span>陪同人员: </span>
                <span>{{ maintenanceInformation.accompanyUser }}</span>
              </div>
            </div>
            <div class="text-right"> 合约客户专用，一式两份，各执一份 </div>
          </div>
        </div>
      </template>

      <!-- 
        NOTE: 用于打印与PDF下载的DOM - 由于表格的数据不是固定的, 后期优化可以由后端去实现pdf的生成下载
       -->
      <div
        class="pl-24 pr-24 pt-2 text-lg tracking-2px"
        :style="{
          height: `${modalContentHeight}px`,
          display: `${display}`,
          background: '#fff',
          width: '1090px',
          boxSizing: 'border-box',
        }"
        ref="maintenanceReportRef"
        id="maintenanceReport"
      >
        <div class="text-right text-lg h-10 leading-10">
          <span class="mr-2">编号:</span>
          <span>{{ maintenanceInformation.id }}</span>
        </div>

        <div class="text-3xl text-center h-20 leading-20 tracking-2px">
          气体检测报警器技术服务工作单
        </div>
        <div class="text-right">
          <Barcode :data="maintenanceInformation.recordNo" />
        </div>

        <div class="text-lg h-12 leading-12">
          <span class="tracking-4px">甲 方</span>
          <span class="border-line">{{ maintenanceInformation.apReceiveName ?? '--' }}</span>
          <span>联 系 人</span>
          <span>: </span>
          <span class="border-line">
            {{ maintenanceInformation.accompanyUser }}
            {{ maintenanceInformation.apReceiveContacts ?? '--' }}
          </span>
        </div>
        <div class="h-12 leading-10">
          <span class="tracking-4px">乙方根据</span>
          <span class="border-line">{{ maintenanceInformation.agreement ?? '--' }}</span>
          <span class="tracking-4px">对甲方气体检测报警器开展技术服务，具体内容如下：</span>

          <div>
            <span>服务类型</span>
            <span class="border-line">{{ maintenanceInformation.taskTypeDisplayName }}</span>
          </div>

          <div>
            <span>计划时间</span>
            <span class="border-line">{{ maintenanceInformation.startDate }}</span>
            <span>预计时长</span>
            <span class="border-line">{{ maintenanceInformation.duration }}</span>
            <span>天</span>
          </div>

          <div>
            <div>实施目标:</div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th v-for="column in sensorTableColumn" :key="column.key">
                      {{ column.title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sensor, index) in firstPageTableData" :key="sensor.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ sensor?.sensorName }}</td>
                    <td>{{ sensor.regionName }}</td>
                    <td>{{ sensor?.locationNo }}</td>
                    <td>{{ sensor?.specification ?? '--' }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="perpage">
                <table
                  style="margin-top: 100px"
                  v-if="extraTableData.length > 0"
                  v-for="(item, index) in extraTableData"
                  :key="index"
                >
                  <thead>
                    <tr>
                      <th v-for="column in sensorTableColumn" :key="column.key">
                        {{ column.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sensor, indexs) in item" :key="sensor.id">
                      <td>{{ indexs + 1 + FIRST_PAGE_LIMIT_SIZE + index * LIMIT_PAGE_SIZE }}</td>
                      <td>{{ sensor?.sensorName }}</td>
                      <td>{{ sensor.regionName }}</td>
                      <td>{{ sensor?.locationNo }}</td>
                      <td>{{ sensor?.specification ?? '--' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="h-12 leading-12 tracking-4px mt-20px perpage">
            <span>备注说明:</span>
            <span class="ml-4">{{ maintenanceInformation.remark }}</span>
          </div>
          <div :style="{ marginTop: `${lastPageMargin}px` }">
            <div class="h-20 leading-20 flex">
              <div style="width: 50%">
                <span>实施人员: </span>
                <span>{{ maintenanceInformation.implementationUser }}</span>
              </div>
              <div>
                <span>陪同人员: </span>
                <span>{{ maintenanceInformation.accompanyUser }}</span>
              </div>
            </div>
            <div class="h-20 leading-20 text-right"> 合约客户专用，一式两份，各执一份 </div>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { Space as ASpace } from 'ant-design-vue';
  import { toPng, toCanvas } from 'html-to-image';
  import { jsPDF } from 'jspdf';
  import printJS from 'print-js';
  import { reactive, ref, unref } from 'vue';
  import Barcode from './components/Barcode.vue';
  import { workflowDeviceMaintSensorList } from '/@/api/biz/workflowDeviceMaintSensor';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // data
  import { idRef } from './equipmentMaintenanceRecord.data';
  import { onUnmounted } from 'vue';
  import { nextTick } from 'vue';

  // 第一页与最后一页之间的 即中间页表格数据（44条数据刚好沾满一页，所以默认设置为44条）
  const LIMIT_PAGE_SIZE: number = 45;
  const FIRST_PAGE_LIMIT_SIZE: number = 33; // 31

  type MaintenanceInformation = {
    id?: string; // 表单编号
    recordNo?: string; // 条形码编号
    remark?: string; // 备注说明
    taskTypeDisplayName?: string; // 任务类型
    implementationUser?: string; // 实施人员
    accompanyUser?: string; // 陪同人员
    startDate?: string; // 开始时间
    duration?: string; // 预计时长
    apReceiveName?: string; // 甲方公司名称
    agreement?: string; // 服务协议
    apReceiveContacts?: string; // 联系人
  };

  type Column = {
    key?: string;
    title?: string;
  };

  type SensorData = {
    id?: string;
    sensorName?: string;
    regionName?: string;
    locationNo?: string;
    specification?: string;
  };

  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const maintenanceReportRef = ref<HTMLDivElement | null>(null);
  const printTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const pdfTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const display = ref<String>('none');

  const sensorTableColumn: Column[] = [
    {
      key: '0',
      title: '序号',
    },
    {
      key: '1',
      title: '名称',
    },
    {
      key: '2',
      title: '区域/装置',
    },
    {
      key: '3',
      title: '位号',
    },
    {
      key: '4',
      title: '技术要求',
    },
  ];
  const sensorTableData = ref<SensorData[]>([]);
  const firstPageTableData = ref<SensorData[]>([]);
  const extraTableData = ref<SensorData[][]>([]);
  const lastPageTableData = ref<SensorData[]>([]);
  const limitPage = ref<number>(0);
  const modalContentHeight = ref<number>(0);
  const lastPageMargin = ref<number>(0);

  const maintenanceInformation = reactive<MaintenanceInformation>({});

  /**
   * 构建Drawer
   */
  const [registerModal] = useModalInner(async (data) => {
    idRef.value = data.record.id;

    await getDetail();
  });

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;
    const response = await equipmentMaintenanceRecordForm({ id: idRef.value });

    const data = await workflowDeviceMaintSensorList({ recordId: idRef.value });

    const {
      id,
      recordNo,
      accompanyUser,
      duration,
      remark,
      implementationUser,
      startDate,
      taskTypeDisplayName,
      apReceiveName,
      agreement,
      apReceiveContacts,
    } = response;

    maintenanceInformation.id = id;
    maintenanceInformation.recordNo = recordNo;
    maintenanceInformation.accompanyUser = accompanyUser;
    maintenanceInformation.duration = duration;
    maintenanceInformation.remark = remark;
    maintenanceInformation.implementationUser = implementationUser;
    maintenanceInformation.startDate = startDate;
    maintenanceInformation.taskTypeDisplayName = taskTypeDisplayName;
    maintenanceInformation.apReceiveName = apReceiveName;
    maintenanceInformation.agreement = agreement;
    maintenanceInformation.apReceiveContacts = apReceiveContacts;

    sensorTableData.value = data ?? [];

    // 第一页表格数据
    firstPageTableData.value = unref(sensorTableData).slice(0, FIRST_PAGE_LIMIT_SIZE);

    // 除去第一页33条表格数据后，剩下的表格数据还可以中间的页数
    limitPage.value = Math.ceil(
      (unref(sensorTableData).length - FIRST_PAGE_LIMIT_SIZE) / LIMIT_PAGE_SIZE,
    );

    // 计算中间页的表格数据，是一个二维数组
    extraTableData.value = [];
    for (let i = 0; i < limitPage.value; i++) {
      extraTableData.value.push(
        sensorTableData.value.slice(
          FIRST_PAGE_LIMIT_SIZE + i * LIMIT_PAGE_SIZE,
          FIRST_PAGE_LIMIT_SIZE + (i + 1) * LIMIT_PAGE_SIZE,
        ),
      );
    }

    // 计算最后一页的表格数据
    lastPageTableData.value = unref(sensorTableData).slice(
      limitPage.value * LIMIT_PAGE_SIZE + FIRST_PAGE_LIMIT_SIZE,
      sensorTableData.value.length,
    );

    // 根据第一页的表格数据长度，设置margin，让最后的的文字可以正常展示，而不会在打印或这生成pdf的时候被截取
    if (firstPageTableData.value.length > 0) {
      const firstPageTableDataLength = unref(firstPageTableData).length;

      if (firstPageTableDataLength >= 29 && firstPageTableDataLength < 32) {
        lastPageMargin.value = 140;
      } else if (firstPageTableDataLength === 32) {
        lastPageMargin.value = 80;
      } else {
        lastPageMargin.value = 0;
      }
    }

    // 根据最后一页的表格数据长度，设置margin，让最后的的文字可以正常展示，而不会在打印或这生成pdf的时候被截取
    if (extraTableData.value.length > 0) {
      const lastPageTableDataLength = unref(extraTableData)[extraTableData.value.length - 1].length;

      if (lastPageTableDataLength > 40 && lastPageTableDataLength <= 42) {
        lastPageMargin.value = 170;
      } else if (lastPageTableDataLength > 42 && lastPageTableDataLength < 45) {
        lastPageMargin.value = 100;
      } else if (lastPageTableDataLength === 45) {
        lastPageMargin.value = 40;
      } else {
        lastPageMargin.value = 0;
      }
    }

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    modalContentHeight.value = 0;

    display.value = 'block';

    (document.querySelector('#maintenanceReport') as HTMLElement).style.height = '300px';
    (document.querySelector('#maintenanceReport') as HTMLElement).style.display = 'block';

    modalContentHeight.value = maintenanceReportRef.value
      ? maintenanceReportRef.value.scrollHeight
      : 0;

    if (pdfTimer.value) clearTimeout(pdfTimer.value);

    pdfTimer.value = setTimeout(async () => {
      const canvas = await toCanvas(document.querySelector('#maintenanceReport') as HTMLElement);

      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = (contentWidth / 595.28) * 841.89; // 一页pdf显示html页面生成的canvas高度;
      let leftHeight = contentHeight; // 未生成pdf的html页面高度
      let position = 0; // pdf页面偏移
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      let imgWidth = 585.28; // 555.28
      let imgHeight = (555.28 / contentWidth) * contentHeight + 20; // NOTE:  这里可以调节图片高度
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'pt', 'a4');

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 4, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 4, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;

          // NOTE: 避免添加空白页 59
          if (leftHeight > 300) {
            pdf.addPage();
          }
        }
      }

      pdf.save('气体检测报警器技术服务工作单.pdf');

      display.value = 'none';

      (maintenanceReportRef.value as HTMLElement).style.display = 'none';

      isButtonLoading.value = false;
    }, 200);
  };

  /**
   * 打印 - 按钮事件
   */
  const onPrint = async () => {
    display.value = 'block';
    modalContentHeight.value = 0;

    // 由于高度是不确定的，这里需要初始化style.height，不然会出现问题
    (document.querySelector('#maintenanceReport') as HTMLElement).style.height = '300px';

    (document.querySelector('#maintenanceReport') as HTMLElement).style.display = 'block';

    modalContentHeight.value = maintenanceReportRef.value
      ? maintenanceReportRef.value.scrollHeight
      : 0;

    if (printTimer.value) clearTimeout(printTimer.value);

    printTimer.value = setTimeout(async () => {
      const dataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

      // NOTE: 去除页眉页脚
      // // const style =
      //   '@page {margin: 0,padding:0, size: A4, }; @page { margin-top: 0; }, @page { margin-bottom: 0; },@page { margin: 0; } ';

      // const style =
      //   '@page {size: A4; margin: 3mm; padding: 0; border: 0; height: 0;}; * {margin: 0; padding: 0; border: 0;} html{background-color: #ffffff;margin: 0; height: 0; }; body: {  border: 1px solid #fff;margin: 10mm 15mm 10mm 15mm;}';

      // const style =
      //   '@page {size: A4; margin: 3mm; height: 0; border: 0; padding: 0;} html {height: 0;margin:0; background-color: #fff};';

      // const style =
      //   ' html {height: 0;margin:0; background-color: #fff};';

      const style = ' body { margin: 0; background-color: #fff};'; // 有效
      // const style = ' html { height: 0; background-color: #fff};'; // 有效
      // const style = ' html { margin: 0; background-color: #fff};'; // 无效
      // const style = ' * { margin: 0; background-color: #fff};'; // 有效

      nextTick(() => {
        printJS({
          printable: dataUrl,
          type: 'image',
          documentTitle: '嘉兴港区气体泄漏检测管理平台',
          targetStyles: ['*'],
          scanStyles: true,
          style,
          imageStyle: 'width:100%;margin-top:0;margin-bottom:0;',
        });

        display.value = 'none';

        (maintenanceReportRef.value as HTMLElement).style.display = 'none';
      });
    }, 150);
  };

  onUnmounted(() => {
    if (printTimer.value) clearTimeout(printTimer.value);

    if (pdfTimer.value) clearTimeout(pdfTimer.value);
  });
</script>

<style lang="less" scoped>
  // * {
  //   padding: 0;
  //   margin: 0;
  // }

  // html,
  // body {
  //   // height: auto;
  //   margin: 0;
  //   padding: 0;
  // }

  table,
  td,
  th {
    padding: 0;
    border: 1px solid #000;
    text-align: center;
  }

  table {
    width: 100%;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
  }

  td {
    height: 32px;
    line-height: 32px;
  }

  .perpage {
    // page-break-before: always;
    page-break-after: always !important;

    // page-break-inside: avoid;
  }

  .border-line {
    margin-left: 10px;
    padding-right: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #000;
    font-weight: bold;
  }

  @media print {
    @page {
      size: A3 landscape;
    }
  }

  // @media print {
  //   // @page {
  //   //   size: auto; /* auto是初始值 */
  //   //   margin: 0mm !important; //解决打印多出一页空白页的问题
  //   // }

  //   @page {
  //     size: auto;
  //     margin: 0mm !important;
  //     border: 0mm !important;
  //     padding: 0mm !important;
  //   }

  //   html {
  //     background-color: #f40;
  //     margin: 0px !important;
  //     padding: 0 !important;
  //     border: 0 !important;
  //   }

  //   body {
  //     // border: solid px #ffffff;
  //     // margin: 10mm 15mm 10mm 15mm;
  //     padding: 0 !important;
  //     border: 0 !important;
  //     margin: 0 !important;
  //   }
  // }
</style>

<style media="print">
  @page  {
      size: auto;
      margin: 5mm;
  }

  html  {
      background-color: #ffffff;
      margin: 0px;
  }

  body  {
      height: auto;
      border: solid 1px #ffffff;
      margin: 10mm 2mm 10mm 2mm;
  }
</style>
