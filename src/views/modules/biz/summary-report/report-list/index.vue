<template>
  <div class="p-4">
    <div class="h-16 leading-16 bg-light-100 rounded-8px pl-4">
      <span class="font-bold mr-4 prefix">操作时间: </span>
      <a-space>
        <a-range-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model:value="params" />
        <a-button type="primary" @click="clickHandler">查询</a-button>
      </a-space>
    </div>

    <div class="h-110 bg-light-100 mt-4 rounded-8px p-4">
      <a-spin :spinning="isSpinning" tip="加载中...">
        <a-descriptions title="气体报警器状况总览" layout="vertical" bordered>
          <template #extra>
            <span class="font-bold">
              <Icon icon="ant-design:exclamation-circle-outlined" /> 温馨提示:
            </span>
            <span class="text-gray-500 ml-2"
              >点击下面数值可<span class="font-bold">跳转至</span>对应报表</span
            >
          </template>

          <a-descriptions-item
            label="使用单位数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.useUnitNum" unit="家" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="报警器总数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.sensorNum" unit="个" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="监测气体种数"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <span>可燃: </span>
            <DigitDisplay :value="dataList.gasNum0" unit="个" @on-click="navigateToReport(1)" />，
            <span>有毒: </span>
            <DigitDisplay :value="dataList.gasNum1" unit="个" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="新增数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay
              :value="dataList.insertSensorNum"
              unit="个"
              @on-click="navigateToReport(2)"
            />
          </a-descriptions-item>
          <a-descriptions-item
            label="拆除数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay
              :value="dataList.deleteSensorNum"
              unit="个"
              @on-click="navigateToReport(3)"
            />
          </a-descriptions-item>
          <a-descriptions-item
            label="事件触发数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.alarmNum" unit="条" @on-click="navigateToReport(4)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="维护保养数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay
              :value="dataList.maintRecordNum"
              unit="个"
              @on-click="navigateToReport(5)"
            />
          </a-descriptions-item>
          <a-descriptions-item
            label="周期溯源情况"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <span>全部在有效期: </span>
            <DigitDisplay :value="dataList.sensorTraceNum" unit="个" :isUnderline="false" />
            ，
            <span>邻近有效期: </span>
            <DigitDisplay :value="dataList.nearbySensorTraceNum" unit="个" :isUnderline="false" />
            ，
            <span>部分超期: </span>
            <DigitDisplay
              :value="dataList.overdueSensorTraceNum"
              unit="个"
              @on-click="navigateToReport(7)"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import type { Dayjs } from 'dayjs';
  import {
    RangePicker as ARangePicker,
    Space as ASpace,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Spin as ASpin,
  } from 'ant-design-vue';

  import Icon from '/@/components/Icon/Icon.vue';
  import DigitDisplay from './DigitDisplay.vue';

  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { useGo } from '/@/hooks/web/usePage';
  import { overviewData } from '/@/api/manage/summaryReport';

  type DataList = {
    maintRecordNum?: string; // 维护保养数量
    useUnitNum?: string; // 使用单位数量
    sensorNum?: string; // 报警器总数量
    alarmNum?: string; // 事件触发数量
    deleteSensorNum?: string; // 拆除数量
    insertSensorNum?: string; // 新增数量
    gasNum0?: string; // 可燃气体数量
    gasNum1?: string; // 有毒气体数量
    overdueSensorTraceNum?: string; // 部分超期
    nearbySensorTraceNum?: string; // 邻近过期
    sensorTraceNum?: string; // 全部在有效期
  };

  const go = useGo();

  const gasTypeOptions = ref<any[]>([]);
  const traceabilityStatusOptions = ref<any[]>([]);
  const isSpinning = ref<boolean>(false);
  const params = ref<[Dayjs, Dayjs] | undefined>(undefined);

  const dataList = reactive<DataList>({});

  /**
   * 时间查询
   */
  async function clickHandler() {
    await getOverviewData();
  }

  /**
   * 获取总览数据
   */
  async function getOverviewData() {
    isSpinning.value = true;

    try {
      const response = await overviewData({
        startDate: params.value?.[0],
        endDate: params.value?.[1],
      });

      const {
        maintRecordNum = '0',
        useUnitNum = '0',
        sensorNum = '0',
        sensorTraceNum = '0',
        nearbySensorTraceNum = '0',
        deleteSensorNum = '0',
        insertSensorNum = '0',
        gasNum0 = '0',
        gasNum1 = '0',
        overdueSensorTraceNum = '0',
        alarmNum = '0',
      } = response;

      dataList.maintRecordNum = maintRecordNum;
      dataList.useUnitNum = useUnitNum;
      dataList.sensorNum = sensorNum;
      dataList.sensorTraceNum = sensorTraceNum;
      dataList.overdueSensorTraceNum = overdueSensorTraceNum;
      dataList.nearbySensorTraceNum = nearbySensorTraceNum;
      dataList.deleteSensorNum = deleteSensorNum;
      dataList.insertSensorNum = insertSensorNum;
      dataList.gasNum0 = gasNum0;
      dataList.gasNum1 = gasNum1;
      dataList.alarmNum = alarmNum;
    } catch (error) {
      console.error(error);
    }

    isSpinning.value = false;
  }

  /**
   * 跳转至对应报表
   */
  function navigateToReport(type: number) {
    const queryString =
      params.value && params.value?.length > 0
        ? `startDate=${params.value?.[0]}&endDate=${params.value?.[1]}`
        : '';

    switch (type) {
      case 1:
        go(`/biz/summary/installation/report?${queryString}`);
        break;
      case 2:
        go(`/biz/summary/addition/statistic?${queryString}`);
        break;
      case 3:
        go(`/biz/summary/dismantling/statistic?${queryString}`);
        break;
      case 4:
        go(`/biz/summary/event/statistic?${queryString}`);
        break;
      case 5:
        go(`/biz/summary/maintenance/statistic?${queryString}`);
        break;
      case 6:
        go(`/biz/summary/traceability/list?${queryString}&fig=1`);
        break;
      case 7:
        go(`/biz/summary/traceability/list?${queryString}&fig=2`);
        break;
    }
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { gas_type, traceability_status } = await optionsListBatchApi([
      'gas_type',
      'traceability_status',
    ]);
    gasTypeOptions.value = gas_type || [];
    traceabilityStatusOptions.value = traceability_status || [];
  }

  onMounted(() => {
    initDict();

    getOverviewData();
  });
</script>
<script lang="ts">
  export default defineComponent({
    // 需要和路由的name一致
    name: 'SummaryReportListPage',
  });
</script>
<style scoped lang="less">
  @import url('/@/design/index.less');

  .prefix {
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 20px;
      margin-right: 4px;
      background-color: @primary-color;
      vertical-align: middle;
    }
  }
</style>
