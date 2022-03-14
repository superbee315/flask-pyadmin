<template>
  <div class="wrap">
    <div class="content">
      <InputPassword :placeholder="placeholder" :value="value" @change="handleChange" />
      <span style="font-size: 13px; color: #ddd">{{ tip }}</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, reactive, toRefs } from 'vue';
  import { Input } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  const props = {
    value: propTypes.oneOfType([propTypes.object, propTypes.string, propTypes.array]),
    tip: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  };
  interface State {
    value: any;
    placeholder: string;
    tip: string;
  }

  export default defineComponent({
    name: 'CustomInputPassword',
    components: { InputPassword: Input.Password },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive<State>({
        value: '',
        placeholder: props.placeholder,
        tip: props.tip,
      });
      // 初始化
      function init() {
        state.value = props.value;
      }
      onUpdated(() => {
        init();
      });

      function handleChange(e) {
        emit('change', e.target.value);
      }

      return {
        handleChange,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .ant-input-password {
    width: 70%;
    margin-right: 10px;
  }
</style>
