<template>
  <PageWrapper :title="pageTitle" :contentBackground="false" @back="goBack">
    <a-row :span="24" :gutter="[10, 10]">
      <a-col :span="8">
        <a-card
          :title="`${sensorInformation.sensorName}传感器信息`"
          :bordered="false"
          style="height: 100%"
        >
          <div class="cell"
            ><span class="mr-2">传感器类型: </span>
            <dict-label
              style="display: inline-block"
              :options="sensorTypeOptions"
              :value="sensorInformation.dtuipSensorTypeId"
            />
          </div>
          <div class="cell">
            <span class="mr-2">当前状态:</span>
            <dict-label
              style="display: inline-block"
              :options="onlineStatusOptions"
              :value="sensorInformation.dtuipIsLine"
            />
          </div>
          <div class="cell">
            <span class="mr-2">当前值:</span>
            <span>{{ `${sensorInformation.dtuipValue}${sensorInformation.dtuipUnit}` }}</span>
          </div>
          <div class="cell"
            ><span class="mr-2">更新时间:</span>
            <span>{{ sensorInformation.dtuipUpdateDate }}</span></div
          >
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="区域设备" :bordered="false">
          <!-- <template #extra>
            <a>数据导出</a>
          </template> -->
          <BasicTable
            :maxHeight="160"
            :columns="columns"
            :dataSource="data"
            :rowSelection="rowSelection"
          >
          </BasicTable>
        </a-card>
      </a-col>
      <a-col :span="24">
        <History :id="id" />
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { Row as ARow, Col as ACol, Card as ACard } from 'ant-design-vue';

  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';

  import History from './History.vue';

  import { BasicTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  import { columns, data } from './data';

  import { BasicColumn } from '/@/components/Table';
  import { sensorForm, sensorPage } from '/@/api/manage/sensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  type SensorInformation = {
    sensorName?: string;
    dtuipUnit?: string;
    dtuipValue?: string;
    dtuipUpdateDate?: string;
    dtuipIsLine?: string;
    dtuipSensorTypeId?: string;
  };

  const onlineStatusOptions = ref<any[]>([]);
  const deleteStatusOptions = ref<any[]>([]);
  const alarmStatusOptions = ref<any[]>([]);
  const sensorTypeOptions = ref<any[]>([]);

  const sensorInformation = reactive<SensorInformation>({});

  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRowKeys: (string | number)[], selectedRows: BasicColumn[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record: BasicColumn, selected: boolean, selectedRows: BasicColumn[]) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: BasicColumn[], changeRows: BasicColumn[]) => {
      console.log(selected, selectedRows, changeRows);
    },
  });

  const route = useRoute();
  const go = useGo();

  const pageTitle = ref<string>(route.query?.deviceName as string);
  const id = ref<string>(route.params?.id as string);
  const regionId = ref<string>(route.query?.regionId as string);

  /**
   * 获取传感器信息
   */
  async function getSensorInformation() {
    const response = await sensorForm({ id: id.value });

    const { sensorName, dtuipUnit, dtuipValue, dtuipUpdateDate, dtuipIsLine, dtuipSensorTypeId } =
      response;

    sensorInformation.sensorName = sensorName;
    sensorInformation.dtuipUnit = dtuipUnit;
    sensorInformation.dtuipValue = dtuipValue;
    sensorInformation.dtuipUpdateDate = dtuipUpdateDate;
    sensorInformation.dtuipIsLine = dtuipIsLine;
    sensorInformation.dtuipSensorTypeId = dtuipSensorTypeId + '';

    console.log('response: ', response);
  }

  /**
   * 获取区域设备
   */
  async function getRegionSensor() {
    const response = await sensorPage({ regionId: regionId.value });

    console.log('---------------response---------------', response);
  }

  /**
   * 返回事件触发列表页面
   */
  function goBack() {
    go('/event-trigger/event/list');
  }

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { alarm_status, delete_status, online_status, sensor_type } = await optionsListBatchApi([
      'alarm_status',
      'delete_status',
      'online_status',
      'sensor_type',
    ]);
    alarmStatusOptions.value = alarm_status || [];
    deleteStatusOptions.value = delete_status || [];
    onlineStatusOptions.value = online_status || [];
    sensorTypeOptions.value = sensor_type || [];
  }

  onMounted(() => {
    initDict();
    getSensorInformation();
    getRegionSensor();
  });
</script>

<style scoped lang="less">
  .cell {
    height: 32px;
    line-height: 32px;
  }
</style>
