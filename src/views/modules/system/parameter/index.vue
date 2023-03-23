<template>
  <a-card
    style="width: 100%"
    :bordered="false"
    :tab-list="tabListNoTitle"
    :active-tab-key="noTitleKey"
    @tab-change="(key) => onTabChange(key, 'noTitleKey')"
  >
    <p v-if="noTitleKey === 'sysConfig'">
      <OtherParameter />
    </p>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Card, Row, Col } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import OtherParameter from './OtherParameter.vue';

  // 接口
  import { configPage, configDelete } from '/@/api/system/config';
  import { optionsListBatchApi } from '/@/api/sys/dict';
  // data
  import { parameterTypeOptions, tfOptions, searchForm, tableColumns } from './config.data';
  const ACard = Card;
  const ARow = Row;
  const ACol = Col;
  const { t } = useI18n();
  const { notification } = useMessage();

  const key = ref('sysConfig');
  const noTitleKey = ref('sysConfig');

  const tabListNoTitle = [
    {
      key: 'sysConfig',
      tab: '系统配置',
    },
    {
      key: 'emailConfig',
      tab: '邮件配置',
    },
    {
      key: 'smsConfig',
      tab: '短信配置',
    },
    {
      key: 'fileConfig',
      tab: '文件配置',
    },
    {
      key: 'thirdConfig',
      tab: '第三方配置',
    },
    {
      key: 'otherConfig',
      tab: '其他配置',
    },
  ];

  const onTabChange = (value, type) => {
    if (type === 'key') {
      key.value = value;
    } else if (type === 'noTitleKey') {
      noTitleKey.value = value;
    }
  };

  /**
   * 初始化字典数据
   */
  async function initDict() {
    const { tf, parameter_type } = await optionsListBatchApi(['tf', 'parameter_type']);
    tfOptions.value = tf || [];
    parameterTypeOptions.value = parameter_type || [];
  }

  onMounted(() => {
    initDict();
  });
</script>
