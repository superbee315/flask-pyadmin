<template>
  <div class="wrap-time">
    <TimePicker
      class="time-picker"
      :value="value"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    />
    <span>{{ reactData.tip }}</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { TimePicker } from 'ant-design-vue';
  import moment from 'moment';

  const props = {
    value: { type: Object, default: null },
    tip: { type: String, default: '' },
  };

  export default defineComponent({
    components: { TimePicker },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const reactData = reactive({
        tip: '',
      });
      function onFocus() {
        reactData.tip = props.tip;
      }
      function onBlur() {
        reactData.tip = '';
      }

      function onChange(val) {
        const time = String(val);
        emit('change', time);
      }
      return {
        onFocus,
        onBlur,
        onChange,
        reactData,
        moment,
        ...toRefs(props),
      };
    },
  });
</script>
<style scoped>
  .wrap-time {
    display: flex;
  }

  .wrap-time .ant-time-picker {
    width: 65%;
    margin-right: 10px;
  }

  .wrap-time span {
    font-size: 13px;
    line-height: 250%;
    color: gray;
  }
</style>
