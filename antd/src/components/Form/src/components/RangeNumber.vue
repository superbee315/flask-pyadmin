<template>
  <div class="arr-wrap">
    <a-input-group compact>
      <a-input
        v-model:value="minValue"
        @blur="handleMinBlur"
        style="width: 4.5rem; text-align: center"
        placeholder="Min"
      />
      <a-input style="width: 2rem; border-left: 0; pointer-events: none" placeholder="~" />
      <a-input
        v-model:value="maxValue"
        @blur="handleMaxBlur"
        style="width: 4.5rem; text-align: center; border-left: 0"
        placeholder="Max"
      />
    </a-input-group>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';

  const props = {
    value: { type: String, default: '' },
  };
  export default defineComponent({
    name: 'RangeNumber',
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const minValue = ref<string>('');
      const maxValue = ref<string>('');
      const formatMin = (val: string, preVal: string) => {
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(+val) && reg.test(val)) || val === '' || val === '-') {
          minValue.value = val;
        } else {
          minValue.value = preVal;
        }
        if (minValue.value || maxValue.value) {
          emit('change', [minValue.value, maxValue.value]);
        } else {
          emit('change', '');
        }
      };
      const formatMax = (val: string, preVal: string) => {
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(+val) && reg.test(val)) || val === '' || val === '-') {
          maxValue.value = val;
        } else {
          maxValue.value = preVal;
        }
        if (minValue.value || maxValue.value) {
          emit('change', [minValue.value, maxValue.value]);
        } else {
          emit('change', '');
        }
      };
      const handleMinBlur = () => {
        if (parseFloat(maxValue.value) < parseFloat(minValue.value) && maxValue.value !== '') {
          minValue.value = '';
          return;
        }
        if (minValue.value.charAt(minValue.value.length - 1) === '.' || minValue.value === '-') {
          formatMin(minValue.value.slice(0, -1), minValue.value);
        }
      };
      const handleMaxBlur = () => {
        if (parseFloat(maxValue.value) < parseFloat(minValue.value) && minValue.value !== '') {
          maxValue.value = '';
          return;
        }
        if (maxValue.value.charAt(maxValue.value.length - 1) === '.' || maxValue.value === '-') {
          formatMax(maxValue.value.slice(0, -1), maxValue.value);
        }
      };

      watch(minValue, (val, preVal) => {
        formatMin(val, preVal);
      });
      watch(
        () => props.value,
        (val) => {
          if (val === '') {
            minValue.value = '';
            maxValue.value = '';
          }
        },
        { deep: true }
      );
      watch(maxValue, (val, preVal) => {
        formatMax(val, preVal);
      });

      return {
        minValue,
        maxValue,
        handleMinBlur,
        handleMaxBlur,
      };
    },
  });
</script>
