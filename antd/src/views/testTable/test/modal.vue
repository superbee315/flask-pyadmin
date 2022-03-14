<template>
  <BasicModal
    width="80%"
    v-bind="$attrs"
    @register="register"
    title="字段管理"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <!-- <BasicForm @register="registerForm" :model="model" /> -->
    <filedTable />
    <!-- <MenuTree /> -->
  </BasicModal>
</template>
<script lang="ts">
  import { Tree } from 'ant-design-vue';
  import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import filedTable from '/@/views/testTable/filedTable/index.vue';
  interface PopupData {
    title: string;
  }
  interface Role {
    id: string | number;
  }

  export default defineComponent({
    components: { BasicModal, [Tree.name]: Tree, filedTable },
    props: {
      popupData: {
        type: Object as PropType<PopupData>,
        default: () => {},
      },
    },
    emits: ['register', 'saveData'],
    setup(props) {
      const role = reactive<Role>({
        id: 0,
      });
      const popupData = props.popupData as PopupData;
      console.log(`popupData`, popupData);
      const modelRef = ref({});

      const [register] = useModalInner((data) => {
        if (data) {
          role.id = data.id;
        } else {
          role.id = 0;
        }
      });

      return {
        register,
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
  }
</style>
