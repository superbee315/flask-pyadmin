<template>
  <BasicModal
    width="800px"
    :show-cancel-btn="false"
    v-bind="$attrs"
    @register="register"
    @ok="closeModal"
    title="审批详情"
  >
    <Description :column="1" :data="descriptionData" :schema="schemas" size="middle" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description/index';
  import { schemas } from './data';

  export default defineComponent({
    components: { BasicModal, Description },
    emits: ['register'],
    setup() {
      const state = reactive({
        descriptionData: [],
      });
      const modelRef = ref({});
      const [register, { closeModal }] = useModalInner((data) => {
        state.descriptionData = data;
      });

      return {
        register,
        schemas,
        model: modelRef,
        closeModal,
        ...toRefs(state),
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
