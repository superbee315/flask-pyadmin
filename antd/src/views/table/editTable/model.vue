<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" :title="title">
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { adapt } from '/@/utils/adapt';

  interface ModelData {
    title: string;
  }
  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      modelData: {
        type: Object as PropType<ModelData>,
        default: () => {},
      },
    },
    setup(props) {
      const modelRef = ref({});
      const adaptWidth = adapt();
      const modelData = props.modelData as ModelData;
      const schemas: FormSchema[] = [
        {
          field: 'name',
          component: 'Input',
          label: '姓名',
          labelWidth: adaptWidth.labelWidth,
          colProps: {
            span: adaptWidth.elContainer,
          },
        },
        {
          field: 'age',
          component: 'Input',
          label: '年龄',
          labelWidth: adaptWidth.labelWidth,
          colProps: {
            span: adaptWidth.elContainer,
          },
        },
        {
          field: 'addr',
          component: 'Input',
          label: '地址',
          labelWidth: adaptWidth.labelWidth,

          colProps: {
            span: adaptWidth.elContainer,
          },
        },
      ];

      const [
        registerForm,
        {
          getFieldsValue,
          // setProps
        },
      ] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const [register, { closeModal }] = useModalInner((data) => {
        // 方式1
        // setFieldsValue({
        //   field2: data.data,
        //   field1: data.info,
        // });

        // 方式2
        modelRef.value = { name: data.name, age: data.age, addr: data.addr };

        // setProps({
        //   model:{ field2: data.data, field1: data.info }
        // })
      });

      function confirm() {
        console.log('确定');
        console.log(getFieldsValue()); // 表单数据

        closeModal(); // 关闭弹窗
      }
      return {
        register,
        schemas,
        registerForm,
        model: modelRef,
        confirm,
        adaptWidth,
        ...toRefs(modelData),
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    text-align: center !important;
  }
  @media (max-width: 639px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }
  }
</style>
