<template>
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="id"
      @selectionChange="selectionChange"
      :rowSelection="{ type: 'radio' }"
      @rowClick="rowClick"
      :pagination="{
        pageSize: 10,
        defaultPageSize: 10,
        showSizeChanger: false,
      }"
    >
      <template #toolbar>
        <div class="tool-btn-wrap">
          <a-button type="primary" @click="handleAdd"> 添加 </a-button>
        </div>
      </template>
      <template #form-custom> custom-slot </template>
    </BasicTable>
    <Popup @register="addRegister" @saveData="saveData" />
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import Popup from './popup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { columns } from './data';
  import { getField, addField } from '/@/api/sys/table';
  import { BasicTable, useTable, EditRecordRow, TableActionType } from '/@/components/Table';
  import { OpsCreater } from '/@/utils/opsCreater';
  const props = {
    value: { type: Object, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: Number, default: 1 },
  };

  export default defineComponent({
    name: 'Field',
    components: { BasicTable, Popup },
    props,
    emits: ['register', 'select'],
    setup(props, { emit }) {
      // init();
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerTable] = useTable({
        columns: columns,
        // clickToRowSelect: false, // 点击行不勾选
        api: getField,
        useSearchForm: false,
        showTableSetting: false,
        tableSetting: {
          redo: false,
          size: false,
        },
        maxHeight: 190,
        showIndexColumn: false,
        bordered: true,
      });
      const [addregister, { openModal: openPopup }] = useModal();
      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      function beforeFetch(params) {
        if (!params.field && !params.order) {
          params.field = 'id';
          params.order = 'descend';
        }
        params.inOut = props.type;
        for (let k in params) {
          if (k !== 'page' && k !== 'pageSize' && k !== 'field' && k !== 'order') {
            if (params[k] === '') {
              delete params[k];
            } else {
              if (!params.filter) {
                params.filter = {};
              }

              params.filter[k] = params[k];
              delete params[k];
            }
          }
        }

        params.offset = params.page;
        params.limit = params.pageSize;
        delete params.page;
        delete params.pageSize;

        //模糊查询字段
        const op = OpsCreater([{ key: 'name', type: 'like' }], params);
        params.op = op;
      }

      function afterFetch(result) {
        console.log(`result`, result);
        // tableData.result = result;
      }

      function selectionChange(evt) {
        emit('select', evt.rows[0]);
      }

      function rowClick(record: EditRecordRow) {
        emit('select', record);
      }

       function handleAdd() {
        // 开启弹窗
        openPopup(true, {});
      }

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        console.log(`data`, data);
        await addField(data).then((res) => {
          console.log(res);
          getTableAction().reload();
          closeModel();
          success('创建成功!');
        });
      }

      return {
        tableRef,
        registerTable,
        handleAdd,
        selectionChange,
        rowClick,
        addRegister,
        saveData,
      };
    },
  });
</script>
<style scoped>
  .ant-calendar-picker {
    width: 100%;
  }

  .vben-basic-table-header__toolbar {
    justify-content: space-between;
  }

  .tool-btn-wrap button {
    margin-right: 5px;
  }
</style>
