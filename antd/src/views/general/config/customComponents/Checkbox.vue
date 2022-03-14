<template>
  <div class="wrap">
    <Checkbox
      class="checkbox"
      :mode="mode"
      :value="value"
      :options="options"
      @change="onChange"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
    />
    <span>{{ reactData.tip }}</span>
  </div>
</template>
<script lang="ts">
  import { Checkbox } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs } from 'vue';

  const props = {
    value: { type: Array, default: [] },
    tip: { type: String, default: '' },
    mode: { type: String, default: '' },
    options: { type: Array, default: [] },
  };

  export default defineComponent({
    components: { Checkbox: Checkbox.Group },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const reactData = reactive({
        tip: '',
      });
      function onMouseenter() {
        reactData.tip = props.tip;
      }
      function onMouseleave() {
        reactData.tip = '';
      }

      function onChange(val) {
        emit('change', val);
      }
      return {
        onMouseenter,
        onMouseleave,
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

  .checkbox {
    width: 65%;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    color: gray;
  }
</style>
