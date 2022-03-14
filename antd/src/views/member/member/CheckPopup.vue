<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" title="审核">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkSchemas } from './data';
  interface Role {
    id: string | number;
  }

  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ['register', 'saveData'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const modelRef = ref({});
      const role = reactive<Role>({
        id: 0,
      });

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 120,
        schemas: checkSchemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const [register, { closeModal }] = useModalInner((data) => {
        resetFields();
        role.id = data.id;
        setFieldsValue(data);
      });

      async function confirm() {
        try {
          const data = await validate();
          console.log(`确定`, data);
          data.id = role.id;
          const popupData = { closeModal, data };
          emit('saveData', popupData);
        } catch (err: any) {
          error(err.errorFields[0].errors[0]);
        }
      }
      return {
        register,
        registerForm,
        model: modelRef,
        confirm,
      };
    },
  });
</script>
<style scoped>
  .ant-form-item-label {
    overflow: hidden;
    text-align: center !important;
    /* white-space: pre-wrap !important; */
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
