<template>
  <div class="enterprise-container">
    <div class="enterprise-container--sub-title">
      <span class="clip-text">企业名称企业名称</span>
    </div>
    <div class="display-box">
      <LeftBoxEnterpriseDisplayBox
        v-for="item in enterpriseDataList"
        :personType="item.personType"
        :userName="item.userName"
        :phoneNumber="item.phoneNumber"
        :backgroundImagePath="item.backgroundImagePath"
        :key="item.id"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import LeftBoxEnterpriseDisplayBox from './LeftBoxEnterpriseDisplayBox.vue';

  import display_data_bg_1 from '/@/assets/images/dataview/display_data_bg_1.png';
  import display_data_bg_2 from '/@/assets/images/dataview/display_data_bg_2.png';
  import display_data_bg_3 from '/@/assets/images/dataview/display_data_bg_3.png';

  type EnterpriseData = {
    id: string;
    personType: string;
    userName: string;
    phoneNumber: string;
    backgroundImagePath: string;
  };

  const enterpriseDataList = ref<EnterpriseData[]>([
    {
      id: '1',
      personType: '安全负责人',
      userName: '张三',
      phoneNumber: '188****1234',
      backgroundImagePath: display_data_bg_1,
    },
    {
      id: '2',
      personType: '法人',
      userName: '张三',
      phoneNumber: '188****1234',
      backgroundImagePath: display_data_bg_2,
    },
    {
      id: '2',
      personType: '专工',
      userName: '张三',
      phoneNumber: '188****1234',
      backgroundImagePath: display_data_bg_3,
    },
  ]);
</script>

<style scoped lang="less">
  .enterprise-container {
    &--sub-title {
      width: 396px;
      height: 53px;
      text-align: center;
      line-height: 53px;
      background: url('/@/assets/images/dataview/sub_title_bg.png') top left no-repeat;

      .clip-text {
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #fff;
        background: linear-gradient(360deg, #439cca 0%, #ffffff 78%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .display-box {
      height: 200px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
