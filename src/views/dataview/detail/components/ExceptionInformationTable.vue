<template>
  <div>
    <TableTitle label="异常信息提示" @on-show="showModalHandler" />

    <Table :loading="isTableLoading" :columns="columns" :data-source="tableData" />
  </div>

  <a-modal
    :bodyStyle="{ background: '#19305e' }"
    :closable="false"
    :footer="null"
    width="800px"
    v-model:visible="isModalVisible"
  >
    <div>
      <div
        style="
          background-color: #243a66;
          height: 50px;
          color: #fff;
          line-height: 50px;
          font-weight: bold;
          padding-left: 10px;
        "
        >异常信息提示</div
      >
      <BasicTable :scroll="{ x: 700, y: 400 }" @register="registerTable" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Modal as AModal } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';

  import { useRoute } from 'vue-router';
  import { abnormalList } from '/@/api/dataview';
  import { useUserStore } from '/@/store/modules/user';

  import Table from './Table.vue';
  import TableTitle from './TableTitle.vue';

  import { BasicTable, useTable } from '/@/components/Table';

  const userStore = useUserStore();
  const route = useRoute();

  const organizationId = ref<string>((route.query.id as string) ?? userStore.getOrganizationId);
  const isTableLoading = ref<boolean>(false);

  const columns = [
    {
      title: '区域',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
      key: 'sensorName',
    },
    {
      title: '位号',
      dataIndex: 'locationNo',
      key: 'locationNo',
    },
    {
      title: '当前值',
      dataIndex: 'dtuipValue',
      key: 'dtuipValue',
    },
  ];

  /**
   * 构建registerTable
   */
  const [registerTable, { reload }] = useTable({
    title: '',
    api: abnormalList,
    beforeFetch: (params) => {
      params.organizationId = organizationId.value;
      return params;
    },
    columns: columns,
    canResize: false,
    showTableSetting: false,
    showIndexColumn: false,
    clickToRowSelect: false,
    clearSelectOnPageChange: true,
    maxHeight: 350,
  });

  const tableData = ref([]);

  const isModalVisible = ref<boolean>(false);

  function showModalHandler(open) {
    isModalVisible.value = open;

    reload();
  }

  async function getTableData() {
    isTableLoading.value = true;

    try {
      const response = await abnormalList({ pageSize: 5, organizationId: organizationId.value });

      if (response) {
        tableData.value = response.records;
      } else {
        tableData.value = [];
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      isTableLoading.value = false;
    }
  }

  onMounted(() => {
    getTableData();
  });
</script>

<style scoped lang="less">
  @import url('./styles.less');
</style>
