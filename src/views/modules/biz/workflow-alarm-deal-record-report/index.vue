<template>
  <div style="height: auto; padding: 20px; background-color: #fff">
    <div style="text-align: right; margin-top: 20px">
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
        style="padding-top: 18px; padding-right: 45px; padding-left: 45px"
        id="eventReport"
      >
        <div id="firstPage">
          <div style="height: 100%">
            <div class="flex border-b-2 mt-2" style="justify-content: end">
              <div>
                <span>表单编号: </span>
                <span>{{ eventTriggerInformation.recordNo }}</span>
              </div>
            </div>
            <div class="text-2xl font-extrabold text-center p-8">触发事件处置单</div>
            <div class="ml-2"
              ><span style="letter-spacing: 4px">单 号:</span
              ><span>{{ eventTriggerInformation.id }}</span></div
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
                  <td>{{
                    eventTriggerInformation.bizDeviceSensor?.bizEnterprise?.enterpriseName
                  }}</td>
                </tr>
                <tr style="height: 100px">
                  <td>异常情况</td>
                  <td colspan="3">
                    <div>
                      <ReportCheckBoxList
                        :data="reportCheckBoxDataList"
                        :value="eventTriggerInformation.alarmType"
                      />
                    </div>
                    <div class="text-left pl-4">
                      <div
                        ><span>传感器名称: </span
                        >{{ eventTriggerInformation.bizDeviceSensor?.sensorName ?? '--' }}</div
                      >
                      <div
                        ><span>位号: </span
                        >{{ eventTriggerInformation.bizDeviceSensor?.locationNo ?? '--' }}</div
                      >
                      <div
                        ><span>当前值: </span
                        ><span>{{ eventTriggerInformation?.dtuipTriggerVal }}</span></div
                      >
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>触发时间</td>
                  <td colspan="3" class="text-left">{{
                    eventTriggerInformation?.dtuipTriggerDate
                  }}</td>
                </tr>
                <tr style="height: 52px">
                  <td colspan="4" class="font-bold text-base">事件接收</td>
                </tr>
                <tr style="height: 42px">
                  <td> 使用单位联系人 </td>
                  <td colspan="3">
                    {{ eventTriggerInformation.stepOneByUser?.nickName }}
                    {{ eventTriggerInformation.stepOneByUser?.phoneNumber }}
                  </td>
                </tr>
                <tr style="height: 42px">
                  <td> 维保单位联系人 </td>
                  <td colspan="3">
                    {{ eventTriggerInformation.stepOneAffirmByUser?.nickName }}
                    {{ eventTriggerInformation.stepOneAffirmByUser?.phoneNumber }}
                  </td>
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
                    <div class="mb-3 text-left pl-2">
                      <div>
                        {{ eventTriggerInformation.stepOneRemark }}
                      </div>
                      <div class="flex" style="align-items: end; justify-content: space-between">
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
                        <div class="pr-20">
                          <div>
                            <span>提交人: </span>
                            <span>{{ eventTriggerInformation.stepOneByUser?.nickName }}</span>
                          </div>
                          <div>
                            <span>确认人员: </span>
                            <span>{{ eventTriggerInformation.stepOneAffirmByUser?.nickName }}</span>
                          </div>
                          <div>
                            <span>确认时间: </span
                            ><span>{{ eventTriggerInformation.stepOneAffirmDate }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 248px">
                  <td class="w-20">2</td>
                  <td style="width: 12%">查找原因</td>
                  <td colspan="2">
                    <div class="mb-3 text-left pl-2">
                      <div>
                        {{ eventTriggerInformation.stepTwoRemark }}
                      </div>
                      <div class="flex" style="align-items: end; justify-content: space-between">
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
                        <div class="pr-20">
                          <div>
                            <span>提交人: </span>
                            <span>{{ eventTriggerInformation.stepTwoByUser?.nickName }}</span>
                          </div>
                          <div>
                            <span> 确认人员: </span>
                            <span>
                              {{ eventTriggerInformation.stepTwoAffirmByUser?.nickName }}
                            </span>
                          </div>
                          <div>
                            <span>确认时间: </span
                            ><span>{{ eventTriggerInformation.stepTwoAffirmDate }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 248px">
                  <td class="w-20">3</td>
                  <td style="width: 12%">采取措施</td>
                  <td colspan="2">
                    <div class="mb-3 text-left pl-2">
                      <div>
                        {{ eventTriggerInformation.stepThreeRemark }}
                      </div>
                      <div class="flex" style="align-items: end; justify-content: space-between">
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
                        <div class="pr-20">
                          <div>
                            <span>提交人: </span>
                            <span>{{ eventTriggerInformation.stepThreeByUser?.nickName }}</span>
                          </div>
                          <div>
                            <span> 确认人员: </span>
                            <span>
                              {{ eventTriggerInformation.stepThreeAffirmByUser?.nickName }}
                            </span>
                          </div>
                          <div>
                            <span>确认时间: </span
                            ><span>{{ eventTriggerInformation.stepThreeAffirmDate }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 100px;
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

        <p style="margin: 60px 0"></p>
        <div id="secondPage" style="padding: 2px">
          <div class="flex border-b-2 mb-10" style="justify-content: end">
            <div>
              <span>表单编号: </span>
              <span>{{ eventTriggerInformation.recordNo }}</span>
            </div>
          </div>
          <table>
            <tbody>
              <tr style="height: 290px">
                <td class="w-20">4</td>
                <td style="width: 12%">措施落实</td>
                <td colspan="2">
                  <div class="mb-3 text-left pl-2">
                    <div>
                      {{ eventTriggerInformation.stepFourRemark }}
                    </div>
                    <div class="flex" style="align-items: end; justify-content: space-between">
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
                      <div class="pr-20">
                        <div>
                          <span>提交人: </span>
                          <span>{{ eventTriggerInformation.stepFourByUser?.nickName }}</span>
                        </div>
                        <div>
                          <span>确认人员: </span>
                          <span>
                            {{ eventTriggerInformation.stepFourAffirmByUser?.nickName }}
                          </span>
                        </div>

                        <div>
                          <span>确认时间: </span
                          ><span>{{ eventTriggerInformation.stepFourAffirmDate }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 290px">
                <td class="w-20">5</td>
                <td style="width: 12%">原因分析</td>
                <td colspan="2">
                  <div class="mb-3 text-left pl-2">
                    <div>
                      {{ eventTriggerInformation.stepFiveRemark }}
                    </div>
                    <div class="flex" style="align-items: end; justify-content: space-between">
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
                      <div class="pr-20">
                        <div>
                          <span>提交人: </span>
                          <span>{{ eventTriggerInformation.stepFiveByUser?.nickName }}</span>
                        </div>
                        <div>
                          <span>确认人员: </span>
                          <span>
                            {{ eventTriggerInformation.stepFiveAffirmByUser?.nickName }}
                          </span>
                        </div>

                        <div>
                          <span>确认时间: </span
                          ><span>{{ eventTriggerInformation.stepFiveAffirmDate }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 290px">
                <td class="w-20">6</td>
                <td style="width: 12%">举一反三</td>
                <td colspan="2">
                  <div class="mb-3 text-left pl-2">
                    <div>
                      {{ eventTriggerInformation.stepSixRemark }}
                    </div>
                    <div class="flex" style="align-items: end; justify-content: space-between">
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
                      <div class="pr-20">
                        <div>
                          <span>提交人: </span>
                          <span>{{ eventTriggerInformation.stepSixByUser?.nickName }}</span>
                        </div>
                        <div>
                          <span>确认人员: </span>
                          <span>{{ eventTriggerInformation.stepSixAffirmByUser?.nickName }}</span>
                        </div>
                        <div>
                          <span>确认时间: </span
                          ><span>{{ eventTriggerInformation.stepSixAffirmDate }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr style="height: 52px">
                <td colspan="3" class="font-bold text-base">处置结果</td>
              </tr>
              <tr style="height: 160px">
                <td colspan="3">
                  <div class="mb-3 pl-2">
                    <div>
                      {{ eventTriggerInformation.stepSevenRemark }}
                    </div>
                    <div class="flex" style="align-items: end; justify-content: space-between">
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
                      <div class="pr-20">
                        <div>
                          <span>提交人: </span>
                          <span>{{ eventTriggerInformation.stepSevenByUser?.nickName }}</span>
                        </div>
                        <div>
                          <span> 确认人员: </span>
                          <span>
                            {{ eventTriggerInformation.stepSevenAffirmByUser?.nickName }}
                          </span>
                        </div>

                        <div>
                          <span>确认时间: </span
                          ><span>{{ eventTriggerInformation.stepSevenAffirmDate }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 110px;
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
  import { eventTriggerEventDetail } from '/@/api/manage/alarmDealRecord';

  import { AuthImage } from '/@/components/Upload';

  import {
    ReportCheckBoxList,
    type ReportCheckBoxDataList,
  } from '/@/components/ReportCheckBoxList';
  import { useTabs } from '/@/hooks/web/useTabs';

  type UserObject = {
    nickName: string;
    phoneNumber: string;
  };

  type EnterpriseObject = {
    enterpriseName?: string; // 所属单位
  };

  type SensorObject = {
    sensorName?: string; // 传感器名称
    locationNo?: string; //  位号
    bizEnterprise?: EnterpriseObject; // 所属单位信息
  };

  type DeviceAlarmObject = {
    dtuipTriggerVal?: string; // 当前值
    dtuipTriggerDate?: string; // 触发时间
  };

  type EventTriggerInformation = {
    alarmType?: string;
    recordNo?: string; // 表单编号
    id?: string; // 单号
    maintainer?: string; // 维保单位联系人
    userName?: string; // 使用单位联系人
    triggerContent?: string; // 异常情况
    dtuipTriggerDate?: string; // 触发时间
    sensorName?: string; // 设备名称
    locationNo?: string; // 位号
    dtuipTriggerVal?: string; // 当前触发值
    enterpriseName?: string; // 所属单位
    departName?: string; // 部门
    stepOneSubmitDate?: string; // 信息核实提交时间
    stepFourSubmitDate?: string; // 措施落实提交时间
    findDate?: string; // 触发时间2
    stepOneByUser?: UserObject; // 提交人
    stepOneEnterpriseId?: string; // 确认企业id
    stepOneRemark?: string; // 说明内容
    stepOneImageUrlList?: string[]; // 图片
    stepOneAffirmByUser?: UserObject; // 确认人
    stepOneAffirmDate?: string; // 确认时间
    stepTwoByUser?: UserObject; // 提交人
    stepTwoEnterpriseId?: string; // 确认企业id
    stepTwoRemark?: string; // 说明内容
    stepTwoImageUrlList?: string[]; // 图片
    stepTwoAffirmByUser?: UserObject; // 确认人
    stepTwoAffirmDate?: string; // 确认时间
    stepThreeByUser?: UserObject; // 提交人
    stepThreeEnterpriseId?: string; // 确认企业id
    stepThreeRemark?: string; // 说明内容
    stepThreeImageUrlList?: string[]; // 图片
    stepThreeAffirmByUser?: UserObject; // 确认人
    stepThreeAffirmDate?: string; // 确认时间
    stepFourByUser?: UserObject; // 确认人
    stepFourEnterpriseId?: string; // 确认企业id
    stepFourRemark?: string; // 说明内容
    stepFourImageUrlList?: string[]; // 图片
    stepFourAffirmByUser?: UserObject; // 确认人
    stepFourAffirmDate?: string; // 确认时间
    stepFiveByUser?: UserObject; // 提交人
    stepFiveEnterpriseId?: string; // 确认企业id
    stepFiveRemark?: string; // 说明内容
    stepFiveImageUrlList?: string[]; // 图片
    stepFiveAffirmByUser?: UserObject; // 确认人
    stepFiveAffirmDate?: string; // 确认时间
    stepSixByUser?: UserObject; // 提交人
    stepSixEnterpriseId?: string; // 确认企业id
    stepSixRemark?: string; // 说明内容
    stepSixImageUrlList?: string[]; // 图片
    stepSixAffirmByUser?: UserObject; // 确认人
    stepSixAffirmDate?: string; // 确认时间
    stepSevenByUser?: UserObject; // 提交人
    stepSevenEnterpriseId?: string; // 确认企业id
    stepSevenRemark?: string; // 说明内容
    stepSevenImageUrlList?: string[]; // 图片
    stepSevenAffirmByUser?: UserObject; // 确认人
    stepSevenAffirmDate?: string; // 确认时间
    bizDeviceSensor?: SensorObject; // 传感器信息
    bizDeviceAlarm?: DeviceAlarmObject; // 预警信息
  };

  const go = useGo();
  const route = useRoute();
  const { closeCurrent } = useTabs();

  const eventId = ref<string>(route.params?.id as string);
  const isButtonLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  const eventTriggerInformation = reactive<EventTriggerInformation>({});

  const reportCheckBoxDataList = reactive<ReportCheckBoxDataList[]>([
    {
      id: '1',
      name: '离线',
      value: '1',
    },
    {
      id: '2',
      name: '数据异常',
      value: '2',
    },
    {
      id: '3',
      name: '低报',
      value: '3',
    },
    {
      id: '4',
      name: '高报',
      value: '4',
    },
  ]);

  function goBack() {
    closeCurrent();

    go('/event-trigger/event/list');
  }

  /**
   * 获取处置单详细信息
   */
  async function getDetail() {
    isLoading.value = true;

    const response = await eventTriggerEventDetail({ id: eventId.value });

    const {
      id,
      recordNo,
      maintainer,
      userName,
      triggerContent,
      sensorName,
      enterpriseName,
      departName,
      stepOneSubmitDate,
      stepFourSubmitDate,
      findDate,
      alarmType,
      locationNo,
      dtuipTriggerVal,
      dtuipTriggerDate,
      stepOneByUser,
      stepOneEnterpriseId,
      stepOneRemark,
      stepOneAffirmByUser,
      stepOneAffirmDate,
      stepTwoByUser,
      stepTwoEnterpriseId,
      stepTwoRemark,
      stepTwoAffirmByUser,
      stepTwoAffirmDate,
      stepThreeByUser,
      stepThreeEnterpriseId,
      stepThreeRemark,
      stepThreeAffirmByUser,
      stepThreeAffirmDate,
      stepFourByUser,
      stepFourEnterpriseId,
      stepFourRemark,
      stepFourAffirmByUser,
      stepFourAffirmDate,
      stepFiveByUser,
      stepFiveEnterpriseId,
      stepFiveRemark,
      stepFiveAffirmByUser,
      stepFiveAffirmDate,
      stepSixByUser,
      stepSixEnterpriseId,
      stepSixRemark,
      stepSixAffirmByUser,
      stepSixAffirmDate,
      stepSevenByUser,
      stepSevenEnterpriseId,
      stepSevenRemark,
      stepSevenAffirmByUser,
      stepSevenAffirmDate,
      bizDeviceSensor,
      bizDeviceAlarm,
      stepOneBizWorkflowAlarmDealRecordAttList,
      stepTwoBizWorkflowAlarmDealRecordAttList,
      stepThreeBizWorkflowAlarmDealRecordAttList,
      stepFourBizWorkflowAlarmDealRecordAttList,
      stepFiveBizWorkflowAlarmDealRecordAttList,
      stepSixBizWorkflowAlarmDealRecordAttList,
      stepSevenBizWorkflowAlarmDealRecordAttList,
    } = response;

    eventTriggerInformation.id = id;
    eventTriggerInformation.recordNo = recordNo;
    eventTriggerInformation.maintainer = maintainer;
    eventTriggerInformation.userName = userName;
    eventTriggerInformation.triggerContent = triggerContent;
    eventTriggerInformation.enterpriseName = enterpriseName;
    eventTriggerInformation.departName = departName;
    eventTriggerInformation.sensorName = sensorName;
    eventTriggerInformation.stepOneSubmitDate = stepOneSubmitDate;
    eventTriggerInformation.stepFourSubmitDate = stepFourSubmitDate;
    eventTriggerInformation.findDate = findDate;
    // eventTriggerInformation.alarmType = alarmType + '';
    eventTriggerInformation.alarmType = '2';
    eventTriggerInformation.locationNo = locationNo;
    eventTriggerInformation.dtuipTriggerVal = dtuipTriggerVal;
    eventTriggerInformation.dtuipTriggerDate = dtuipTriggerDate;

    eventTriggerInformation.stepOneByUser = stepOneByUser;
    eventTriggerInformation.stepTwoByUser = stepTwoByUser;
    eventTriggerInformation.stepThreeByUser = stepThreeByUser;
    eventTriggerInformation.stepFourByUser = stepFourByUser;
    eventTriggerInformation.stepFiveByUser = stepFiveByUser;
    eventTriggerInformation.stepSixByUser = stepSixByUser;
    eventTriggerInformation.stepSevenByUser = stepSevenByUser;

    eventTriggerInformation.stepOneAffirmByUser = stepOneAffirmByUser;
    eventTriggerInformation.stepTwoAffirmByUser = stepTwoAffirmByUser;
    eventTriggerInformation.stepThreeAffirmByUser = stepThreeAffirmByUser;
    eventTriggerInformation.stepFourAffirmByUser = stepFourAffirmByUser;
    eventTriggerInformation.stepFiveAffirmByUser = stepFiveAffirmByUser;
    eventTriggerInformation.stepSixAffirmByUser = stepSixAffirmByUser;
    eventTriggerInformation.stepSevenAffirmByUser = stepSevenAffirmByUser;

    eventTriggerInformation.stepOneEnterpriseId = stepOneEnterpriseId;
    eventTriggerInformation.stepTwoEnterpriseId = stepTwoEnterpriseId;
    eventTriggerInformation.stepThreeEnterpriseId = stepThreeEnterpriseId;
    eventTriggerInformation.stepFourEnterpriseId = stepFourEnterpriseId;
    eventTriggerInformation.stepFiveEnterpriseId = stepFiveEnterpriseId;
    eventTriggerInformation.stepSixEnterpriseId = stepSixEnterpriseId;
    eventTriggerInformation.stepSevenEnterpriseId = stepSevenEnterpriseId;

    eventTriggerInformation.stepOneRemark = stepOneRemark;
    eventTriggerInformation.stepTwoRemark = stepTwoRemark;
    eventTriggerInformation.stepThreeRemark = stepThreeRemark;
    eventTriggerInformation.stepFourRemark = stepFourRemark;
    eventTriggerInformation.stepFiveRemark = stepFiveRemark;
    eventTriggerInformation.stepSixRemark = stepSixRemark;
    eventTriggerInformation.stepSevenRemark = stepSevenRemark;

    eventTriggerInformation.stepOneAffirmDate = stepOneAffirmDate;
    eventTriggerInformation.stepTwoAffirmDate = stepTwoAffirmDate;
    eventTriggerInformation.stepThreeAffirmDate = stepThreeAffirmDate;
    eventTriggerInformation.stepFourAffirmDate = stepFourAffirmDate;
    eventTriggerInformation.stepFiveAffirmDate = stepFiveAffirmDate;
    eventTriggerInformation.stepSixAffirmDate = stepSixAffirmDate;
    eventTriggerInformation.stepSevenAffirmDate = stepSevenAffirmDate;

    eventTriggerInformation.bizDeviceSensor = bizDeviceSensor;

    eventTriggerInformation.bizDeviceAlarm = bizDeviceAlarm;

    eventTriggerInformation.stepOneImageUrlList = stepOneBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepTwoImageUrlList = stepTwoBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepThreeImageUrlList = stepThreeBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepFourImageUrlList = stepFourBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepFiveImageUrlList = stepFiveBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepSixImageUrlList = stepSixBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    eventTriggerInformation.stepSevenImageUrlList = stepSevenBizWorkflowAlarmDealRecordAttList?.map(
      (item) => item.attPath,
    );

    // list?.forEach((item) => {
    //   switch (item.processStep) {
    //     case '150':
    //       eventTriggerInformation.stepOneImageUrlList = item.attPath.split(',');
    //       break;
    //     case '250':
    //       eventTriggerInformation.stepTwoImageUrlList = item.attPath.split(',');

    //       break;
    //     case '350':
    //       eventTriggerInformation.stepThreeImageUrlList = item.attPath.split(',');
    //       break;
    //     case '450':
    //       eventTriggerInformation.stepFourImageUrlList = item.attPath.split(',');

    //       break;
    //     case '550':
    //       eventTriggerInformation.stepFiveImageUrlList = item.attPath.split(',');
    //       break;
    //     case '650':
    //       eventTriggerInformation.stepSixImageUrlList = item.attPath.split(',');

    //       break;
    //   }
    // });

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
    toPng(document.querySelector('#eventReport') as HTMLElement, { quality: 0.9 }).then(
      (dataUrl) => {
        console.log('dataUrl', dataUrl);

        // NOTE: 去除页眉页脚
        // NOTE: 设置body的margin为0，避免第一页出现空白页，因为审查打印的iFrame的时候，里面的body元素默认有一个margin: 8px(浏览器默认margin)
        // const style = '@page {margin:0 20mm;padding:0}; body {margin: 0;}';
        const style = ' body {margin: 0;background-color: #fff;}';

        printJS({
          printable: dataUrl,
          type: 'image',
          documentTitle: '嘉兴港区气体泄漏检测管理平台',
          targetStyles: ['*'],
          style,
          imageStyle: 'width:100%;margin-bottom:20px;',
        });
      },
    );
  };

  onMounted(() => {
    getDetail();
  });
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
