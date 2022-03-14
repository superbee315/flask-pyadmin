<template>
  <BasicModal
    width="800px"
    title="选择文件"
    v-bind="$attrs"
    @register="register"
    cancelText="关闭"
    @ok="handleSumbit"
  >
    <BasicTable
      ref="tableRef"
      rowKey="id"
      @register="registerTable"
      :rowSelection="{ type: type === 'images' || type === 'files' ? 'checkbox' : 'radio' }"
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, ref, toRefs, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableActionType } from '/@/components/Table';
  import { columns } from '../../attachment/data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAttachmentList } from '/@/api/sys/general';

  const props = {
    value: { type: String, default: '' },
    type: { type: String, default: '' },
  };
  export default defineComponent({
    components: { BasicModal, BasicTable },
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
        beforeFetch: beforeFetch,
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

      // 请求之前处理
      function beforeFetch(params) {
        // tab切换 暂时方法 图片
        if (props.type === 'images' || props.type === 'image') {
          if (!params.filter) {
            params.filter = {};
          }
          params.op = {};
          params.filter.imagetype = 'png,jpg,jpeg,gif';
          params.op.imagetype = 'in';
        }
        // else if (props.type === 'files' || props.type === 'file') {
        //   if (!params.filter) {
        //     params.filter = {};
        //   }
        //   params.op = {};
        //   params.filter.imagetype = 'txt,pdf,xls,xlsx,.webp';
        //   params.op.imagetype = 'in';
        // }
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
