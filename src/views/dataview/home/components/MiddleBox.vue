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
  import { ref } from 'vue';
  import MiddleDataDisplayBox from './MiddleDataDisplayBox.vue';
  import MiddleIndicator from './MiddleIndicator.vue';

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
      value: '7',
    },
    {
      id: '2',
      label: '校准',
      value: '12',
    },
    {
      id: '3',
      label: '停用',
      value: '3',
    },
    {
      id: '4',
      label: '触发',
      value: '19',
    },
    {
      id: '5',
      label: '正常',
      value: '6',
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
</script>

<style scoped lang="less">
  .middle-container {
    width: 1012px;
    padding: 0 55px;

    &-title {
      font-size: 18px;
      height: 30px;
      color: #fff;
      font-family: Georgia, 'Times New Roman', Times, serif;
      vertical-align: middle;
      display: inline-block;
      vertical-align: middle;
      line-height: 30px;

      &::before {
        content: '';
        width: 16px;
        height: 21px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        // background-color: #f40;
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
