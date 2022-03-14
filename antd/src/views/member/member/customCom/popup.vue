<template>
  <BasicModal
    @ok="sendRecord"
    width="800px"
    v-bind="$attrs"
    @register="register"
    :title="title"
    helpMessage="请选择要添加的数据"
  >
    <Person v-if="title === '添加个人'" @select="select" />
    <Unit v-if="title === '添加单位'" @select="select" />
  </BasicModal>
</template>
<script lang="ts">
  import Person from './person/index.vue';
  import Unit from './unit/index.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { defineComponent, onUpdated, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicModal, Person, Unit },
    emits: ['register', 'select'],
    setup(_, { emit }) {
      const state = reactive({
        title: '',
        data: { id: 0 },
      });
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const [register, { closeModal }] = useModalInner((data) => {
        state.title = data;
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
        select,
        sendRecord,
        ...toRefs(state),
      };
    },
  });
</script>
