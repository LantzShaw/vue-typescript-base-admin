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
        loading-tip="正在生成处置单..."
      >
      </div>
    </template>

    <template v-else>
      <div
        class="text-lg tracking-2px"
        style="padding-top: 18px; padding-left: 45px; padding-right: 45px"
        id="report"
      >
        <!-- <div class="perpage"> -->
        <div id="firstPage">
          <div style="height: 100%">
            <div class="flex border-b-2 mt-2" style="justify-content: space-between">
              <div> {{ eventTriggerInformation.departName }} </div>
              <div>
                <span>表单编号: </span>
                <span>{{ eventTriggerInformation.id }}</span>
              </div>
            </div>
            <div class="text-2xl font-extrabold text-center p-8">触发事件处置单</div>
            <div class="ml-2"
              ><span style="letter-spacing: 4px">单 号:</span
              ><span>{{ eventTriggerInformation.deviceAlarmId }}</span></div
            >
            <table>
              <thead>
                <tr style="height: 52px">
                  <th colspan="4" class="text-base">事件信息</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>所属单位</td>
                  <td>{{ eventTriggerInformation.enterpriseName }}</td>
                  <td>信息来源</td>
                  <td>应急管理处</td>
                </tr>
                <tr>
                  <td>位 号</td>
                  <td>XX_1299-2GT2901(丙烯)</td>
                  <td>设备名称</td>
                  <td>{{ eventTriggerInformation.sensorName }}</td>
                </tr>
                <tr style="height: 100px">
                  <td>异常情况</td>
                  <td colspan="3">
                    <!-- <div class="mb-3">□离线√数据异常□低报□高报</div>
                  <div class="text-left">其他：系统显示-0.0883%LEL</div> -->
                    <div v-html="eventTriggerInformation.triggerContent"> </div>
                  </td>
                </tr>
                <tr>
                  <td>触发时间</td>
                  <td colspan="3" class="text-left">{{ eventTriggerInformation.findDate }}</td>
                </tr>
                <tr style="height: 52px">
                  <td colspan="4" class="font-bold text-base">事件接收</td>
                </tr>
                <tr style="height: 42px">
                  <td> 使用单位联系人 </td>
                  <td colspan="3">{{ eventTriggerInformation.userName }}</td>
                </tr>
                <tr style="height: 42px">
                  <td> 维保单位联系人 </td>
                  <td colspan="3">{{ eventTriggerInformation.maintainer }}</td>
                </tr>
                <tr>
                  <td>处置时间</td>
                  <td colspan="3" class="text-left">{{
                    eventTriggerInformation.stepOneSubmitDate
                  }}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <tbody>
                <tr style="height: 52px">
                  <td colspan="3" class="font-bold text-base">事件处置</td>
                </tr>
                <tr style="height: 248px">
                  <td class="w-20">1</td>
                  <td style="width: 12%">数据复核</td>
                  <td colspan="2">
                    <div class="mb-3 text-left p-left-4">
                      <div>
                        {{ eventTriggerInformation.stepOneRemark }}
                      </div>
                      <div class="flex" style="justify-content: space-between; align-items: end">
                        <div>
                          <template v-if="eventTriggerInformation.stepOneImageUrlList">
                            <a-space>
                              <AuthImage
                                height="160px"
                                width="110px"
                                :key="index"
                                v-for="(
                                  imageUrl, index
                                ) in eventTriggerInformation.stepOneImageUrlList"
                                :fileUrl="imageUrl"
                              />
                            </a-space>
                          </template>
                        </div>
                        <div class="pr-20">确认人员: {{ eventTriggerInformation.stepOneBy }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 248px">
                  <td class="w-20">2</td>
                  <td style="width: 12%">查找原因</td>
                  <td colspan="2">
                    <div class="mb-3 text-left p-left-4">
                      <div>
                        {{ eventTriggerInformation.stepTwoRemark }}
                      </div>
                      <div class="flex" style="justify-content: space-between; align-items: end">
                        <div>
                          <template v-if="eventTriggerInformation.stepTwoImageUrlList">
                            <a-space>
                              <AuthImage
                                height="160px"
                                width="110px"
                                :key="index"
                                v-for="(
                                  imageUrl, index
                                ) in eventTriggerInformation.stepTwoImageUrlList"
                                :fileUrl="imageUrl"
                              />
                            </a-space>
                          </template>
                        </div>
                        <div class="pr-20">确认人员: {{ eventTriggerInformation.stepTwoBy }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 248px">
                  <td class="w-20">3</td>
                  <td style="width: 12%">采取措施</td>
                  <td colspan="2">
                    <div class="mb-3 text-left p-left-4">
                      <div>
                        {{ eventTriggerInformation.stepThreeRemark }}
                      </div>
                      <div class="flex" style="justify-content: space-between; align-items: end">
                        <div>
                          <template v-if="eventTriggerInformation.stepThreeImageUrlList">
                            <a-space>
                              <AuthImage
                                height="160px"
                                width="110px"
                                :key="index"
                                v-for="(
                                  imageUrl, index
                                ) in eventTriggerInformation.stepThreeImageUrlList"
                                :fileUrl="imageUrl"
                              />
                            </a-space>
                          </template>
                        </div>
                        <div class="pr-20">确认人员: {{ eventTriggerInformation.stepThreeBy }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style="
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div> 发布日期: {{ formatToDate(new Date(), 'YYYY年MM月DD日') }} </div>
            <div>第1页/共2页</div>
            <div>
              实施日期:
              {{ formatToDate(eventTriggerInformation.stepFourSubmitDate, 'YYYY年MM月DD日') }}
            </div>
          </div>
        </div>

        <p style="margin: 30px 0"></p>
        <div id="secondPage" style="padding: 2px">
          <div class="flex border-b-2 mb-10" style="justify-content: space-between">
            <div> {{ eventTriggerInformation.departName }} </div>
            <div>
              <span>表单编号: </span>
              <span>{{ eventTriggerInformation.id }}</span>
            </div>
          </div>
          <table>
            <tbody>
              <tr style="height: 290px">
                <td class="w-20">4</td>
                <td style="width: 12%">措施落实</td>
                <td colspan="2">
                  <div class="mb-3 text-left p-left-4">
                    <div>
                      {{ eventTriggerInformation.stepFourRemark }}
                    </div>
                    <div class="flex" style="justify-content: space-between; align-items: end">
                      <div>
                        <template v-if="eventTriggerInformation.stepFourImageUrlList">
                          <a-space>
                            <AuthImage
                              height="160px"
                              width="110px"
                              :key="index"
                              v-for="(
                                imageUrl, index
                              ) in eventTriggerInformation.stepFourImageUrlList"
                              :fileUrl="imageUrl"
                            />
                          </a-space>
                        </template>
                      </div>
                      <div class="pr-20">确认人员: {{ eventTriggerInformation.stepFourBy }}</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 290px">
                <td class="w-20">5</td>
                <td style="width: 12%">原因分析</td>
                <td colspan="2">
                  <div class="mb-3 text-left p-left-4">
                    <div>
                      {{ eventTriggerInformation.stepFiveRemark }}
                    </div>
                    <div class="flex" style="justify-content: space-between; align-items: end">
                      <div>
                        <template v-if="eventTriggerInformation.stepFiveImageUrlList">
                          <a-space>
                            <AuthImage
                              height="160px"
                              width="110px"
                              :key="index"
                              v-for="(
                                imageUrl, index
                              ) in eventTriggerInformation.stepFiveImageUrlList"
                              :fileUrl="imageUrl"
                            />
                          </a-space>
                        </template>
                      </div>
                      <div class="pr-20">确认人员: {{ eventTriggerInformation.stepFiveBy }}</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 290px">
                <td class="w-20">6</td>
                <td style="width: 12%">举一反三</td>
                <td colspan="2">
                  <div class="mb-3 text-left p-left-4">
                    <div>
                      {{ eventTriggerInformation.stepSixRemark }}
                    </div>
                    <div class="flex" style="justify-content: space-between; align-items: end">
                      <div>
                        <template v-if="eventTriggerInformation.stepSixImageUrlList">
                          <a-space>
                            <AuthImage
                              height="160px"
                              width="110px"
                              :key="index"
                              v-for="(
                                imageUrl, index
                              ) in eventTriggerInformation.stepSixImageUrlList"
                              :fileUrl="imageUrl"
                            />
                          </a-space>
                        </template>
                      </div>
                      <div class="pr-20">确认人员: {{ eventTriggerInformation.stepSixBy }}</div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 52px">
                <td colspan="3" class="font-bold text-base">处置结果</td>
              </tr>
              <tr style="height: 140px">
                <td colspan="3">
                  <div class="mb-3">
                    <div>
                      {{ eventTriggerInformation.stepSevenRemark }}
                    </div>
                    <div class="flex" style="justify-content: space-between; align-items: end">
                      <div>
                        <template v-if="eventTriggerInformation.stepSevenImageUrlList">
                          <a-space>
                            <AuthImage
                              height="160px"
                              width="110px"
                              :key="index"
                              v-for="(
                                imageUrl, index
                              ) in eventTriggerInformation.stepSevenImageUrlList"
                              :fileUrl="imageUrl"
                            />
                          </a-space>
                        </template>
                      </div>
                      <div class="pr-20">确认人员: {{ eventTriggerInformation.stepSevenBy }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style="
              height: 110px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div> 发布日期: {{ formatToDate(new Date(), 'YYYY年MM月DD日') }} </div>
            <div>第2页/共2页</div>
            <div>
              实施日期:
              {{ formatToDate(eventTriggerInformation.stepFourSubmitDate, 'YYYY年MM月DD日') }}
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
  import { useGo } from '/@/hooks/web/usePage';
  import { eventTriggerEventDetail, eventTriggerForm } from '/@/api/manage/eventTrigger';

  import { AuthImage } from '/@/components/Upload';

  type EventTriggerInformation = {
    id?: string; // 表单编号
    deviceAlarmId?: string; // 单号
    maintainer?: string; // 维保单位联系人
    userName?: string; // 使用单位联系人
    triggerContent?: string; // 异常情况
    sensorName?: string; // 设备名称
    enterpriseName?: string; // 所属单位
    departName?: string; // 部门
    stepOneSubmitDate?: string; // 信息核实提交时间
    stepFourSubmitDate?: string; // 措施落实提交时间
    findDate?: string; // 触发时间
    stepOneBy?: string; // 确认人
    stepOneEnterpriseId?: string; // 确认企业id
    stepOneRemark?: string; // 说明内容
    stepOneImageUrlList?: string[]; // 图片
    stepTwoBy?: string; // 确认人
    stepTwoEnterpriseId?: string; // 确认企业id
    stepTwoRemark?: string; // 说明内容
    stepTwoImageUrlList?: string[]; // 图片
    stepThreeBy?: string; // 确认人
    stepThreeEnterpriseId?: string; // 确认企业id
    stepThreeRemark?: string; // 说明内容
    stepThreeImageUrlList?: string[]; // 图片
    stepFourBy?: string; // 确认人
    stepFourEnterpriseId?: string; // 确认企业id
    stepFourRemark?: string; // 说明内容
    stepFourImageUrlList?: string[]; // 图片
    stepFiveBy?: string; // 确认人
    stepFiveEnterpriseId?: string; // 确认企业id
    stepFiveRemark?: string; // 说明内容
    stepFiveImageUrlList?: string[]; // 图片
    stepSixBy?: string; // 确认人
    stepSixEnterpriseId?: string; // 确认企业id
    stepSixRemark?: string; // 说明内容
    stepSixImageUrlList?: string[]; // 图片
    stepSevenBy?: string; // 确认人
    stepSevenEnterpriseId?: string; // 确认企业id
    stepSevenRemark?: string; // 说明内容
    stepSevenImageUrlList?: string[]; // 图片
    stepEightBy?: string; // 确认人
    stepEightEnterpriseId?: string; // 确认企业id
    stepEightRemark?: string; // 说明内容
    stepEightImageUrlList?: string[]; // 图片
  };

  const go = useGo();
  const route = useRoute();

  const eventId = ref<string>(route.params?.id as string);
  const alarmId = ref<string>(route.query?.alarmId as string);
  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  const eventTriggerInformation = reactive<EventTriggerInformation>({});

  function goBack() {
    go('/event-trigger/event/list');
  }

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;

    const response = await eventTriggerEventDetail({ id: eventId.value });

    // const baseInformation = await eventTriggerForm({ id: alarmId.value });
    // console.log('baseInformation', baseInformation);

    const {
      id,
      list,
      deviceAlarmId,
      maintainer,
      userName,
      triggerContent,
      sensorName,
      enterpriseName,
      departName,
      stepOneSubmitDate,
      stepFourSubmitDate,
      findDate,
      stepOneBy,
      stepOneEnterpriseId,
      stepOneRemark,
      stepTwoBy,
      stepTwoEnterpriseId,
      stepTwoRemark,
      stepThreeBy,
      stepThreeEnterpriseId,
      stepThreeRemark,
      stepFourBy,
      stepFourEnterpriseId,
      stepFourRemark,
      stepFiveBy,
      stepFiveEnterpriseId,
      stepFiveRemark,
      stepSixBy,
      stepSixEnterpriseId,
      stepSixRemark,
      stepSevenBy,
      stepSevenEnterpriseId,
      stepSevenRemark,
      stepEightBy,
      stepEightEnterpriseId,
      stepEightRemark,
    } = response;

    console.log('-------response--------', response);
    eventTriggerInformation.deviceAlarmId = deviceAlarmId;
    eventTriggerInformation.id = id;
    eventTriggerInformation.maintainer = maintainer;
    eventTriggerInformation.userName = userName;
    eventTriggerInformation.triggerContent = triggerContent;
    eventTriggerInformation.enterpriseName = enterpriseName;
    eventTriggerInformation.departName = departName;
    eventTriggerInformation.sensorName = sensorName;
    eventTriggerInformation.stepOneSubmitDate = stepOneSubmitDate;
    eventTriggerInformation.stepFourSubmitDate = stepFourSubmitDate;
    eventTriggerInformation.findDate = findDate;

    eventTriggerInformation.stepOneBy = stepOneBy;
    eventTriggerInformation.stepTwoBy = stepTwoBy;
    eventTriggerInformation.stepThreeBy = stepThreeBy;
    eventTriggerInformation.stepFourBy = stepFourBy;
    eventTriggerInformation.stepFiveBy = stepFiveBy;
    eventTriggerInformation.stepSixBy = stepSixBy;
    eventTriggerInformation.stepSevenBy = stepSevenBy;
    eventTriggerInformation.stepEightBy = stepEightBy;

    eventTriggerInformation.stepOneEnterpriseId = stepOneEnterpriseId;
    eventTriggerInformation.stepTwoEnterpriseId = stepTwoEnterpriseId;
    eventTriggerInformation.stepThreeEnterpriseId = stepThreeEnterpriseId;
    eventTriggerInformation.stepFourEnterpriseId = stepFourEnterpriseId;
    eventTriggerInformation.stepFiveEnterpriseId = stepFiveEnterpriseId;
    eventTriggerInformation.stepSixEnterpriseId = stepSixEnterpriseId;
    eventTriggerInformation.stepSevenEnterpriseId = stepSevenEnterpriseId;
    eventTriggerInformation.stepEightEnterpriseId = stepEightEnterpriseId;

    eventTriggerInformation.stepOneRemark = stepOneRemark;
    eventTriggerInformation.stepTwoRemark = stepTwoRemark;
    eventTriggerInformation.stepThreeRemark = stepThreeRemark;
    eventTriggerInformation.stepFourRemark = stepFourRemark;
    eventTriggerInformation.stepFiveRemark = stepFiveRemark;
    eventTriggerInformation.stepSixRemark = stepSixRemark;
    eventTriggerInformation.stepSevenRemark = stepSevenRemark;
    eventTriggerInformation.stepEightRemark = stepEightRemark;

    list.forEach((item) => {
      switch (item.processStep) {
        case '150':
          eventTriggerInformation.stepOneImageUrlList = item.attPath.split(',');
          break;
        case '250':
          eventTriggerInformation.stepTwoImageUrlList = item.attPath.split(',');

          break;
        case '350':
          eventTriggerInformation.stepThreeImageUrlList = item.attPath.split(',');
          break;
        case '450':
          eventTriggerInformation.stepFourImageUrlList = item.attPath.split(',');

          break;
        case '550':
          eventTriggerInformation.stepFiveImageUrlList = item.attPath.split(',');
          break;
        case '650':
          eventTriggerInformation.stepSixImageUrlList = item.attPath.split(',');

          break;
        case '750':
          eventTriggerInformation.stepEightImageUrlList = item.attPath.split(',');
          break;
      }
    });

    isLoading.value = false;
  }

  /**
   * 下载PDF
   */
  const exportAsPDF = async () => {
    isButtonLoading.value = true;

    const doc = new jsPDF();

    const firstPageDataUrl = await toPng(document.querySelector('#firstPage') as HTMLElement);
    const secondPageDataUrl = await toPng(document.querySelector('#secondPage') as HTMLElement);

    doc.addImage(firstPageDataUrl, 'png', 6, 6, 198, 290);

    doc.addPage();
    doc.addImage(secondPageDataUrl, 'png', 6, 6, 198, 236);

    doc.save('事件触发处置单.pdf');

    isButtonLoading.value = false;
  };

  /**
   * 打印 - 按钮事件
   */
  const onPrint = () => {
    toPng(document.querySelector('#report') as HTMLElement).then((dataUrl) => {
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
    // page-break-inside: avoid;
    // page-break-after: avoid;
    // page-break-before: avoid;
    // table-layout: fixed;
    // word-break: break-all;

    // border-spacing: 13;
  }

  td {
    height: 32px;
    line-height: 32px;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  .perpage {
    // page-break-before: always;
    page-break-after: always;
  }
</style>
