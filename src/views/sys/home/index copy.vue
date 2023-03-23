<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <ProjectCard :loading="loading" class="enter-y" />
      </div>

      <Verify
        :captchaType="'blockPuzzle'"
        :getApi="reqGet"
        :checkApi="reqCheck"
        :imgSize="{ width: '400px', height: '200px' }"
        ref="verify"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { Verify } from '/@/components/Verifition';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import QuickNav from './components/QuickNav.vue';
  import DynamicInfo from './components/DynamicInfo.vue';
  import SaleRadar from './components/SaleRadar.vue';
  import { reqGet, reqCheck } from '/@/api/sys/captcha';
  const loading = ref(true);
  const captchaType = ref('');
  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
