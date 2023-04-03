<template>
  <span class="thumb">
    <AImage v-bing="$attrs" :width="width" :height="height" :src="authImage" />
  </span>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Image as AImage } from 'ant-design-vue';

  import { fileShow } from '/@/api/system/file';
  import { arrayBufferToBase64 } from '/@/utils/file/base64Conver';

  export default defineComponent({
    components: {
      AImage,
    },
    props: {
      fileUrl: propTypes.string.def(''),
      fileName: propTypes.string.def(''),
      height: propTypes.string.def(''),
      width: propTypes.string.def(''),
    },
    setup(props) {
      const authImage = ref<any>(null);

      const getImageUrl = async () => {
        try {
          const response = await fileShow(props.fileUrl);

          authImage.value = `data:image/jpeg;base64,${arrayBufferToBase64(response)}`;
        } catch (e) {
          console.log(e);
        }
      };

      onMounted(() => {
        getImageUrl();
      });

      return {
        authImage,
      };
    },
  });
</script>
<style lang="less">
  .thumb {
    img {
      position: static;
      display: block;
      cursor: zoom-in;
      border-radius: 4px;
      object-fit: cover;
    }
  }
</style>
