<template>
  <span class="thumb">
    <AImage :src="authImage" />
  </span>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Image as AImage } from 'ant-design-vue';

  import { getToken } from '/@/utils/auth';

  import { getAppEnvConfig } from '/@/utils/env';
  import { fileShow } from '/@/api/system/file';
  import { arrayBufferToBase64 } from '/@/utils/file/base64Conver';

  export default defineComponent({
    components: {
      AImage,
    },
    props: {
      fileUrl: propTypes.string.def(''),
      fileName: propTypes.string.def(''),
    },
    setup(props) {
      const authImage = ref<any>(null);

      const getImageUrl = async () => {
        try {
          const response = await fileShow(props.fileUrl);

          authImage.value = `data:image/jpeg;base64,${arrayBufferToBase64(response)}`;

          // URL.createObjectURL(response) 使用于 Blob, ArrayBuffer不能用
        } catch (e) {
          console.log(e);
        }
      };

      // const getImageUrl = async () => {
      //   try {
      //     const response = await axios({
      //       method: 'GET',
      //       url: `${VITE_GLOB_API_URL}/base/file/show/${props.fileUrl}`,
      //       responseType: 'blob',
      //       headers: {
      //         Authorization: `Bearer ${getToken()}`,
      //       },
      //     });

      //     if (response.status === 200) {
      //       authImage.value = URL.createObjectURL(response.data);
      //     }
      //   } catch (error: any) {
      //     throw new Error(error);
      //   }
      // };

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
