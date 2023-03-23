<template>
  <PageWrapper :title="pageTitle" :contentBackground="false" @back="goBack">
    <a-row :span="24" :gutter="[10, 10]">
      <a-col :span="8">
        <a-card title="传感器信息" :bordered="false" style="height: 100%">
          <div class="cell"><span>传感器类型:</span> <span>数值</span></div>
          <div class="cell"><span>当前状态:</span> <span>已连接</span></div>
          <div class="cell"><span>当前值:</span> <span>12</span></div>
          <div class="cell"><span>更新时间:</span> <span>2023-03-18 12:00:00</span></div>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="历史数据" :bordered="false">
          <template #extra>
            <a>数据导出</a>
          </template>
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
        <a-card title="历史曲线" :bordered="false">
          <template #actions> </template>
          <template #extra>
            <a-typography-text style="margin-right: 12px" strong type="secondary"
              >时间: 2023-03-18 12:00:00</a-typography-text
            >
            <a-divider type="vertical" style="background-color: #ddd" />
            <a-button type="link" postIcon="ant-design:arrow-right-outlined"> 前往打印 </a-button>
          </template>
          <History />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  import {
    Row as ARow,
    Col as ACol,
    Card as ACard,
    TypographyText as ATypographyText,
    Divider as ADivider,
  } from 'ant-design-vue';

  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';

  import History from './History.vue';
  import { BasicTable } from '/@/components/Table';

  import { columns, data } from './data';

  import { BasicColumn } from '/@/components/Table';

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

  function goBack() {
    go('/event-trigger/event/list');
  }
</script>

<style scoped lang="less">
  .cell {
    height: 32px;
    line-height: 32px;
  }
</style>
