<template>
  <div class="wrap">
    <a-date-picker
      mode="year"
      placeholder="请选择会员年份"
      format="YYYY"
      v-model:value="value"
      :open="open"
      :disabled="disabled"
      @change="change"
      @openChange="openChange"
      @panelChange="panelChange"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, reactive, toRefs } from 'vue';
  import { DatePicker } from 'ant-design-vue';
  import moment from 'moment';

  const props = {
    value: { type: Object, default: null },
  };
  interface State {
    value: any;
    disabled: boolean;
    open: boolean;
  }

  export default defineComponent({
    name: 'YearPicker',
    components: { [DatePicker.name]: DatePicker },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive<State>({
        value: null,
        disabled: false,
        open: false,
      });
      // 初始化
      function init() {
        if (!props.value || props.value.year) {
          if (!props.value) {
            state.value = '';
          } else {
            state.value = moment(String(props.value.year)).format('YYYY');
          }
          state.disabled = false;
        } else {
          state.value = moment(String(props.value)).format('YYYY');
          state.disabled = true;
        }
      }

      function openChange(status) {
        if (status) {
          state.open = true;
        } else {
          state.open = false;
        }
      }
      function change(e) {
        emit('change', e);
      }
      function panelChange(value) {
        emit('change', { year: value.year() });
        state.open = false;
      }
      onUpdated(() => {
        init();
      });

      return {
        change,
        openChange,
        panelChange,
        ...toRefs(state),
      };
    },
  });
</script>
