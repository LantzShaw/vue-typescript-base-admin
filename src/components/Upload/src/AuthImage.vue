<template>
  <span class="thumb">
    <AImage v-if="authImage" v-bind="$attrs" :width="width" :height="height" :src="authImage" />
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
          const index = props.fileUrl?.lastIndexOf('.'); // 获取指定字符串最后一次出现的位置，返回index
          const str = props.fileUrl?.substr(index + 1); // substr(start, length) 抽取从start下标开始的length个字符，返回新的字符串

          if (props.fileUrl && isImageType(str)) {
            const response = await fileShow(props.fileUrl);
            authImage.value = `data:image/jpeg;base64,${arrayBufferToBase64(response)}`;
          }
        } catch (e) {
          console.log(e);
        }
      };

      function isImageType(str) {
        // toLowerCase() 将字符串转换为小写，返回一个新的字符串
        return (
          ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
            str?.toLowerCase(),
          ) !== -1
        );
      }

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
