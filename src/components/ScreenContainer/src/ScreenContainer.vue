<template>
  <div class="screen-container" ref="screenContainerRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { ref, onMounted, onUnmounted, defineComponent } from 'vue';

  export default defineComponent({
    name: 'ScreenContainer',
    props: {
      width: {
        type: [Number, String],
      },
      height: {
        type: [Number, String],
      },
    },
    setup() {
      const screenWidth = ref<number>(0 || window.screen.width);
      const screenHeight = ref<number>(0 || window.screen.height);
      const screenContainerRef = ref<HTMLDivElement | null>(null);

      const setSize = () => {
        screenContainerRef.value!.style.width = screenWidth.value + 'px';
        screenContainerRef.value!.style.height = screenWidth.value + 'px';
      };

      const resizeHandler = (): void => {
        const bodyWidth = document.body.clientWidth;
        const bodyHeight = document.body.clientHeight;

        const scaleX = bodyWidth / screenWidth.value;
        const scaleY = bodyHeight / screenHeight.value;

        screenContainerRef.value!.style.transform = `scale(${scaleX}, ${scaleY})`;
      };

      onMounted(() => {
        console.log('onmounted', screenContainerRef);

        setSize();
        resizeHandler();

        window.addEventListener('resize', resizeHandler);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', resizeHandler);
      });

      return {
        screenWidth,
        screenHeight,
        screenContainerRef,
      };
    },
  });
</script>

<style lang="less" scoped>
  .screen-container {
    position: fixed;
    transform-origin: left top;
    font-size: 1rem;
  }
</style>
