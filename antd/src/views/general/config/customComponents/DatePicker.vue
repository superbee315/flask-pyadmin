<template>
  <div class="wrap">
    <DatePicker
      class="date-picker"
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
  import { DatePicker } from 'ant-design-vue';
  import moment from 'moment';

  const props = {
    value: { type: Object, default: null },
    tip: { type: String, default: '' },
  };

  export default defineComponent({
    components: { DatePicker },
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
        emit('change', String(val));
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
  .wrap {
    display: flex;
  }

  .date-picker {
    width: 65%;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    line-height: 250%;
    color: gray;
  }
</style>
