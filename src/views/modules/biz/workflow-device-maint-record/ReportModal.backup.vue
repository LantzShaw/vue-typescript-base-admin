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

      <template v-else>
        <!-- :style="{ height: `${modalContentHeight}px` }" -->
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

                <!-- <div class="perpage">
                  <table
                    style="margin-top: 80px"
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
                        <td>{{ indexs + 32 + index * LIMIT_PAGE_SIZE }}</td>
                        <td>{{ sensor?.sensorName }}</td>
                        <td>{{ sensor.regionName }}</td>
                        <td>{{ sensor?.locationNo }}</td>
                        <td>{{ sensor?.specification ?? '--' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="perpage">
                  <table style="margin-top: 80px" v-if="lastPageTableData.length > 0">
                    <thead>
                      <tr>
                        <th v-for="column in sensorTableColumn" :key="column.key">
                          {{ column.title }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(sensor, indexs) in lastPageTableData" :key="sensor.id">
                        <td>{{ indexs + 1 + limitPage * LIMIT_PAGE_SIZE }}</td>
                        <td>{{ sensor?.sensorName }}</td>
                        <td>{{ sensor.regionName }}</td>
                        <td>{{ sensor?.locationNo }}</td>
                        <td>{{ sensor?.specification ?? '--' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div> -->
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

      <div
        :style="{ height: `${modalContentHeight}px`, display: `${display}`, background: '#fff' }"
        class="pl-24 pr-24 pt-2 text-lg tracking-2px"
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
                  <tr v-for="(sensor, index) in pageLimitTableData" :key="sensor.id">
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
                      <td>{{ indexs + 32 + index * LIMIT_PAGE_SIZE }}</td>
                      <td>{{ sensor?.sensorName }}</td>
                      <td>{{ sensor.regionName }}</td>
                      <td>{{ sensor?.locationNo }}</td>
                      <td>{{ sensor?.specification ?? '--' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="perpage">
                <table style="margin-top: 80px" v-if="lastPageTableData.length > 0">
                  <thead>
                    <tr>
                      <th v-for="column in sensorTableColumn" :key="column.key">
                        {{ column.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sensor, indexs) in lastPageTableData" :key="sensor.id">
                      <td>{{ indexs + 1 + limitPage * LIMIT_PAGE_SIZE }}</td>
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
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { Space as ASpace } from 'ant-design-vue';
  import { toPng, toCanvas } from 'html-to-image';
  import { jsPDF } from 'jspdf';
  import printJS from 'print-js';
  import { reactive, ref, computed, unref } from 'vue';
  import Barcode from './components/Barcode.vue';
  import { workflowDeviceMaintSensorList } from '/@/api/biz/workflowDeviceMaintSensor';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // data
  import { idRef } from './equipmentMaintenanceRecord.data';

  const LIMIT_PAGE_SIZE: number = 44;

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
  const pageLimitTableData = ref<SensorData[]>([]);
  const extraTableData = ref<SensorData[][]>([]);
  const lastPageTableData = ref<SensorData[]>([]);
  const limitPage = ref<number>(0);
  const modalContentHeight = ref<number>(0);

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

    pageLimitTableData.value = unref(sensorTableData).slice(0, 31);

    limitPage.value = Math.ceil((unref(sensorTableData).length - 31) / LIMIT_PAGE_SIZE);

    extraTableData.value = [];

    for (let i = 0; i < limitPage.value; i++) {
      extraTableData.value.push(
        sensorTableData.value.slice(31 + i * LIMIT_PAGE_SIZE, 31 + (i + 1) * LIMIT_PAGE_SIZE),
      );
    }

    lastPageTableData.value = unref(sensorTableData).slice(
      limitPage.value * LIMIT_PAGE_SIZE + 31,
      sensorTableData.value.length,
    );

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    modalContentHeight.value = 0;

    display.value = 'block';

    (document.querySelector('#maintenanceReport') as HTMLElement).style.display = 'block';

    if (maintenanceReportRef.value) {
      console.log('height', maintenanceReportRef.value.scrollHeight);
    }

    modalContentHeight.value = maintenanceReportRef.value
      ? maintenanceReportRef.value.scrollHeight
      : 0;

    const doc = new jsPDF();

    // let [imgX, imgY] = [595.28, 841.89];

    // setTimeout(async () => {
    //   const pageDataUrl = await toCanvas(
    //     document.querySelector('#maintenanceReport') as HTMLElement,
    //   );
    //   // const pageDataUrl = await toPng(maintenanceReportRef.value as HTMLElement); // 由于display为none,所以这里不能id，不然获取不到dom

    //   console.log(pageDataUrl?.height);

    //   // let imgHeight = imgX / (pageDataUrl.width / pageDataUrl?.height); //根据宽度计算高度

    //   // doc.addImage(pageDataUrl, 'png', 0, 0, imgX, 160);

    //   doc.addImage(pageDataUrl, 'png', 10, 6, 180, 240);

    //   doc.save('气体检测报警器技术服务工作单.pdf');

    //   isButtonLoading.value = false;
    // }, 200);

    setTimeout(async () => {
      let canvas: any = null;

      canvas = await toCanvas(document.querySelector('#maintenanceReport') as HTMLElement);
      // const pageDataUrl = await toPng(maintenanceReportRef.value as HTMLElement); // 由于display为none,所以这里不能id，不然获取不到dom

      console.log(canvas?.height);
      console.log(canvas);

      // let imgHeight = imgX / (pageDataUrl.width / pageDataUrl?.height); //根据宽度计算高度

      // doc.addImage(pageDataUrl, 'png', 0, 0, imgX, 160);

      // doc.addImage(canvas, 'png', 10, 6, 180, 240);

      var contentWidth = canvas.width;
      var contentHeight = canvas.height;
      var pageHeight = (contentWidth / 595.28) * 841.89; //一页pdf显示html页面生成的canvas高度;
      var leftHeight = contentHeight; //未生成pdf的html页面高度
      var position = 0; //pdf页面偏移
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 585.28; // 555.28
      var imgHeight = (555.28 / contentWidth) * contentHeight + 110;
      var pageData = canvas.toDataURL('image/jpeg', 1.0);
      var pdf = new jsPDF('p', 'pt', 'a4');
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
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

    (document.querySelector('#maintenanceReport') as HTMLElement).style.height = '300px';

    (document.querySelector('#maintenanceReport') as HTMLElement).style.display = 'block';

    modalContentHeight.value = maintenanceReportRef.value
      ? maintenanceReportRef.value.scrollHeight
      : 0;

    if (printTimer.value) clearTimeout(printTimer.value);

    printTimer.value = setTimeout(async () => {
      const dataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

      // NOTE: 去除页眉页脚
      const style = '@page {margin:0 20mm,padding:0};';

      printJS({
        printable: dataUrl,
        type: 'image',
        documentTitle: '嘉兴港区气体泄漏检测管理平台',
        targetStyles: ['*'],
        style,
        imageStyle: 'width:100%;margin-top:20px;margin-bottom:20px;',
      });

      display.value = 'none';

      (maintenanceReportRef.value as HTMLElement).style.display = 'none';
    }, 150);
  };
</script>

<style lang="less" scoped>
  body {
    height: auto;
    margin: 0;
  }

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

  // .perpage {
  //   // page-break-before: always;
  //   page-break-after: always !important;
  // }

  .border-line {
    margin-left: 10px;
    padding-right: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #000;
    font-weight: bold;
    // font-size: 18px;
  }
</style>
