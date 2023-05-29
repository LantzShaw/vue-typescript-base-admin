<template>
  <BasicModal
    width="70%"
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    :title="title"
    :centered="true"
    :showOkBtn="false"
    cancelText="关闭"
  >
    <div style="padding-left: 10px; padding-right: 10px">
      <template v-if="workflowType === '1'">
        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">事件信息</div>
        <a-descriptions bordered>
          <a-descriptions-item label="所属单位" :span="2">{{
            record?.bizDeviceSensor?.bizEnterprise.enterpriseName ?? '--'
          }}</a-descriptions-item>

          <a-descriptions-item label="触发时间" :span="2">
            {{ record?.dtuipTriggerDate ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="异常情况" :span="4">
            <div>
              <span>传感器名称: </span>
              <span>{{ record.bizDeviceSensor?.sensorName ?? '--' }}</span>
            </div>
            <div>
              <span>位号: </span>
              <span>{{ record.bizDeviceSensor?.locationNo ?? '--' }}</span>
            </div>
            <div>
              <span>当前值: </span>
              <span>{{ record.dtuipTriggerVal ?? '--' }}</span>
            </div>
          </a-descriptions-item>
        </a-descriptions>

        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">事件接收</div>
        <a-descriptions bordered>
          <a-descriptions-item label="使用单位联系人" :span="2">
            {{ record?.stepOneByUser?.nickName }}
            {{ record?.stepOneByUser?.phoneNumber }}
          </a-descriptions-item>

          <a-descriptions-item label="维保单位联系人" :span="2">
            {{ record?.stepOneAffirmByUser?.nickName ?? '-' }}
            {{ record?.stepOneAffirmByUser?.phoneNumber ?? '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">事件处置</div>
        <a-descriptions bordered>
          <a-descriptions-item v-if="record?.stepOneRemark" label="数据复核" :span="4">
            <div>
              {{ record?.stepOneRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepOneImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepOneImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepOneByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepOneAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepOneAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item v-if="record?.stepTwoRemark" label="查找原因" :span="4">
            <div>
              {{ record.stepTwoRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepTwoImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepTwoImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepTwoByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepTwoAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepTwoAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepThreeRemark" label="采取措施" :span="4">
            <div>
              {{ record.stepThreeRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepThreeImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepThreeImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepThreeByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepThreeAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepThreeAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepFourRemark" label="措施落实" :span="4">
            <div>
              {{ record.stepFourRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepFourImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepFourImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepFourByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepFourAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepFourAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepFiveRemark" label="原因分析" :span="4">
            <div>
              {{ record.stepFiveRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepFiveImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepFiveImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepFiveByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepFiveAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepFiveAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepSevenRemark" label="举一反三" :span="4">
            <div>
              {{ record.stepSixRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepSixImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepSixImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepSixByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepSixAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepSixAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepSevenRemark" label="处置结果" :span="4">
            <div>
              {{ record.stepSevenRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepSevenImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepSevenImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepSevenByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepSevenAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepSevenAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </template>

      <template v-else-if="workflowType === '2'">
        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">基础信息</div>
        <a-descriptions bordered>
          <a-descriptions-item label="公司名称" :span="2">{{
            record?.apReceiveName ?? '--'
          }}</a-descriptions-item>

          <a-descriptions-item label="服务类型" :span="2">
            {{ record?.taskTypeDisplayName ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="计划时间" :span="2">
            {{ record?.startDate ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="预计时长" :span="2">
            {{ record?.duration ?? '--' }}天
          </a-descriptions-item>
          <a-descriptions-item label="实施人员" :span="2">
            {{ record?.implementationUser ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="陪同人员" :span="2">
            {{ record?.accompanyUser ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="联系人/电话" :span="2">
            {{ record?.apReceiveContacts ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="服务协议" :span="2">
            {{ record?.agreement ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="备注说明" :span="4">
            {{ record?.remark ?? '--' }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">实施目标</div>
        <div class="mt-2 mb-2">
          <div>
            <table>
              <thead>
                <tr>
                  <th v-for="column in sensorTableColumn" :key="column.key">
                    {{ column.title }}
                  </th>
                </tr>
              </thead>
              <tbody v-if="sensorTableData.length > 0">
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

        <div class="h-12 leading-12 text-center bg-gray-100 font-bold">维保处置内容</div>
        <a-descriptions bordered>
          <a-descriptions-item v-if="record?.stepOneRemark" label="工单实施" :span="4">
            <div>
              <div>
                {{ record?.stepOneRemark ?? '--' }}
              </div>
              <div class="flex" style="align-items: end; justify-content: space-between">
                <div>
                  <template v-if="record.stepOneImageUrlList">
                    <a-space>
                      <AuthImage
                        height="160px"
                        width="110px"
                        :key="index"
                        v-for="(imageUrl, index) in record.stepOneImageUrlList"
                        :fileUrl="imageUrl"
                      />
                    </a-space>
                  </template>
                </div>
                <div class="pr-20">
                  <div>
                    <span>提交人: </span>
                    <span>
                      {{ record.stepOneByUser?.nickName ?? '--' }}
                    </span>
                  </div>
                  <div>
                    <span> 确认人员: </span>
                    <span>
                      {{ record.stepOneAffirmByUser?.nickName ?? '--' }}
                    </span>
                  </div>
                  <div>
                    <span> 确认时间: </span>
                    <span>
                      {{ record.stepOneAffirmDate ?? '--' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item v-if="record?.stepTwoRemark" label="实施成果" :span="4">
            <div>
              {{ record?.stepTwoRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepTwoImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepTwoImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepTwoByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepTwoAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepTwoAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item v-if="record?.stepThreeRemark" label="完工单" :span="4">
            <div>
              {{ record?.stepThreeRemark ?? '--' }}
            </div>
            <div class="flex" style="align-items: end; justify-content: space-between">
              <div>
                <template v-if="record.stepThreeImageUrlList">
                  <a-space>
                    <AuthImage
                      height="160px"
                      width="110px"
                      :key="index"
                      v-for="(imageUrl, index) in record.stepThreeImageUrlList"
                      :fileUrl="imageUrl"
                    />
                  </a-space>
                </template>
              </div>
              <div class="pr-20">
                <div>
                  <span>提交人: </span>
                  <span>
                    {{ record.stepThreeByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认人员: </span>
                  <span>
                    {{ record.stepThreeAffirmByUser?.nickName ?? '--' }}
                  </span>
                </div>
                <div>
                  <span> 确认时间: </span>
                  <span>
                    {{ record.stepThreeAffirmDate ?? '--' }}
                  </span>
                </div>
              </div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Space as ASpace,
  } from 'ant-design-vue';

  import { AuthImage } from '/@/components/Upload';

  // 组件
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { workflowNotificationForm } from '/@/api/biz/workflowNotification';
  import { workflowDeviceMaintSensorPage } from '/@/api/biz/workflowDeviceMaintSensor';

  // data
  import { record } from './workflowNotification.data';

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

  const title = ref<string>('');

  const workflowType = ref<string>('');

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

  /**
   * 构建Drawer
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });

    title.value = data.record?.workflowTypeDisplayName ?? '查看';
    workflowType.value = data.record?.workflowType;

    record.value = ((await workflowNotificationForm({ id: data?.record?.id })) || {}) as Recordable;

    console.log('record', record.value, data);

    if (workflowType.value === '1') {
      record.value.stepOneImageUrlList =
        record.value?.stepOneBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepTwoImageUrlList =
        record.value?.stepTwoBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepThreeImageUrlList =
        record.value?.stepThreeBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepFourImageUrlList =
        record.value?.stepFourBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepFiveImageUrlList =
        record.value?.stepFiveBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepSixImageUrlList =
        record.value?.stepSixBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);

      record.value.stepSevenImageUrlList =
        record.value?.stepSevenBizWorkflowAlarmDealRecordAttList?.map((item) => item.attPath);
    } else {
      record.value.stepOneImageUrlList =
        record.value?.stepOneBizWorkflowDeviceMaintRecordAttList?.map((item) => item.attPath);

      record.value.stepTwoImageUrlList =
        record.value?.stepTwoBizWorkflowDeviceMaintRecordAttList?.map((item) => item.attPath);

      record.value.stepThreeImageUrlList =
        record.value?.stepThreeBizWorkflowDeviceMaintRecordAttList?.map((item) => item.attPath);

      const tempRecord = await workflowDeviceMaintSensorPage({ recordId: data?.record?.recordId });

      sensorTableData.value = tempRecord?.records ?? [];
    }

    setModalProps({ loading: false, confirmLoading: false });
  });
</script>

<style lang="less" scoped>
  table,
  td,
  th {
    border: 1px solid #ddd;
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
    border-bottom: 1px solid #ddd;
    padding-right: 60px;
    padding-left: 60px;
    margin-left: 10px;
    font-weight: bold;
  }
</style>
