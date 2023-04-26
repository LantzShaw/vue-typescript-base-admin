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
    <div style="background-color: #fff; height: auto; padding: 20px">
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
        <div class="pl-24 pr-24 pt-2 text-lg tracking-2px h-240" id="maintenanceReport">
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
            <span class="border-line">{{ maintenanceInformation.apReceiveContacts ?? '--' }}</span>
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
                      <td>{{ index }}</td>
                      <td>{{ sensor?.sensorName }}</td>
                      <td>{{ sensor.regionName }}</td>
                      <td>--</td>
                      <td>全部是可燃气体</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="h-12 leading-12 tracking-4px">
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
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { toPng } from 'html-to-image';
  import printJS from 'print-js';
  import { jsPDF } from 'jspdf';
  import { onMounted, reactive, ref } from 'vue';
  import { Space as ASpace } from 'ant-design-vue';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Barcode from './Barcode.vue';

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
  };

  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

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

  const props = defineProps({
    id: String,
  });

  const maintenanceInformation = reactive<MaintenanceInformation>({});

  /**
   * 构建Drawer
   */
  const [registerModal] = useModalInner(async (data) => {
    await getDetail();
  });

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;
    const response = await equipmentMaintenanceRecordForm({ id: props.id });

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
      sensors,
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

    sensorTableData.value = sensors;

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    const doc = new jsPDF();

    const pageDataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

    doc.addImage(pageDataUrl, 'png', 6, 6, 198, 160);

    doc.save('气体检测报警器技术服务工作单.pdf');

    isButtonLoading.value = false;
  };

  /**
   * 打印 - 按钮事件
   */
  const onPrint = () => {
    toPng(document.querySelector('#maintenanceReport') as HTMLElement).then((dataUrl) => {
      // NOTE: 去除页眉页脚
      const style = '@page {margin:0 20mm,padding:0};';

      printJS({
        printable: dataUrl,
        type: 'image',
        documentTitle: '嘉兴港区气体泄漏检测管理平台',
        targetStyles: ['*'],
        style,
        imageStyle: 'width:100%;margin-bottom:20px;',
      });
    });
  };

  onMounted(() => {
    getDetail();
  });
</script>

<style lang="less" scoped>
  body {
    margin: 0;
    height: auto;
  }

  table,
  td,
  th {
    border: 1px solid #000;
    text-align: center;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    padding: 0;
    margin: 0;
  }

  td {
    height: 32px;
    line-height: 32px;
  }

  .perpage {
    page-break-after: always;
  }

  .border-line {
    border-bottom: 1px solid #000;
    padding-right: 60px;
    padding-left: 60px;
    margin-left: 10px;
    font-weight: bold;
  }
</style>
