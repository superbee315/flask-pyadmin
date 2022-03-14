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
      const popupData = props.popupData as PopupData;
      const modelRef = ref({});
      const role = reactive<Role>({
        id: 0,
      });

      const [registerForm, { updateSchema, setFieldsValue, resetFields, validate }] = useForm({
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
          updateSchema([
            {
              field: 'type',
              componentProps: {
                disabled: true,
                options: [
                  { label: '个人', value: 2 },
                  { label: '单位', value: 1 },
                ],
              },
            },
          ]);
          // data.username = data.admin.username;
        } else {
          role.id = 0;
          updateSchema([
            {
              field: 'type',
              componentProps: {
                disabled: false,
                options: [
                  { label: '个人', value: 2 },
                  { label: '单位', value: 1 },
                ],
              },
            },
          ]);
        }
        setFieldsValue(data);
      });

      async function confirm() {
        try {
          const data = await validate();
          console.log(`确定`, data);
          data.id = role.id;
          if (!role.id) {
            // 添加申请
            data.isCheck = 0;
          }
          if (data.name) {
            data.fromId = data.name.id;
          } else {
            data.fromId = data.unitName.id;
          }
          data.jointime = moment(data.jointime).format('YYYY-MM-DD');
          delete data.relation;
          delete data.relationUnit;
          delete data.unitName;
          delete data.name;
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
