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
            <span>{{ sensorInformation.enterpriseName ?? '--' }}</span>
          </div>
          <div class="cell">
            <span class="mr-2">所属区域:</span>
            <span>{{ sensorInformation.regionName ?? '--' }}</span>
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
        <div class="div-card">
          <a-card title="区域传感器" :bordered="false">
            <!-- <template #extra>
            <a>数据导出</a>
          </template> -->
            <BasicTable
              @register="registerTable"
              :clickToRowSelect="false"
              :row-selection="{
                checkStrictly: false,
                type: 'checkbox',
                selectedRowKeys: checkedKeys,
                onSelect: onSelect,
                onSelectAll: onSelectAll,
              }"
            />
          </a-card>
        </div>
      </a-col>
      <a-col :span="24">
        <History :recordId="recordId" :sensorIds="checkedKeys" />
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Row as ARow, Col as ACol, Card as ACard } from 'ant-design-vue';

  import { PageWrapper } from '/@/components/Page';

  import History from './History.vue';

  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { DictLabel } from '/@/components/DictLabel/index';

  import { sensorForm, sensorPage } from '/@/api/biz/sensor';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  type SensorInformation = {
    sensorName?: string;
    dtuipUnit?: string;
    dtuipValue?: string;
    dtuipUpdateDate?: string;
    dtuipIsLine?: string;
    dtuipSensorTypeId?: string;
    enterpriseName?: string;
    regionName?: string;
    locationNo?: string;
  };

  const route = useRoute();
  const { closeCurrent } = useTabs();

  const onlineStatusOptions = ref<any[]>([]);
  const deleteStatusOptions = ref<any[]>([]);
  const alarmStatusOptions = ref<any[]>([]);
  const sensorTypeOptions = ref<any[]>([]);
  const checkedKeys = ref<Array<string | number>>([route.query?.sensorId as string]);

  const sensorInformation = reactive<SensorInformation>({});
  const isCardLoading = ref<boolean>(false);
  const tableColumns: BasicColumn[] = [
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
      width: 120,
    },
    {
      title: '位号',
      dataIndex: 'locationNo',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 100,
    },
  ];

  const go = useGo();

  const pageTitle = ref<string>('');
  const recordId = ref<string>(route.params?.id as string);
  const sensorId = ref<string>(route.query?.sensorId as string);
  const region = ref<string>(route.query?.regionId as string);

  /**
   * 构建registerTable
   */
  const [registerTable] = useTable({
    title: '',
    api: sensorPage,
    columns: tableColumns,
    searchInfo: {
      regionId: region.value,
    },
    canResize: true,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    maxHeight: 160,
  });

  function onSelect(record, selected) {
    console.log('select', record, selected);

    // if (checkedKeys.value.length >= 5) {
    //   notification.warning({ message: `最多可选中5条数据!` });

    //   return;
    // }

    if (record.id === route.query?.sensorId) return;

    if (selected) {
      checkedKeys.value = [...checkedKeys.value, record.id];
    } else {
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

    try {
      const response = await sensorForm({ id: sensorId.value });

      if (response) {
        const {
          sensorName,
          dtuipUnit,
          dtuipValue,
          dtuipUpdateDate,
          dtuipIsLine,
          dtuipSensorTypeId,
          regionId,
          bizEnterprise,
          bizInstallRegion,
          locationNo,
        } = response;

        sensorInformation.sensorName = sensorName;
        sensorInformation.dtuipUnit = dtuipUnit;
        sensorInformation.dtuipValue = dtuipValue;
        sensorInformation.dtuipUpdateDate = dtuipUpdateDate;
        sensorInformation.dtuipIsLine = dtuipIsLine;
        sensorInformation.dtuipSensorTypeId = dtuipSensorTypeId + '';
        sensorInformation.enterpriseName = bizEnterprise?.enterpriseName;
        sensorInformation.regionName = bizInstallRegion?.regionName;
        sensorInformation.locationNo = locationNo;

        region.value = regionId;

        pageTitle.value = `${sensorInformation.sensorName}`;
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      isCardLoading.value = false;
    }
  }

  /**
   * 返回事件触发列表页面
   */
  function goBack() {
    closeCurrent();

    go('/biz/alarm-management/record');
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
  .div-card {
    :deep(.ant-card-body) {
      padding: 8px 0;
    }
  }

  .cell {
    height: 32px;
    line-height: 32px;
  }
</style>
