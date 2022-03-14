<template>
  <BasicForm @register="register" class="my-5" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { Alert } from 'ant-design-vue';

  import { uploadApi } from '/@/api/sys/upload';

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Upload',
      label: '',
      colProps: {
        span: 6,
      },
      rules: [{ required: true, message: '请选择上传文件' }],
      componentProps: {
        api: uploadApi,
      },
    },
  ];
  export default defineComponent({
    components: { BasicForm, [Alert.name]: Alert },
    setup() {
      const { createMessage } = useMessage();
      const [register] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 16,
        },
      });
      return {
        handleChange: (list: string[]) => {
          createMessage.info(`已上传文件${JSON.stringify(list)}`);
        },
        uploadApi,
        register,
      };
    },
  });
</script>
