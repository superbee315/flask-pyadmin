<template>
  <!-- <BasicTable @register="registerTable" /> -->
  <div class="wrap">
    <div class="content">
      <Input :placeholder="placeholder" disabled v-model:value="value" />
      <a-button class="mr-2 add-btn" color="success" @click="openAddPop()"> 添加 </a-button>
    </div>
    <Popup @register="register" @select="select" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, reactive, nextTick, toRefs } from 'vue';
  import { Input } from 'ant-design-vue';
  import Popup from './popup.vue';
  import { useModal } from '/@/components/Modal';

  const props = {
    value: { type: Object, default: '' },
    placeholder: { type: String, default: '' },
  };
  interface State {
    value: object | string;
    placeholder: string;
    disabled: boolean;
    ids: number[];
  }

  export default defineComponent({
    name: 'CustomInput',
    components: { Input, Popup },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive<State>({
        value: '',
        ids: [],
        placeholder: props.placeholder,
        disabled: false,
      });
      const [register, { openModal: openPopup }] = useModal();
      // 初始化
      function init() {
        nextTick(() => {
          console.log(`props.value`, props.value);
          if (props.value) {
            const nameArr: string[] = [];
            const idArr: number[] = [];
            props.value.map((item) => {
              if (item.name && item.id) {
                nameArr.push(item.name);
                idArr.push(item.id);
              }
            });
            state.value = nameArr.toString();
            state.ids = idArr;
          }
        });
      }
      onUpdated(() => {
        init();
      });
      function openAddPop() {
        openPopup(true, { title: state.placeholder, ids: state.ids });
      }
      function select(data) {
        emit('change', data);
      }

      return {
        openAddPop,
        select,
        openPopup,
        register,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .content {
    display: flex;
  }

  .add-btn {
    margin-left: 2px;
  }
</style>
