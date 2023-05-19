<template>
  <header class="header">
    <div class="back">
      <div class="back-btn">返回首页</div>
    </div>
    <div class="header-title header-title--clip-text">嘉兴港区气体泄漏监测平台</div>
    <div class="header-date">{{ dateUtil(dateTime).format('YYYY.MM.DD HH:mm:ss') }}</div>
  </header>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { dateUtil } from '/@/utils/dateUtil';

  const dateTime = ref<Date | null>(null);

  const timer = ref<ReturnType<typeof setInterval> | null>(null);

  // NOTE: 调用子组件数据和方法时
  // const foo = ref<InstanceType<typeof Foo> | null>(null)
  // const foo = ref<InstanceType<typeof Foo>[]>([])

  function setDate() {
    timer.value = setInterval(() => {
      dateTime.value = new Date();
    });
  }

  onMounted(() => {
    // setDate();
  });

  onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
  });
</script>

<style scoped lang="less">
  .header {
    width: 1920px;
    padding-top: 2px;
    height: 82px;
    line-height: 54px;
    margin-bottom: 20px;
    font-size: 45px;

    background: url('/@/assets/images/dataview/header.png') top left no-repeat;
    display: flex;
    justify-content: space-between;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    .back {
      padding-left: 32px;
      width: 600px;

      .back-btn {
        font-size: 16px;
        width: 99px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: #fff;
        border: solid 2px transparent;
        border-radius: 19px;
        background-image: linear-gradient(
            rgba(1, 167, 204, 1),
            rgba(3, 52, 111, 1),
            rgba(1, 167, 204, 1)
          ),
          linear-gradient(180deg, #0072ff, #00e4ff);
        background-origin: border-box;
        background-clip: content-box, border-box;
        cursor: pointer;
      }
    }

    &-title {
      height: 100%;
      text-align: center;
      font-family: 'PANG_MEN_ZHENG_DAO';
      letter-spacing: 2px;
      padding-top: 8px;

      &--clip-text {
        background: linear-gradient(0deg, #439cca 0%, #ffffff 78.5888671875%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &-date {
      width: 600px;
      height: 30px;
      line-height: 30px;
      text-align: right;
      color: #fff;
      font-family: Adobe Heiti Std;
      font-size: 16px;
      padding-right: 32px;
      box-sizing: border-box;
    }
  }
</style>
