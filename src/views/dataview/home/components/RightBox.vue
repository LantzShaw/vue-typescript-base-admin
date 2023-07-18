<template>
  <div class="right-container">
    <section>
      <CardTitle label="溯源状态统计" />
      <div class="right-container--traceability">
        <TraceabilityLiquidFill
          v-for="item in traceabilityStatusDataList"
          :title="item.title"
          :display-value="item.displayValue"
          :chart-data="item.chartData"
          :color-list="item.colorList"
          :key="item.id"
        />
      </div>
    </section>
    <section>
      <CardTitle label="事件触发流程统计" />
      <div class="right-container--event-trigger">
        <EventTriggerBar
          v-for="item in eventTriggerDataList"
          :color="item.color"
          :display-value="item.displayValue"
          :label="item.label"
          :backgroundImagePath="item.backgroundImagePath"
          :key="item.id"
          :totalRecords="totalRecords"
        />
      </div>
    </section>
    <section>
      <CardTitle label="维护流程统计" />
      <div class="right-container--maintain">
        <MaintenanceBar />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';

  import CardTitle from '../../CardTitle.vue';
  import EventTriggerBar from '../../EventTriggerBar.vue';
  import MaintenanceBar from '../../MaintenanceBar.vue';
  import TraceabilityLiquidFill from '../../TraceabilityLiquidFill.vue';

  import { statisticsAlarmProcess, statisticsTraceStatus } from '/@/api/dataview';

  import line_bg_1 from '/@/assets/images/dataview/line_bg_1.png';
  import line_bg_2 from '/@/assets/images/dataview/line_bg_2.png';
  import line_bg_3 from '/@/assets/images/dataview/line_bg_3.png';
  import line_bg_4 from '/@/assets/images/dataview/line_bg_4.png';

  type TraceabilityStatusData = {
    id?: string;
    title?: string;
    displayValue?: number;
    chartData?: string;
    colorList?: string[];
  };

  type EventTriggerData = {
    id?: string;
    displayValue?: number;
    color?: string;
    label?: string;
    backgroundImagePath?: string;
  };

  const traceabilityStatusDataList = ref<TraceabilityStatusData[]>([
    {
      id: '1',
      title: '有效',
      displayValue: 0,
      chartData: '0',
      colorList: ['#afe71c', '#15c29b', '#05b48d'],
    },
    {
      id: '2',
      title: '临近',
      displayValue: 0,
      chartData: '0',
      colorList: ['#F6E284', '#D6A416', '#D59C03'],
    },
    {
      id: '3',
      title: '超期',
      displayValue: 0,
      chartData: '0',
      colorList: ['#FFBA00', '#CA2F05', '#D76109'],
    },
  ]);

  const eventTriggerDataList = ref<EventTriggerData[]>([
    {
      id: '1',
      displayValue: 0,
      color: '#28F2E6',
      label: '1天内完成的',
      backgroundImagePath: line_bg_1,
    },
    {
      id: '2',
      displayValue: 0,
      color: '#FFCC00',
      label: '5天内完成的',
      backgroundImagePath: line_bg_2,
    },

    {
      id: '3',
      displayValue: 0,
      color: '#00CBFF',
      label: '10天内完成的',
      backgroundImagePath: line_bg_3,
    },
    {
      id: '4',
      displayValue: 0,
      color: '#00FF99',
      label: '15天内完成的',
      backgroundImagePath: line_bg_4,
    },
  ]);

  const totalRecords = ref<number>(0);

  /**
   * 溯源状态统计
   */
  const getTraceabilityStatusChartData = async () => {
    try {
      const response = await statisticsTraceStatus();

      const { validNum = 0, nearNum = 0, overdueNum = 0 } = response;

      const total = validNum + nearNum + overdueNum;

      unref(traceabilityStatusDataList)[0].displayValue = validNum;
      unref(traceabilityStatusDataList)[0].chartData = (validNum / total).toFixed(2);

      unref(traceabilityStatusDataList)[1].displayValue = nearNum;
      unref(traceabilityStatusDataList)[1].chartData = (nearNum / total).toFixed(2);

      unref(traceabilityStatusDataList)[2].displayValue = overdueNum;
      unref(traceabilityStatusDataList)[2].chartData = (overdueNum / total).toFixed(2);
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * 事件触发流程统计
   */
  const getStatisticsAlarmProcessChartData = async () => {
    try {
      const response = await statisticsAlarmProcess({ organizationId: '' });

      const { list = [], sum = 0 } = response;

      totalRecords.value = sum;

      unref(eventTriggerDataList)[0].displayValue = list[0].value;
      unref(eventTriggerDataList)[1].displayValue = list[1].value;
      unref(eventTriggerDataList)[2].displayValue = list[2].value;
      unref(eventTriggerDataList)[3].displayValue = list[3].value;
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    getTraceabilityStatusChartData();

    getStatisticsAlarmProcessChartData();
  });
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
