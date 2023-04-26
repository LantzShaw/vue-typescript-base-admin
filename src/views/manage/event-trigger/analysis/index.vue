<template>
  <PageWrapper :title="pageTitle" :contentBackground="false" @back="goBack">
    <a-row :span="24" :gutter="[10, 10]">
      <a-col :span="8">
        <a-card
          :loading="isCardLoading"
          title="传感器基本信息"
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
            <span>{{ `${sensorInformation.dtuipValue} ${sensorInformation.dtuipUnit}` }}</span>
          </div>
          <div class="cell">
            <span class="mr-2">所属公司:</span>
            <span>{{ sensorInformation.orgName ?? '--' }}</span>
          </div>
          <div class="cell">
            <span class="mr-2">所属区域:</span>
            <span>{{ sensorInformation.installRegion ?? '--' }}</span>
          </div>
          <div class="cell">
            <span class="mr-2">位号:</span>
            <span>{{ sensorInformation.locationNo ?? '--' }}</span>
          </div>
          <div class="cell"
            ><span class="mr-2">更新时间:</span>
            <span>{{ sensorInformation.dtuipUpdateDate ?? '--' }}</span></div
          >
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="区域传感器" :bordered="false">
          <!-- <template #extra>
            <a>数据导出</a>
          </template> -->
          <BasicTable
            :loading="isTableLoading"
            rowKey="id"
            :maxHeight="160"
            :columns="columns"
            :dataSource="sensorTableData"
            :row-selection="{
              checkStrictly: false,
              selectedRowKeys: checkedKeys,
              onSelect: onSelect,
              onSelectAll: onSelectAll,
            }"
          >
          </BasicTable>
        </a-card>
      </a-col>
      <a-col :span="24">
        <History :ids="checkedKeys" />
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

  import { BasicColumn } from '/@/components/Table';
  import { sensorForm, sensorPage } from '/@/api/manage/sensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTabs } from '/@/hooks/web/useTabs';

  type SensorInformation = {
    sensorName?: string;
    dtuipUnit?: string;
    dtuipValue?: string;
    dtuipUpdateDate?: string;
    dtuipIsLine?: string;
    dtuipSensorTypeId?: string;
    orgName?: string;
    installRegion?: string;
    locationNo?: string;
  };

  const route = useRoute();
  const { notification } = useMessage();
  const { closeCurrent } = useTabs();

  const onlineStatusOptions = ref<any[]>([]);
  const deleteStatusOptions = ref<any[]>([]);
  const alarmStatusOptions = ref<any[]>([]);
  const sensorTypeOptions = ref<any[]>([]);
  const checkedKeys = ref<Array<string | number>>([route.params?.id as string]);
  // const checkedKeys = ref<string[] | number[]>([route.params?.id as string]);

  const sensorInformation = reactive<SensorInformation>({});
  const isCardLoading = ref<boolean>(false);
  const isTableLoading = ref<boolean>(false);
  const sensorTableData = ref<any[]>();
  const columns: BasicColumn[] = [
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ];

  const go = useGo();

  const pageTitle = ref<string>('');
  const id = ref<string>(route.params?.id as string);
  const region = ref<string>('');

  function onSelect(record, selected) {
    console.log('select', record, selected);

    // if (checkedKeys.value.length >= 5) {
    //   notification.warning({ message: `最多可选中5条数据!` });

    //   return;
    // }

    if (selected) {
      console.log('select 1');
      checkedKeys.value = [...checkedKeys.value, record.id];
    } else {
      console.log('select 2');

      checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
    }
  }

  function onSelectAll(selected, selectedRows, changeRows) {
    const changeIds = changeRows.map((item) => item.id);
    if (selected) {
      checkedKeys.value = [...checkedKeys.value, ...changeIds];
    } else {
      checkedKeys.value = checkedKeys.value.filter((id) => {
        return !changeIds.includes(id);
      });
    }
  }

  /**
   * 获取传感器信息
   */
  async function getSensorInformation() {
    isCardLoading.value = true;

    const response = await sensorForm({ id: id.value });

    const {
      dtuipSensorName,
      dtuipUnit,
      dtuipValue,
      dtuipUpdateDate,
      dtuipIsLine,
      dtuipSensorTypeId,
      regionId,
      orgName,
      installRegion,
      locationNo,
    } = response;

    sensorInformation.sensorName = dtuipSensorName;
    sensorInformation.dtuipUnit = dtuipUnit;
    sensorInformation.dtuipValue = dtuipValue;
    sensorInformation.dtuipUpdateDate = dtuipUpdateDate;
    sensorInformation.dtuipIsLine = dtuipIsLine;
    sensorInformation.dtuipSensorTypeId = dtuipSensorTypeId + '';
    sensorInformation.orgName = orgName;
    sensorInformation.installRegion = installRegion;
    sensorInformation.locationNo = locationNo;

    region.value = regionId;

    pageTitle.value = `${dtuipSensorName}传感器`;

    // checkedKeys.value.push(regionId);

    await getRegionSensor();

    isCardLoading.value = false;
  }

  /**
   * 获取区域设备
   */
  async function getRegionSensor() {
    isTableLoading.value = true;

    const response = await sensorPage({ regionId: region.value });

    sensorTableData.value = response.records;

    isTableLoading.value = false;
  }

  /**
   * 返回事件触发列表页面
   */
  function goBack() {
    closeCurrent();

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
  });
</script>

<style scoped lang="less">
  .cell {
    height: 32px;
    line-height: 32px;
  }
</style>
