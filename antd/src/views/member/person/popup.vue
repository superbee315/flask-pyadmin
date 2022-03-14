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
      const popupData = props.popupData as PopupData;
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
          const not_validate = data.family.some((item) => {
            if (item.relation === '' || item.age === '' || item.job === '' || item.company === '') {
              error('家庭成员信息不能为空');
              return true;
            }
          });
          if (not_validate) {
            return;
          }
          data.id = role.id;
          data.birthday = moment(data.birthday).format('YYYY-MM-DD');
          data.family = JSON.stringify(data.family);
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
