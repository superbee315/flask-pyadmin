<template>
  <div class="wrap">
    <InputNumber
      class="input-number"
      placeholder="0"
      type="number"
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
  import { InputNumber } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs, watch } from 'vue';
  import { validateType } from '/@/utils/validTools';

  const props = {
    value: { type: Number, default: 0 },
    tip: { type: String, default: '' },
    rules: { type: Array, default: [] },
    errMsg: { type: String, default: '' },
  };

  export default defineComponent({
    components: { InputNumber },
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

      function onChange(val) {
        emit('change', val);
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

  .input-number {
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
