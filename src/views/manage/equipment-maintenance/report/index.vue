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
      <div class="pl-24 pr-24 pt-2 text-lg tracking-2px" id="maintenanceReport">
        <div class="flex border-b-2" style="justify-content: space-between">
          <div class="tracking-2px">浙江盛基智能科技有限公司</div>
        </div>
        <div class="text-3xl text-center h-20 leading-20 tracking-2px">
          气体检测报警器技术服务工作单
        </div>
        <div class="text-right text-lg h-18 leading-18">
          <span class="mr-2">编号:</span>
          <span class="border-line">{{ maintenanceInformation.id }}</span>
        </div>
        <div class="text-lg h-12 leading-12">
          <span class="tracking-4px">甲方</span>
          <span class="border-line">浙江盛基智能科技有限公司</span>
          <span>：</span>
        </div>
        <div class="h-12 leading-10 pl-10">
          <span class="tracking-4px">乙方根据</span>
          <span class="border-line">嘉兴大衡精密仪器有限公司</span>
          <span class="tracking-4px">对甲方气体检测报警器开展技术服务，</span>
        </div>
        <div class="h-8 leading-8 tracking-4px"> 具体内容如下： </div>
        <div>
          <table>
            <tbody>
              <tr style="height: 140px">
                <td>类型</td>
                <td>□校准 □标定 □巡检 □其他 </td>
                <td> 目标 </td>
                <td> 装置/区域/位号（附明细清单） </td>
              </tr>
              <tr style="height: 140px">
                <td>开始时间</td>
                <td>
                  <span class="border-line">{{
                    formatToDate(maintenanceInformation.stepOneSubmitDate, 'YYYY')
                  }}</span>
                  <span>年</span>
                  <span class="border-line">{{
                    formatToDate(maintenanceInformation.stepOneSubmitDate, 'MM')
                  }}</span>
                  <span>月</span>
                  <span class="border-line">{{
                    formatToDate(maintenanceInformation.stepOneSubmitDate, 'DD')
                  }}</span>
                  <span>日</span>
                </td>
                <td>预计时长</td>
                <td>
                  <span class="border-line">{{ maintenanceDays }}</span>
                  <span>天</span>
                </td>
              </tr>
              <tr style="height: 140px">
                <td>实施人员</td>
                <td>
                  <!-- <span class="border-line">2023</span>
                  <span>年</span>
                  <span class="border-line">12</span>
                  <span>月</span>
                  <span class="border-line">11</span>
                  <span>日</span> -->
                </td>
                <td>陪同人员</td>
                <td>
                  <!-- <span class="border-line">2023</span>
                  <span>年</span>
                  <span class="border-line">12</span>
                  <span>月</span>
                  <span class="border-line">11</span>
                  <span>日</span> -->
                </td>
              </tr>
              <tr style="height: 100px">
                <td> 备注 </td>
                <td colspan="3">{{ maintenanceInformation.stepThreeRemark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="h-12 leading-12 tracking-4px">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务实施期间可能会触发设备警报信号，请各节点人员做好联动设备旁路措施并做好各相关部门间信息沟通。
        </div>
        <div class="text-right h-28 leading-36 pr-10">
          <span class="mr-2">派 单 人 员:</span>
          <span class="border-line">{{ maintenanceInformation.stepOneBy }}</span>
        </div>
        <div class="text-right">
          <span class="border-line">{{ formatToDate(new Date(), 'YYYY') }}</span>
          <span>年</span>
          <span class="border-line">{{ formatToDate(new Date(), 'MM') }}</span>
          <span>月</span>
          <span class="border-line">{{ formatToDate(new Date(), 'DD') }}</span>
          <span>日</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { toPng } from 'html-to-image';
  import printJS from 'print-js';
  import { jsPDF } from 'jspdf';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { Space as ASpace } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { formatToDate, dateUtil } from '/@/utils/dateUtil';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenance';

  type MaintenanceInformation = {
    id?: string; // 表单编号
    deviceAlarmId?: string; // 单号
    stepOneBy?: string; // 确认人
    stepOneEnterpriseId?: string; // 确认企业id
    stepOneRemark?: string; // 说明内容
    stepOneImageUrlList?: string[]; // 图片
    stepOneSubmitDate?: string; // 开始时间
    stepTwoBy?: string; // 确认人
    stepTwoEnterpriseId?: string; // 确认企业id
    stepTwoRemark?: string; // 说明内容
    stepTwoImageUrlList?: string[]; // 图片
    stepThreeBy?: string; // 确认人
    stepThreeEnterpriseId?: string; // 确认企业id
    stepThreeRemark?: string; // 说明内容
    stepThreeImageUrlList?: string[]; // 图片
    stepThreeAffirmDate?: string; // 结束时间
  };

  const go = useGo();
  const route = useRoute();

  const recordId = ref<string>(route.params?.id as string);
  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  const maintenanceInformation = reactive<MaintenanceInformation>({});

  function goBack() {
    go('/plan/list');
  }

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;
    const response = await equipmentMaintenanceRecordForm({ id: recordId.value });

    const {
      id,
      list,
      deviceAlarmId,
      stepOneBy,
      stepOneEnterpriseId,
      stepOneRemark,
      stepOneSubmitDate,
      stepTwoBy,
      stepTwoEnterpriseId,
      stepTwoRemark,
      stepThreeBy,
      stepThreeEnterpriseId,
      stepThreeRemark,
      stepThreeAffirmDate,
    } = response;

    console.log('-------response--------', response);
    maintenanceInformation.deviceAlarmId = deviceAlarmId;
    maintenanceInformation.id = id;

    maintenanceInformation.stepOneBy = stepOneBy;
    maintenanceInformation.stepTwoBy = stepTwoBy;
    maintenanceInformation.stepThreeBy = stepThreeBy;
    maintenanceInformation.stepOneSubmitDate = stepOneSubmitDate;

    maintenanceInformation.stepOneEnterpriseId = stepOneEnterpriseId;
    maintenanceInformation.stepTwoEnterpriseId = stepTwoEnterpriseId;
    maintenanceInformation.stepThreeEnterpriseId = stepThreeEnterpriseId;

    maintenanceInformation.stepOneRemark = stepOneRemark;
    maintenanceInformation.stepTwoRemark = stepTwoRemark;
    maintenanceInformation.stepThreeRemark = stepThreeRemark;

    maintenanceInformation.stepThreeAffirmDate = stepThreeAffirmDate;

    list.forEach((item) => {
      switch (item.processStep) {
        case '150':
          maintenanceInformation.stepOneImageUrlList = item.attPath.split(',');
          break;
        case '250':
          maintenanceInformation.stepTwoImageUrlList = item.attPath.split(',');

          break;
        case '350':
          maintenanceInformation.stepThreeImageUrlList = item.attPath.split(',');
          break;
      }
    });

    isLoading.value = false;
  }

  const maintenanceDays = computed(() => {
    return dateUtil(maintenanceInformation.stepThreeAffirmDate).diff(
      maintenanceInformation.stepOneSubmitDate,
      'days',
    );
  });

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    const doc = new jsPDF();

    const pageDataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

    doc.addImage(pageDataUrl, 'png', 6, 6, 198, 210);

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
        documentTitle: '大衡精密仪器设备管理平台',
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
