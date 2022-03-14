<template>
  <!-- <BasicTable @register="registerTable" /> -->
  <div class="wrap">
    <div class="content">
      <Input :placeholder="placeholder" disabled v-model:value="value" />
      <a-button
        class="mr-2 add-btn"
        color="success"
        :disabled="disabled"
        @click="openAddPop(placeholder)"
      >
        添加
      </a-button>
    </div>
    <Popup @register="register" @select="select" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, reactive, nextTick, toRefs, watch } from 'vue';
  import { Input } from 'ant-design-vue';
  import Popup from './popup.vue';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';

  const props = {
    value: propTypes.oneOfType([propTypes.object, propTypes.string, propTypes.array]),
    type: { type: Number, default: 2 },
  };
  interface State {
    value: any;
    placeholder: string;
    disabled: boolean;
    type: number;
  }

  export default defineComponent({
    name: 'CustomInput',
    components: { Input, Popup },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive<State>({
        value: '',
        placeholder: '添加相关个人',
        disabled: false,
        type: 2,
      });
      const [register, { openModal: openPopup }] = useModal();
      // 初始化
      function init() {
        nextTick(() => {
          if (props.type === 2) {
            state.placeholder = '添加相关个人';
          } else {
            state.placeholder = '添加相关单位';
          }
          if (props.value && props.value.name) {
            state.value = props.value.name;
          } else {
            state.value = props.value;
          }
          if (state.value && typeof props.value === 'string') {
            state.disabled = true;
          } else {
            state.disabled = false;
          }
        });
      }
      onUpdated(() => {
        init();
      });

      watch(
        () => props.type,
        () => {
          if (props.value && typeof props.value === 'string') {
            state.disabled = true;
          } else {
            state.disabled = false;
          }
          if (!state.disabled) {
            emit('change', '');
          }
        }
      );

      function openAddPop(title) {
        if (title === '添加相关个人') {
          title = '添加个人';
        }
        if (title === '添加相关单位') {
          title = '添加单位';
        }
        openPopup(true, title);
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
