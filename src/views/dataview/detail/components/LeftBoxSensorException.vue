<template>
  <div>
    <SeamlessScrollTable
      :loading="isTableLoading"
      :evenCellStyle="{ backgroundColor: '#0D316E' }"
      :oddCellStyle="{ backgroundColor: 'transparent' }"
      :columns="columns"
      :data-source="tableData"
    >
      <template #regionName="{ record }">
        <span style="color: #7bbcee">{{ record.regionName }}</span>
      </template>

      <template #bizDeviceSensorNum="{ record }">
        <span style="color: #ffbc38">{{ record.bizDeviceSensorNum }}</span>
      </template>
    </SeamlessScrollTable>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { statisticsSensorAbnormal } from '/@/api/dataview';
  import { useUserStore } from '/@/store/modules/user';

  import SeamlessScrollTable from './SeamlessScrollTable.vue';

  const userStore = useUserStore();
  const route = useRoute();

  const organizationId = ref<string>((route.query.id as string) ?? userStore.getOrganizationId);
  const isTableLoading = ref<boolean>(false);

  const columns = [
    {
      title: '区域名称',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '传感器数量(个)',
      dataIndex: 'bizDeviceSensorNum',
      key: 'bizDeviceSensorNum',
    },
  ];

  const tableData = ref([]);

  async function getTableData() {
    isTableLoading.value = true;

    try {
      const response = await statisticsSensorAbnormal({
        organizationId: organizationId.value,
      });

      if (response) {
        tableData.value = response;
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
