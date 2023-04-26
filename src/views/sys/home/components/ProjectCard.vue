<template>
  <Card title="我的应用(点击应用进行切换应用)" v-bind="$attrs">
    <template v-for="item in applicationData" :key="item.id">
      <CardGrid
        :class="generateClassName(item.id, applicationId)"
        :hoverable="true"
        @click="handleChangeApplication(item, applicationId)"
      >
        <span class="flex">
          <span class="text-lg ml-4">{{ item.applicationName }} </span>
        </span>
        <div class="flex mt-2 h-10 text-secondary">{{ item.applicationName }}</div>
        <div class="flex justify-between text-secondary">
          <dict-label :options="dataItemStatusOptions" :value="item.status" />
          <span>版本:{{ item.currentVersion }}</span>
        </div>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, computed } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Card } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { DictLabel } from '/@/components/DictLabel/index';
  import { useUserStore } from '/@/store/modules/user';

  // 接口
  import { getMyApplication } from '/@/api/sys/user';
  import { optionsListBatchApi } from '/@/api/sys/dict';

  export default defineComponent({
    components: { Card, CardGrid: Card.Grid, Icon, DictLabel },
    setup() {
      const { createMessage } = useMessage();
      const { warning, error } = createMessage;

      const { refreshMenu } = usePermission();
      const userStore = useUserStore();
      const dataItemStatusOptions = ref<any[]>([]);
      const applicationData = ref<any[]>([]);

      async function getApplication() {
        const data = await getMyApplication();
        applicationData.value = data || [];
      }
      async function initDict() {
        const { data_item_status } = await optionsListBatchApi(['data_item_status']);
        dataItemStatusOptions.value = data_item_status || [];
      }

      async function handleChangeApplication(app: Recordable, applicationId: string) {
        if (app.status !== '0') {
          error('应用[' + app.applicationName + ']已停用');
          return;
        }
        if (app.id === applicationId) {
          warning('您当前正处于[' + app.applicationName + ']，无需切换');
        } else {
          userStore.setApplicationId(app.id);
          // 重新获取用户信息和菜单
          userStore.getUserInfoAction();
          refreshMenu();
        }
      }
      function generateClassName(id: string, applicationId: string) {
        if (id === applicationId) {
          return '!md:w-1/3 !w-full appDisabled';
        } else {
          return '!md:w-1/3 !w-full';
        }
      }
      onMounted(() => {
        initDict();
        getApplication();
      });

      return {
        applicationId: computed(() => userStore.getApplicationId),
        applicationData,
        dataItemStatusOptions,
        handleChangeApplication,
        generateClassName,
      };
    },
  });
</script>
<style lang="less">
  .ant-card-grid-hoverable {
    cursor: pointer;
  }

  .appDisabled {
    color: #000000bf;
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
</style>
