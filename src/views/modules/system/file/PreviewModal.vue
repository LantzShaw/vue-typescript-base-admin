<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="预览"
    width="60%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div style="text-align: center"><img :src="src" /></div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, unref, computed } from 'vue';
  // hooks
  // 公共组件

  import { BasicModal, useModalInner } from '/@/components/Modal';
  // 接口
  import { fileShow } from '/@/api/system/file';
  // data

  const emit = defineEmits(['register']);

  const src = ref('');

  /**
   * 构建registerModal
   */
  const [registerModal, { setModalProps }] = useModalInner((data) => {
    setModalProps({ confirmLoading: false });
    data && onDataReceive(data);
  });

  function onDataReceive(data) {
    console.log('Data Received', data);
    fileShow(data.record.fileName).then((res) => {
      const blob = new Blob([res]);
      src.value = window.URL.createObjectURL(blob);
    });
  }
 
  /**
   * 提交表单
   */
</script>
