<template>
  <span class="thumb">
    <AImage :src="authImage" />
  </span>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Image as AImage } from 'ant-design-vue';

  import { getDepartmentId, getOrganizationId, getToken } from '/@/utils/auth';

  import axios from 'axios';
  import { getAppEnvConfig } from '/@/utils/env';

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
      const { VITE_GLOB_API_URL } = getAppEnvConfig();

      const getImageUrl = async () => {
        try {
          const response = await axios({
            method: 'GET',
            url: `${VITE_GLOB_API_URL}/base/file/show/${props.fileUrl}`,
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });

          if (response.status === 200) {
            authImage.value = URL.createObjectURL(response.data);

            console.log('authImage.value ', authImage.value);
          }
        } catch (error: any) {
          throw new Error(error);
        }

        // console.log('response', response);
      };

      // const getImageUrl = async () => {
      //   const response = await getFile({ fileName: props.fileUrl });

      //   URL.createObjectURL(response);

      //   console.log('response', URL.createObjectURL(response));
      // };

      // const getImageUrl = () => {
      //   console.log('demo', Image.prototype, authImage.value);

      //   Object.defineProperty(Image.prototype, 'imageUrl', {
      //     configurable: true,
      //     writable: true,
      //     enumerable: true,
      //   });

      //   const request = new XMLHttpRequest();

      //   request.responseType = 'blob';

      //   request.open('GET', props.fileUrl, true);

      //   request.setRequestHeader('Authorization', `Bearer ${getToken()}`);
      //   request.setRequestHeader('X-Bigfish-Department-Id', getDepartmentId() as string);
      //   request.setRequestHeader('X-Bigfish-Organization-Id', getOrganizationId() as string);

      //   request.onreadystatechange = () => {
      //     if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
      //       // URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象URL，这个新的URL对象表示指定的File对象或blob对象
      //       authImage.value = URL.createObjectURL(request.response);

      //       // authImage.value.onLoad = () => {
      //       //   // 在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。
      //       //   URL.revokeObjectURL(authImage.value.src);
      //       // };
      //     }
      //   };

      //   request.send(null);
      // };

      onMounted(() => {
        console.log('authImage.value', authImage.value);

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
