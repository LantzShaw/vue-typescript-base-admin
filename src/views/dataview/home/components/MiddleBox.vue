<template>
  <div class="middle-container">
    <div class="middle-container-title">传感器当日状态</div>
    <div class="display-box mt-22px">
      <MiddleDataDisplayBox
        v-for="item in displayDataList"
        :label="item.label"
        :digit="item.value"
        :key="item.id"
      />
    </div>
    <div class="indicator">
      <MiddleIndicator
        :label="item.label"
        v-for="item in indicatorList"
        :key="item.id"
        :color="item.color"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import MiddleDataDisplayBox from './MiddleDataDisplayBox.vue';
  import MiddleIndicator from './MiddleIndicator.vue';

  import { sensorStatus } from '/@/api/dataview';

  type DisplayData = {
    id?: string;
    label?: string;
    value?: string;
  };

  type IndicatorData = {
    id?: string;
    color?: string;
    label?: string;
  };

  const displayDataList = ref<DisplayData[]>([
    {
      id: '1',
      label: '维护',
      value: '0',
    },
    {
      id: '2',
      label: '校准',
      value: '0',
    },
    {
      id: '3',
      label: '停用',
      value: '0',
    },
    {
      id: '4',
      label: '触发',
      value: '0',
    },
    {
      id: '5',
      label: '正常',
      value: '0',
    },
  ]);

  const indicatorList = ref<IndicatorData[]>([
    {
      id: '1',
      color: '#C0C0C0',
      label: '离线',
    },
    {
      id: '2',
      color: '#FBFF00',
      label: '异常',
    },
    {
      id: '3',
      color: '#05FF8A',
      label: '正常',
    },
  ]);

  async function getSensorStatusData() {
    try {
      const response = await sensorStatus();

      const { maintNum, calibrationNum, stopNum, alarmNum, normalNum } = response;

      unref(displayDataList)[0].value = maintNum;
      unref(displayDataList)[1].value = calibrationNum;
      unref(displayDataList)[2].value = stopNum;
      unref(displayDataList)[3].value = alarmNum;
      unref(displayDataList)[4].value = normalNum;
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(() => {
    getSensorStatusData();
  });
</script>

<style scoped lang="less">
  .middle-container {
    width: 1012px;
    padding: 0 55px;

    &-title {
      font-size: 18px;
      height: 30px;
      color: #fff;
      vertical-align: middle;
      display: inline-block;
      vertical-align: middle;
      line-height: 30px;
      font-weight: bold;

      &::before {
        content: '';
        width: 16px;
        height: 21px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        background: url('/@/assets/images/dataview/icon_arrow.png') top left no-repeat;
      }
    }
    .display-box {
      display: flex;
      justify-content: space-between;
    }

    .indicator {
      position: absolute;
      width: 100px;
      height: 100px;
      left: 479px;
      top: 720px;
    }
  }
</style>
