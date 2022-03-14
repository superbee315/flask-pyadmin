<template>
  <BasicModal
    width="800px"
    title="选择文件"
    v-bind="$attrs"
    @register="register"
    cancelText="关闭"
    @ok="handleSumbit"
  >
    <EasyTable
      ref="tableRef"
      rowKey="id"
      @register="registerTable"
      :rowSelection="{ type: type === 'images' || type === 'files' ? 'checkbox' : 'radio' }"
    >
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </EasyTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, ref, toRefs, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { EasyTable, useTable, TableAction, TableActionType } from '/@/components/EasyTable';
  import { columns } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAttachmentList } from '/@/api/sys/general';

  const props = {
    value: { type: String, default: '' },
    type: { type: String, default: '' },
  };
  export default defineComponent({
    components: { BasicModal, EasyTable, TableAction },
    props,
    emits: ['register', 'checked'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [register, { closeModal }] = useModalInner();

      const [registerTable] = useTable({
        columns: columns,
        api: getAttachmentList,
        showIndexColumn: false,
        bordered: true,
        maxHeight: 520,
      });
      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      async function handleSumbit() {
        const rows = await getTableAction().getSelectRows();
        if (rows.length) {
          emit('checked', rows);
          closeModal();
          getTableAction().clearSelectedRowKeys();
        } else {
          error('请先选择文件!');
        }
      }
      onUpdated(() => {
        document.onkeydown = function (e) {
          if (e.key === 'Enter') {
            handleSumbit();
          }
        };
      });

      return {
        register,
        tableRef,
        registerTable,
        handleSumbit,
        getTableAction,
        ...toRefs(props),
      };
    },
  });
</script>
<style lang="less">
  .check-btn {
    margin-left: 5px !important;
  }
</style>
