<template>
  <div class="wrap">
    <Radio
      class="radio"
      :value="value"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      :options="options"
      @change="onChange"
    />
    <span>{{ reactData.tip }}</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Radio } from 'ant-design-vue';

  const props = {
    value: { type: String, default: '' },
    options: { type: Array, default: [] },
    tip: { type: String, default: '' },
  };

  export default defineComponent({
    components: { Radio: Radio.Group },
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

      function onChange(e) {
        emit('change', e.target.value);
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

  .radio {
    width: 65%;
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    color: gray;
  }
</style>
