<template>
  <BasicModal
    width="90%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    title="工作反馈报告预览"
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
          loading-tip="正在生成工作反馈报告..."
        >
        </div>
      </template>

      <template v-else>
        <div class="pl-44 pr-44 pt-2 text-lg tracking-3px h-200" id="maintenanceReport">
          <div class="text-3xl text-center h-20 leading-20 tracking-2px font-bold">
            工作反馈报告
          </div>
          <div class="text-lg h-12 leading-12">
            <span class="border-line">{{ maintenanceInformation.apReceiveName ?? '--' }}</span>
            <span>：</span>
          </div>
          <div class="h-12 leading-10">
            <span class="tracking-4px">&nbsp;&nbsp;&nbsp;&nbsp;乙方根据</span>
            <span>({{ maintenanceInformation.recordNo ?? '--' }})</span>
            <span class="h-12 leading-12 tracking-4px">
              技术服务合同约定，在甲方工作人员陪同下，对合同内<span class="font-bold">{{
                maintenanceInformation.totalAmount ?? '0'
              }}</span
              >台<span>{{ maintenanceInformation.sensorNames ?? '--' }}</span
              >进行技术服务工作，工作成果汇总如下：
            </span>
            <div
              v-if="maintenanceInformation?.appearanceControllerAmount !== 0"
              class="tracking-4px pl-8"
              ><span>{{ maintenanceInformation.appearanceControllerAmount }}</span
              >台外观\通电及控制器异常；（位号:
              {{ maintenanceInformation?.appearanceControllerLocationNos }}）
            </div>
            <div v-else class="tracking-4px pl-8">
              <span>未发现外观\通电及控制器异常；</span>
            </div>

            <div
              v-if="maintenanceInformation?.registrationErrorAmount !== 0"
              class="tracking-4px pl-8"
              ><span>{{ maintenanceInformation.registrationErrorAmount }}</span
              >台示值误差异常；（位号: {{ maintenanceInformation?.registrationErrorLocationNos }}）
            </div>
            <div v-else class="tracking-4px pl-8">
              <span>未发现示值误差异常；</span>
            </div>

            <div
              v-if="maintenanceInformation?.acoustoOpticAlarmAmount !== 0"
              class="tracking-4px pl-8"
              ><span>{{ maintenanceInformation.acoustoOpticAlarmAmount }}</span
              >台声光报警异常；（位号: {{ maintenanceInformation?.acoustoOpticAlarmLocationNos }}）
            </div>
            <div v-else class="tracking-4px pl-8">
              <span>未发现声光报警异常；</span>
            </div>

            <div class="h-12 leading-12 tracking-4px">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;详情见附表清单。</span>
            </div>
            <div class="h-12 leading-12 tracking-4px">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;特向甲方进行情况反馈。</span>
            </div>

            <div class="mt-16">
              <div class="flex" style="justify-content: space-between">
                <div>
                  <div> 乙方：浙江力基计量技术有限公司 </div>
                  <div
                    ><span>实施人员（签名）：</span
                    ><span>{{ maintenanceInformation.implementationUser }}</span></div
                  >
                  <div>日期：{{ formatToDate(new Date(), 'YYYY年MM月DD日') }}</div>
                </div>
                <div>
                  <div> 甲方：{{ maintenanceInformation.apReceiveName ?? '--' }} </div>
                  <div
                    ><span>陪同人员（签名）：</span
                    ><span>{{ maintenanceInformation.accompanyUser }}</span></div
                  >
                  <div>日期：{{ formatToDate(new Date(), 'YYYY年MM月DD日') }}</div>
                </div>
              </div>
            </div>
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
  import { useRoute } from 'vue-router';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { formatToDate } from '/@/utils/dateUtil';
  import { equipmentMaintenanceRecordForm } from '/@/api/manage/equipmentMaintenanceRecord';
  import { workflowDeviceMaintSensorPage } from '/@/api/biz/workflowDeviceMaintSensor';

  type MaintenanceInformation = {
    id?: string; // 表单ID
    recordNo?: string; // 表单编号
    deviceAlarmId?: string; // 单号
    taskTypeDisplayName?: string; // 服务类型
    remark?: string; // 备注
    taskType?: string; // 任务类型
    implementationUser?: string; // 实施人员
    accompanyUser?: string; // 陪同人员
    startDate?: string; // 开始时间
    duration?: string; // 预计时长
    apReceiveName?: string; // 甲方公司名称
    agreement?: string; // 服务协议
    stepThreeRemark?: string; //
    totalAmount?: string; // 传感器维护总数量
    sensorNames?: string; // 传感器
    appearanceControllerAmount?: number; // 外观\通电及控制器异常数量
    appearanceControllerLocationNos?: string; // 外观\通电及控制器异常位号
    registrationErrorAmount?: number; // 示值误差异常数量
    registrationErrorLocationNos?: string; // 示值误差异常位号
    acoustoOpticAlarmAmount?: number; // 声光报警异常数量
    acoustoOpticAlarmLocationNos?: string; // 声光报警异常位号
  };

  const route = useRoute();

  const recordId = ref<string>(route.params?.id as string);
  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

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
    const response = await equipmentMaintenanceRecordForm({ id: recordId.value });

    const data = await workflowDeviceMaintSensorPage({ recordId: recordId.value });

    const {
      id,
      recordNo,
      deviceAlarmId,
      taskTypeDisplayName,
      accompanyUser,
      duration,
      remark,
      implementationUser,
      startDate,
      taskType,
      bizEnterprise,
      agreement,
      stepThreeRemark,
    } = response;

    maintenanceInformation.deviceAlarmId = deviceAlarmId;
    maintenanceInformation.taskTypeDisplayName = taskTypeDisplayName;
    maintenanceInformation.id = id;
    maintenanceInformation.recordNo = recordNo;
    maintenanceInformation.accompanyUser = accompanyUser;
    maintenanceInformation.duration = duration;
    maintenanceInformation.remark = remark;
    maintenanceInformation.implementationUser = implementationUser;
    maintenanceInformation.startDate = startDate;
    maintenanceInformation.taskType = taskType;
    maintenanceInformation.apReceiveName = bizEnterprise?.enterpriseName;
    maintenanceInformation.agreement = agreement;
    maintenanceInformation.stepThreeRemark = stepThreeRemark;

    maintenanceInformation.totalAmount = data?.records?.length;

    if (data?.records?.length > 0) {
      const updatedSensorNames =
        data?.records.map((item) => {
          return item.sensorName;
        }) ?? [];

      maintenanceInformation.sensorNames = [...new Set(updatedSensorNames)].join('、');

      const appearanceControllerAmountArray = data?.records.filter((item) => {
        return item.result1 === '0';
      });

      maintenanceInformation.appearanceControllerLocationNos = appearanceControllerAmountArray
        .map((item) => item.locationNo)
        .join('、');
      maintenanceInformation.appearanceControllerAmount = appearanceControllerAmountArray.length;

      const registrationErrorArray = data?.records.filter((item) => {
        return item.result3 === '0';
      });

      maintenanceInformation.registrationErrorLocationNos = registrationErrorArray
        .map((item) => item.locationNo)
        .join('、');
      maintenanceInformation.registrationErrorAmount = registrationErrorArray.length;

      const acoustoOpticAlarmArray = data?.records.filter((item) => {
        return item.result4 === '0';
      });

      maintenanceInformation.acoustoOpticAlarmLocationNos = acoustoOpticAlarmArray
        .map((item) => item.locationNo)
        .join('、');
      maintenanceInformation.acoustoOpticAlarmAmount = acoustoOpticAlarmArray.length;
    }

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;
    const doc = new jsPDF();

    const pageDataUrl = await toPng(document.querySelector('#maintenanceReport') as HTMLElement);

    doc.addImage(pageDataUrl, 'png', 15, 10, 180, 150);

    doc.save(
      `${formatToDate(maintenanceInformation.startDate, 'M')}月份${
        maintenanceInformation.apReceiveName
      }工作反馈报告.pdf`,
    );

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
        imageStyle: 'width:100%;margin-top:30px;margin-bottom:20px;',
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
  }
</style>
