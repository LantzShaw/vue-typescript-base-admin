<template>
  <a-typography-link strong :underline="isUnderline" @click="clickHandler">
    <span class="text-3xl font-bold">{{ value }}</span>
  </a-typography-link>
  <span class="ml-1">{{ unit }}</span>
</template>

<script lang="ts" setup>
  import { TypographyLink as ATypographyLink } from 'ant-design-vue';

  const emit = defineEmits(['on-click']);

  type Props = {
    value?: string | number;
    unit?: string | number;
    isUnderline?: boolean;
  };

  withDefaults(defineProps<Props>(), {
    isUnderline: true,
  });

  function clickHandler() {
    emit('on-click');
  }
</script>
