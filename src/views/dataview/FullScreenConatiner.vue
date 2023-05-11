<template>
  <div
    class="full-screen-container"
    :style="{ background: backgroundColor }"
    ref="fullScreenContainerRef"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { ref } from 'vue';

  type Props = {
    width?: number;
    height?: number;
    backgroundColor?: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    backgroundColor: '#0D1F3E',
  });

  const width = ref<number>(props.width || screen.width); // 大屏真实宽度
  const height = ref<number>(props.height || screen.height); // 大屏真实高度

  const fullScreenContainerRef = ref<HTMLDivElement | null>(null);

  function setSize() {
    fullScreenContainerRef.value!.style.width = `${width.value}px`;
    fullScreenContainerRef.value!.style.height = `${height.value}px`;
  }

  function setScale() {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;

    const scaleX = bodyWidth / width.value;
    const scaleY = bodyHeight / height.value;

    fullScreenContainerRef.value!.style.transform = `scale(${scaleX},${scaleY})`;
  }

  onMounted(() => {
    setSize();
    setScale();

    window.addEventListener('resize', setScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setScale);
  });
</script>

<style scoped lang="less">
  .full-screen-container {
    position: fixed;
    transform-origin: left top;
  }
</style>
