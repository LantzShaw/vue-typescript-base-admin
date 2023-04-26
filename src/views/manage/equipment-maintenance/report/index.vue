<template>
  <div style="background-color: #fff; height: auto; padding: 20px">
    <div style="text-align: right">
      <a-space>
        <a-button :loading="isButtonLoading" @click="exportAsPDF" postIcon="ant-design:save-filled"
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
      <div class="pl-44 pr-44 pt-2 text-lg tracking-3px h-160" id="maintenanceReport">
        <div class="text-3xl text-center h-20 leading-20 tracking-2px"> 标定检查情况反馈报告 </div>
        <div class="text-lg h-12 leading-12">
          <span class="border-line">{{ maintenanceInformation.apReceiveName ?? '--' }}</span>
          <span>：</span>
        </div>
        <div class="h-12 leading-10">
          <span class="tracking-4px">&nbsp;&nbsp;&nbsp;&nbsp;乙方根据</span>
          <span class="border-line">{{ maintenanceInformation.agreement ?? '--' }}</span>
          <span class="h-12 leading-12 tracking-4px">
            气体检测报警器技术服务合同约定，在甲方工作人员陪同下，对合同内24台固定式气体检测报警器，3台便携式气体探测器（共9路），进行了<span
              class="border-line"
              >{{ formatToDate(new Date(), 'M') }}</span
            >月份的标定检查工作，在检查中没有发现问题。
          </span>
          <div class="h-12 leading-12 tracking-4px">
            <span
              >&nbsp;&nbsp;&nbsp;&nbsp;特向甲方进行情况反馈。本情况反馈报告一式二份，甲乙双方签盖后各执一份。</span
            >
          </div>

          <div class="mt-44">
            <div class="flex" style="justify-content: space-between">
              <div>
                <div> 乙方：{{ maintenanceInformation.apReceiveName ?? '--' }} </div>
                <div>授权代表（签名）：</div>
                <div>签章日期：</div>
              </div>
              <div>
                <div> 甲方：{{ maintenanceInformation.apReceiveName ?? '--' }} </div>
                <div>授权代表（签名）：</div>
                <div>签章日期：</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { toPng } from 'html-to-image';
  import printJS from 'print-js';
  import { jsPDF } from 'jspdf';
  import { onMounted, reactive, ref } from 'vue';
  import { Space as ASpace } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { formatToDate } from '/@/utils/dateUtil';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';

  type MaintenanceInformation = {
    id?: string; // 表单ID
    recordNo?: string; // 表单编号
    deviceAlarmId?: string; // 单号
    remark?: string; // 备注
    taskType?: string; // 任务类型
    implementationUser?: string; // 实施人员
    accompanyUser?: string; // 陪同人员
    startDate?: string; // 开始时间
    duration?: string; // 预计时长
    apReceiveName?: string; // 甲方公司名称
    agreement?: string; // 服务协议
  };

  const route = useRoute();

  const recordId = ref<string>(route.params?.id as string);
  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  const maintenanceInformation = reactive<MaintenanceInformation>({});

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;
    const response = await equipmentMaintenanceRecordForm({ id: recordId.value });

    const {
      id,
      recordNo,
      deviceAlarmId,
      accompanyUser,
      duration,
      remark,
      implementationUser,
      startDate,
      taskType,
      apReceiveName,
      agreement,
    } = response;

    maintenanceInformation.deviceAlarmId = deviceAlarmId;
    maintenanceInformation.id = id;
    maintenanceInformation.recordNo = recordNo;
    maintenanceInformation.accompanyUser = accompanyUser;
    maintenanceInformation.duration = duration;
    maintenanceInformation.remark = remark;
    maintenanceInformation.implementationUser = implementationUser;
    maintenanceInformation.startDate = startDate;
    maintenanceInformation.taskType = taskType;
    maintenanceInformation.apReceiveName = apReceiveName;
    maintenanceInformation.agreement = agreement;

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    const doc = new jsPDF();

    const pageDataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

    doc.addImage(pageDataUrl, 'png', 6, 6, 210, 150);

    doc.save(`${formatToDate(new Date(), 'M')}月份南洋维保检查情况反馈报告.pdf`);

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
    padding-right: 10px;
    padding-left: 4px;
    font-weight: bold;
  }
</style>
