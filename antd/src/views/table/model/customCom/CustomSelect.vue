<template>
  <Select
    allowClear
    :mode="type"
    :placeholder="placeholder"
    :options="options"
    :value="value"
    @change="handleChange"
  />
</template>
<script lang="ts">
  import { defineComponent, PropType, watch, reactive, toRefs, onUpdated } from 'vue';
  import { Select } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  type OptionsItem = { label: string; value: string; disabled?: boolean };
  export default defineComponent({
    name: 'CustomSelect',
    components: {
      Select,
    },
    props: {
      value: propTypes.oneOfType([propTypes.number, propTypes.string, propTypes.array]),
      options: Array as PropType<OptionsItem[]>,
      type: String,
      placeholder: String,
    },
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive({
        options: [],
        value: [],
        placeholder: props.placeholder,
        type: props.type,
      });
      watch(
        () => props.options,
        () => {
          state.options = props.options as any;
        },
        { deep: true }
      );
      function handleChange(e) {
        emit('change', e);
      }

      onUpdated(() => {
        state.options = props.options as any;
        state.value = props.value as any;
      });

      return { handleChange, ...toRefs(state) };
    },
  });
</script>
