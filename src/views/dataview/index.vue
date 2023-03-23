<template>
  <div>
    <ScreenContainer> dataview </ScreenContainer>

    <AMapSearch v-model:position="currentPosition" />

    <div>{{ currentPosition }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { ScreenContainer } from '/@/components/ScreenContainer';
  import { AMapSearch } from '/@/components/AMap';

  const currentPosition = ref<string[]>([]);
</script>

<style lang="less" scoped></style>
