<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" :title="title">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import moment from 'moment';
  interface PopupData {
    title: string;
  }
  interface Role {
    id: string | number;
  }

  export default defineComponent({
    components: { BasicModal, BasicForm },
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
      const modelRef = ref({});

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
        if (data.technology === 1) {
          data.technology = true;
        } else {
          data.technology = false;
        }
        if (data.quality === 1) {
          data.quality = true;
        } else {
          data.quality = false;
        }
        if (data.foreignTrade === 1) {
          data.foreignTrade = true;
        } else {
          data.foreignTrade = false;
        }
        setFieldsValue(data);
        role.id = data.id;
      });

      async function confirm() {
        try {
          const data = await validate();
          console.log(`确定`, data);
          if (role.id) {
            data.id = role.id;
          } else {
            role.id = 0;
          }
          if (data.technology) {
            data.technology = 1;
          } else {
            data.technology = 0;
          }
          if (data.foreignTrade) {
            data.foreignTrade = 1;
          } else {
            data.foreignTrade = 0;
          }
          if (data.quality) {
            data.quality = 1;
          } else {
            data.quality = 0;
          }
          data.foundingtime = moment(data.foundingtime).format('YYYY-MM-DD');

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
