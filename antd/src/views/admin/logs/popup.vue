<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
    cancelText="关闭"
    :title="title"
  >
    <Description
      :collapseOptions="{ canExpand: false, helpMessage: '日志详情' }"
      :column="1"
      :data="model"
      :schema="schema"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem } from '/@/components/Description/index';
  import { adapt } from '/@/utils/adapt';

  interface PopupData {
    title: string;
  }

  export default defineComponent({
    components: { BasicModal, Description },
    props: {
      popupData: {
        type: Object as PropType<PopupData>,
        default: () => {},
      },
    },
    setup(props) {
      const popupData = props.popupData as PopupData;

      const modelRef = ref({});
      const adaptWidth = adapt();
      const schema: DescItem[] = [
        {
          field: 'id',
          label: 'id',
        },
        {
          field: 'admin_id',
          label: 'admin_id',
        },
        {
          field: 'username',
          label: '用户名',
        },
        {
          field: 'title',
          label: '标题',
        },
        {
          field: 'url',
          label: 'Url',
        },
        {
          field: 'ip',
          label: 'IP',
        },
        {
          field: 'browser',
          label: 'Browser',
        },
        {
          field: 'time',
          label: '创建时间',
        },
      ];
      const [register] = useModalInner((data) => {
        // 方式2
        modelRef.value = data;
      });

      return {
        register,
        adaptWidth,
        schema,
        model: modelRef,
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

    .ant-descriptions-item-content {
      font-size: 12px !important;
    }
  }
</style>
