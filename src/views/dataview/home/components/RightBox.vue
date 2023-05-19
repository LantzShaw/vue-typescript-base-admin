<template>
  <div class="right-container">
    <section>
      <CardTitle label="溯源状态统计" />
      <div class="right-container--traceability">
        <RightBoxLiquidFill
          v-for="item in traceabilityStatusDataList"
          :title="item.title"
          :display-value="item.displayValue"
          :color-list="item.colorList"
          :key="item.id"
        />
      </div>
    </section>
    <section>
      <CardTitle label="事件触发流程统计" />
      <div class="right-container--event-trigger">
        <RightBoxBar
          v-for="item in eventTriggerDataList"
          :color="item.color"
          :display-value="item.displayValue"
          :label="item.label"
          :backgroundImagePath="item.backgroundImagePath"
          :key="item.id"
        />
      </div>
    </section>
    <section>
      <CardTitle label="维护流程统计" />
      <div class="right-container--maintain">
        <RightBoxPie />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import CardTitle from '../../CardTitle.vue';
  import RightBoxLiquidFill from './RightBoxLiquidFill.vue';
  import RightBoxBar from './RightBoxBar.vue';
  import RightBoxPie from './RightBoxPie.vue';

  import line_bg_1 from '/@/assets/images/dataview/line_bg_1.png';
  import line_bg_2 from '/@/assets/images/dataview/line_bg_2.png';
  import line_bg_3 from '/@/assets/images/dataview/line_bg_3.png';
  import line_bg_4 from '/@/assets/images/dataview/line_bg_4.png';

  type TraceabilityStatusData = {
    id?: string;
    title?: string;
    displayValue?: string;
    colorList?: string[];
  };

  type EventTriggerData = {
    id?: string;
    displayValue?: string;
    color?: string;
    label?: string;
    backgroundImagePath?: string;
  };

  const traceabilityStatusDataList = ref<TraceabilityStatusData[]>([
    {
      id: '1',
      title: '有效',
      displayValue: '580',
      colorList: ['#afe71c', '#15c29b', '#05b48d'],
    },
    {
      id: '2',
      title: '临近',
      displayValue: '580',
      colorList: ['#F6E284', '#D6A416', '#D59C03'],
    },
    {
      id: '3',
      title: '超期',
      displayValue: '580',
      colorList: ['#FFBA00', '#CA2F05', '#D76109'],
    },
  ]);

  const eventTriggerDataList = ref<EventTriggerData[]>([
    {
      id: '1',
      displayValue: '230',
      color: '#28F2E6',
      label: '1天内完成的',
      backgroundImagePath: line_bg_1,
    },
    {
      id: '2',
      displayValue: '210',
      color: '#FFCC00',
      label: '5天内完成的',
      backgroundImagePath: line_bg_2,
    },

    {
      id: '3',
      displayValue: '110',
      color: '#00CBFF',
      label: '10天内完成的',
      backgroundImagePath: line_bg_3,
    },
    {
      id: '4',
      displayValue: '200',
      color: '#00FF99',
      label: '15天内完成的',
      backgroundImagePath: line_bg_4,
    },
  ]);
</script>

<style scoped lang="less">
  .right-container {
    width: 424px;
    height: calc(100% - 102px);
    margin-right: 30px;

    &--traceability {
      height: 280px;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--event-trigger {
      height: 260px;
      padding-left: 16px;
      padding-right: 18px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--maintain {
      height: 280px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  }
</style>
