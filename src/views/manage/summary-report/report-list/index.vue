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
            <DigitDisplay :value="dataList.orgCount" unit="家" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="报警器总数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.sensorCount" unit="个" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="监测气体种数"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <span>可燃: </span>
            <DigitDisplay
              :value="dataList.combustibleCount"
              unit="个"
              @on-click="navigateToReport(1)"
            />，
            <span>有毒: </span>
            <DigitDisplay :value="dataList.poisonous" unit="个" @on-click="navigateToReport(1)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="新增数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.insertCount" unit="个" @on-click="navigateToReport(2)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="拆除数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.deleteCount" unit="个" @on-click="navigateToReport(3)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="事件触发数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay :value="dataList.recordCount" unit="条" @on-click="navigateToReport(4)" />
          </a-descriptions-item>
          <a-descriptions-item
            label="维护保养数量"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <DigitDisplay
              :value="dataList.maintRecordCount"
              unit="个"
              @on-click="navigateToReport(5)"
            />
          </a-descriptions-item>
          <a-descriptions-item
            label="周期溯源情况"
            :label-style="{ fontWeight: 'bold', color: '#777' }"
          >
            <span>全部在有效期: </span>
            <DigitDisplay
              :value="dataList.traceCount"
              unit="个"
              @on-click="navigateToReport(6)"
            />，
            <span>部分超期: </span>
            <DigitDisplay
              :value="dataList.overdueCount"
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
  import { onMounted, reactive, ref } from 'vue';
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
    gasTypeCount?: string; // 监测气体种数
    maintRecordCount?: string; // 维护保养数量
    orgCount?: string; // 使用单位数量
    sensorCount?: string; // 报警器总数量
    deviceCount?: string;
    recordCount?: string; // 事件触发数量
    deleteCount?: string; // 拆除数量
    insertCount?: string; // 新增数量
    combustibleCount?: string; // 可燃气体数量
    poisonous?: string; // 有毒气体数量
    overdueCount?: string; // 部分超期
    traceCount?: string; // 全部在有效期
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
        gasTypeCount = '0',
        maintRecordCount = '0',
        orgCount = '0',
        sensorCount = '0',
        deviceCount = '0',
        recordCount = '0',
        traceCount = '0',
        deleteCount = '0',
        insertCount = '0',
        type_0 = '0',
        type_1 = '0',
        overdueCount = '0',
      } = response;

      dataList.gasTypeCount = gasTypeCount;
      dataList.maintRecordCount = maintRecordCount;
      dataList.orgCount = orgCount;
      dataList.sensorCount = sensorCount;
      dataList.recordCount = recordCount;
      dataList.traceCount = traceCount;
      dataList.overdueCount = overdueCount;

      dataList.deleteCount = deleteCount;
      dataList.insertCount = insertCount;

      dataList.combustibleCount = type_0;
      dataList.poisonous = type_1;
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
        go(`/summary/installation/report?${queryString}`);
        break;
      case 2:
        go(`/summary/addition/report?${queryString}`);
        break;
      case 3:
        go(`/summary/dismantling/report?${queryString}`);
        break;
      case 4:
        go(`/summary/event/report?${queryString}`);
        break;
      case 5:
        go(`/summary/maintenance/report?${queryString}`);
        break;
      case 6:
        go(`/summary/traceability/list?${queryString}&fig=1`);
        break;
      case 7:
        go(`/summary/traceability/list?${queryString}&fig=2`);
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

<style scoped lang="less">
  @import url('/@/design/index.less');

  .prefix {
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 20px;
      background-color: @primary-color;
      vertical-align: middle;
      margin-right: 4px;
    }
  }
</style>
