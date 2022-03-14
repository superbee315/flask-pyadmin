<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" title="添加字段">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  interface Role {
    id: string | number;
  }

  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ['register', 'saveData'],
    setup(_, { emit }) {
      const modelRef = ref({});
      const role = reactive<Role>({
        id: 0,
      });
      const { createMessage } = useMessage();
      const { error } = createMessage;

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      //   const [register, { closeModal }] = useModalInner((data) => {
      //     modelRef.value = data;

      //
      //   });
      const [register, { closeModal }] = useModalInner((data) => {
        resetFields();
        if (data.id) {
          role.id = data.id;
        } else {
          role.id = 0;
        }
        setFieldsValue(data);
      });

      async function confirm() {
        try {
          const data = await validate();
          console.log(`确定`, data);
          const popupData = { closeModal, data };
          emit('saveData', popupData);
        } catch (err: any) {
          error(err.errorFields[0].errors[0]);
        }
      }
      return {
        register,
        schemas,
        registerForm,
        model: modelRef,
        confirm,
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    overflow: hidden;
    text-align: center !important;
    // white-space: pre-wrap !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 639px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }
  }
</style>
