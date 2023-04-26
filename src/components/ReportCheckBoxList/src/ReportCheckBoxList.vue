<template>
  <ReportCheckBoxItem
    :active="value"
    v-for="item in data"
    :name="item.name"
    :value="item.value"
    :key="item.id"
  />
</template>

<script lang="ts" setup>
  import ReportCheckBoxItem from './ReportCheckBoxItem.vue';
  import { ReportCheckBoxDataList } from './types';

  type Props = {
    value?: string;
    data?: ReportCheckBoxDataList[];
  };

  withDefaults(defineProps<Props>(), {});
</script>
