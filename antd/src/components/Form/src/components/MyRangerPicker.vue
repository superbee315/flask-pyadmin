<template>
  <div class="arr-wrap">
    <a-input-group compact>
      <a-date-picker
        v-model:value="startDate"
        :disabled-date="disabledStartDate"
        format="YYYY-MM-DD"
        placeholder="开始日期"
        @openChange="handleStartOpenChange"
      />
      <a-input style="width: 2rem; border-left: 0; pointer-events: none" placeholder="~" />
      <a-date-picker
        v-model:value="endDate"
        :disabled-date="disabledEndDate"
        format="YYYY-MM-DD"
        placeholder="结束日期"
        :open="endOpen"
        @openChange="handleEndOpenChange"
      />
    </a-input-group>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, watch } from 'vue';
  import { DatePicker } from 'ant-design-vue';
  import moment, { Moment } from 'moment';

  const props = {
    value: { type: [String, Array], default: '' },
  };
  export default defineComponent({
    name: 'MyRangerPicker',
    components: {
      [DatePicker.name]: DatePicker,
    },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const startDate = ref<Moment | undefined>();
      const endDate = ref<Moment>();
      const endOpen = ref<boolean>(false);

      const disabledStartDate = (startDate: Moment) => {
        if (!startDate || !endDate.value) {
          return false;
        }

        return startDate.valueOf() > endDate.value.valueOf();
      };

      const disabledEndDate = (endDate: Moment) => {
        if (!endDate || !startDate.value) {
          return false;
        }

        return startDate.value.valueOf() >= endDate.valueOf();
      };

      const handleStartOpenChange = (open: boolean) => {
        if (!open) {
          endOpen.value = true;
        }
      };

      const handleEndOpenChange = (open: boolean) => {
        endOpen.value = open;
      };
      function emitChange() {
        if (unref(startDate) && unref(endDate)) {
          emit('change', [
            moment(unref(startDate)).format('YYYY-MM-DD'),
            moment(unref(endDate)).format('YYYY-MM-DD'),
          ]);
        } else if (unref(startDate) && !unref(endDate)) {
          emit('change', [moment(unref(startDate)).format('YYYY-MM-DD'), '']);
        } else if (!unref(startDate) && unref(endDate)) {
          emit('change', ['', moment(unref(endDate)).format('YYYY-MM-DD')]);
        } else {
          emit('change', '');
        }
      }
      // 重置
      watch(
        () => props.value,
        (val) => {
          if (val === '') {
            startDate.value = undefined;
            endDate.value = undefined;
          }
        },
        { deep: true }
      );

      watch(startDate, () => {
        emitChange();
      });

      watch(endDate, () => {
        emitChange();
      });
      return {
        startDate,
        endDate,
        endOpen,
        disabledStartDate,
        disabledEndDate,
        handleStartOpenChange,
        handleEndOpenChange,
      };
    },
  });
</script>
