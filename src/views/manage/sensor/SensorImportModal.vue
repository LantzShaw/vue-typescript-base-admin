<template>
  <BasicModal @register="register" title="导入" @ok="handleSubmit">
    <div class="m-1">
      <BasicForm @register="registerForm">
        <template #uploadFile>
          <AUploadDragger
            :fileList="fileList"
            :multiple="true"
            accept=".xls,.xlsx"
            :beforeUpload="handleBeforeUpload"
            :remove="handleRemove"
          >
            <p class="ant-upload-text"> 点击或拖拽到该区域上传 </p>
          </AUploadDragger>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  // hooks
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  import { Upload } from 'ant-design-vue';

  // 接口
  import { sensorImport } from '/@/api/manage/sensor';

  const schemas: FormSchema[] = [
    {
      field: 'uploadFile',
      label: '',
      component: 'Input',
      colProps: { span: 24 },
      slot: 'uploadFile',
    },
  ];

  export default defineComponent({
    components: { BasicModal, BasicForm, AUploadDragger: Upload.Dragger },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const fileList = ref<any[]>([]);
      const { notification } = useMessage();
      const [registerForm, {}] = useForm({
        labelWidth: 100,
        schemas: schemas,
        showActionButtonGroup: false,
      });

      const [register, { closeModal, setModalProps }] = useModalInner(() => {
        fileList.value = [];
      });

      // Block upload
      function handleBeforeUpload(file: File) {
        fileList.value = [...fileList.value, file];
        return false;
      }

      function handleRemove(file) {
        const index = fileList.value.findIndex((item) => item.uuid === file.uuid);
        index !== -1 && fileList.value.splice(index, 1);
        return false;
      }

      async function uploadApiByItem(item) {
        try {
          await sensorImport(
            {
              file: item,
            },
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              console.log(complete);
            },
          );

          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);

          return {
            success: false,
            error: e,
          };
        }
      }

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const uploadFileList = fileList.value || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            }),
          );
          console.log('data', data);

          notification.success({ message: `执行成功` });
          closeModal();
          emit('success');
        } catch (e) {
          console.log(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      function downloadTemplate() {}

      onMounted(() => {});

      return {
        fileList,
        register,
        registerForm,
        closeModal,
        handleSubmit,
        handleBeforeUpload,
        handleRemove,
        downloadTemplate,
      };
    },
  });
</script>

<style lang="less" scoped>
  .map {
    // width: 95%;
    min-height: 350px;
    // overflow: hidden;
    // margin: 0;
    // position: absolute;
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }
</style>
