<template>
  <div class="wrap">
    <Select
      class="select"
      :value="value"
      :options="options"
      mode="multiple"
      @focus="onFocus"
      @change="onChange"
      @blur="onBlur"
    />
    <span>{{ reactData.tip }}</span>
  </div>
</template>
<script lang="ts">
  import { Select } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs } from 'vue';

  const props = {
    value: { type: Array, default: [] },
    tip: { type: String, default: '' },
    options: { type: Array, default: [] },
  };

  export default defineComponent({
    components: { Select },
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

  .select {
    width: 65%;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    line-height: 250%;
    color: gray;
  }
</style>
