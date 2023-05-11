<template>
  <PageWrapper dense contentFullHeight />
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  // hooks
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { PageWrapper } from '/@/components/Page';

  onMounted(() => {});
</script>

<style lang="less" scoped></style>
