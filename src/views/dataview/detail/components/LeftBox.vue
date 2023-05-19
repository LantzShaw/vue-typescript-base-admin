<template>
  <div class="left-container">
    <section>
      <CardTitle label="企业概况" />
      <div class="left-container--enterprise">
        <LeftBoxEnterprise />
      </div>
    </section>
    <section>
      <CardTitle label="传感器异常统计" />
      <div class="left-container--distribution">
        <LeftBoxSensorException />
      </div>
    </section>
    <section>
      <CardTitle label="生命周期统计" />
      <div class="left-container--lifecycle">
        <LifecycleAnnular />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import CardTitle from '../../CardTitle.vue';
  import LeftBoxEnterprise from './LeftBoxEnterprise.vue';
  import LeftBoxSensorException from './LeftBoxSensorException.vue';
  import LifecycleAnnular from '../../LifecycleAnnular.vue';
</script>

<style scoped lang="less">
  .left-container {
    width: 424px;
    height: calc(1920px - 102px);
    margin-left: 30px;

    &--enterprise {
      height: 280px;
      padding: 25px 14px 22px;
      vertical-align: middle;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--distribution {
      height: 280px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--lifecycle {
      height: 280px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  }
</style>
