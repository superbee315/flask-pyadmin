<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="register"
    :title="title"
    helpMessage="请选择要添加的数据"
    @ok="sendRecord"
  >
    <Field v-if="title === '字段详情'" @select="select" :data="data" />
  </BasicModal>
</template>
<script lang="ts">
  import Field from './field/index.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { defineComponent, onUpdated, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicModal, Field },
    emits: ['register', 'select'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const state = reactive({
         title: '',
        data: {
          id: 0,
        },
        type: 1,
      });
      const [register, { closeModal }] = useModalInner((data) => {
        state.title = data.title;
        state.type = data.type;
      });

      function select(data) {
        state.data = data;
      }
      function sendRecord() {
        if (state.data.id !== 0) {
          emit('select', state.data);
          closeModal();
        } else {
          error('请先选择要添加的数据!');
        }
      }
      onUpdated(() => {
        document.onkeydown = function (e) {
          if (e.key === 'Enter') {
            sendRecord();
          }
        };
      });
      return {
        register,
        sendRecord,
        select,
        ...toRefs(state),
      };
    },
  });
</script>
