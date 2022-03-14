<template>
  <div class="wrap">
    <Switch
      class="switch"
      :checked="checked"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @change="onChange"
    />
    <span>{{ reactData.tip }}</span>
  </div>
</template>
<script lang="ts">
  import { Switch } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs } from 'vue';

  const props = {
    checked: { type: Boolean, default: false },
    tip: { type: String, default: '' },
  };

  export default defineComponent({
    components: { Switch },
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

  .switch {
    margin-right: 10px;
  }

  span {
    font-size: 13px;
    color: gray;
  }
</style>
