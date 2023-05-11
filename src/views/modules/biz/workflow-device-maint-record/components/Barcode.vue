<!-- 
  TODO: 需要抽离成组件或者插件等才可以 不然会报错No Elements ...
 -->
<template>
  <svg id="barcode"></svg>
</template>

<script lang="ts" setup>
  import JsBarcode from 'jsbarcode';
  import { onMounted } from 'vue';

  const props = defineProps({
    data: {
      type: String,
      default: '0',
    },
  });

  onMounted(() => {
    JsBarcode('#barcode', props.data, {
      format: 'CODE39',
      lineColor: '#000',
      background: 'transparent', // NOTE: 不能设置为#fff 不然顶部会有边框
      width: 1,
      height: 40,
      displayValue: true,
    });
  });
</script>
