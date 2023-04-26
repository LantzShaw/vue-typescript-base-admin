<template>
  <span> {{ prefix }}{{ name }} </span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: {
      type: String,
    },
    value: {
      type: String,
    },
    active: {
      type: String,
    },
  });

  const prefix = computed(() => {
    return props.active === props.value ? '√' : '□';
  });
</script>
