<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="handleSubmit" :title="title">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { Tree } from 'ant-design-vue';
  import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';

  interface PopupData {
    title: string;
    treeData: object[];
  }
  interface State {
    rule_id: string | number;
    ismenu: boolean;
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
      const state = reactive<State>({
        rule_id: 0,
        ismenu: false,
      });
      const popupData = props.popupData as PopupData;
      console.log(popupData);
      const modelRef = ref({});
      const replaceFields = {
        key: 'id',
      };

      const [registerForm, { updateSchema, setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: { span: 24 },
      });
      const [register, { closeModal }] = useModalInner((data) => {
        resetFields();
        // if (unref(isUpdate)) {
        //   setFieldsValue(data);
        // }
        if (data.id) {
          state.rule_id = data.id;
          state.ismenu = data.ismenu;
        } else {
          state.rule_id = 0;
          state.ismenu = false;
        }
        setFieldsValue(data);
        updateSchema({
          field: 'pid',
          componentProps: {
            treeData: popupData.treeData,
          },
        });
      });

      async function handleSubmit() {
        try {
          const data = await validate();
          let menuChange = false;
          const condition: any[] = [];
          if (data.redirect) {
            condition.push({ redirect: data.redirect });
          }
          if (condition[0]) {
            data.condition = JSON.stringify(condition);
          }
          delete data.redirect;
          if (state.rule_id) {
            data.id = state.rule_id;
            if (data.ismenu !== state.ismenu) {
              menuChange = true;
            }
          }
          const popupData = { closeModal, data, menuChange };
          emit('saveData', popupData);
        } catch (err: any) {
          error(err.errorFields[0].errors[0]);
        }
      }
      return {
        register,
        schemas,
        registerForm,
        replaceFields,
        model: modelRef,
        handleSubmit,
        ...toRefs(popupData),
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    text-align: center !important;
  }

  .tree-wrap {
    display: flex;
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
