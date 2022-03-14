<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" :title="title">
    <BasicForm @register="registerForm" :model="model" />
    <!-- <MenuTree /> -->
  </BasicModal>
</template>
<script lang="ts">
  import { Tree } from 'ant-design-vue';
  import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './data';
  interface PopupData {
    title: string;
  }
  interface Role {
    id: string | number;
  }

  export default defineComponent({
    components: { BasicModal, BasicForm, [Tree.name]: Tree },
    props: {
      popupData: {
        type: Object as PropType<PopupData>,
        default: () => {},
      },
    },
    emits: ['register', 'saveData'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const role = reactive<Role>({
        id: 0,
      });
      const popupData = props.popupData as PopupData;
      console.log(`popupData`, popupData);
      const modelRef = ref({});

      const [registerForm, { updateSchema, setFieldsValue, resetFields, validate }] = useForm({
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
        if (data) {
          role.id = data.id;
          updateSchema({
            field: 'password',
            required: false,
          });
        } else {
          role.id = 0;
          updateSchema({
            field: 'password',
            required: true,
          });
        }
        setFieldsValue(data);
      });

      async function confirm() {
        try {
          const data = await validate();
          if (role.id) {
            data.id = role.id;
          }
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
        ...toRefs(popupData),
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    text-align: center !important;
  }

  .tree-label {
    width: 20.6%;
    margin-top: 8px;
    margin-bottom: 1em;
    text-align: center;
  }

  @media (max-width: 639px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }

    .tree-label {
      width: 33%;
      margin-top: 8px;
      margin-bottom: 1em;
      text-align: center;
    }
  }
</style>
