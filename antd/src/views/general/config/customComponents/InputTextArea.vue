<template>
  <div class="wrap">
    <InputTextArea
      class="input-text-area"
      :value="value"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    />
    <span>{{ reactData.tip }}</span>
    <span class="error-msg">{{ reactData.error }}</span>
  </div>
</template>
<script lang="ts">
  import { Input } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs, watch } from 'vue';
  import { validateType } from '/@/utils/validTools';

  const props = {
    value: { type: String, default: '' },
    tip: { type: String, default: '' },
    errMsg: { type: String, default: '' },
    rules: { type: Array, default: [] },
  };

  export default defineComponent({
    components: { InputTextArea: Input.TextArea },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const reactData = reactive({
        tip: '',
        error: '',
      });

      watch(
        () => props.errMsg,
        (errMsg) => {
          reactData.error = errMsg;
        }
      );

      function onFocus() {
        reactData.error = '';
        reactData.tip = props.tip;
      }

      function onBlur(e) {
        reactData.tip = '';
        if (props.rules && props.rules[0]) {
          const res = validateType(props.rules, e.target.value);
          reactData.error = res.errMsg;
        }
      }

      function onChange(e) {
        emit('change', e.target.value);
      }
      return {
        onFocus,
        onBlur,
        onChange,
        reactData,
        ...toRefs(props),
      };
    },
  });
</script>
<style scoped>
  .wrap {
    display: flex;
  }

  .input-text-area {
    width: 65%;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    line-height: 250%;
    color: gray;
  }

  .error-msg {
    color: red;
  }
</style>
