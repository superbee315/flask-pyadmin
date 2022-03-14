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
  import { getFormConfig, columns } from './data';
  import { getPersonList, addPerson } from '/@/api/sys/member';
  import { OpsCreater } from '/@/utils/opsCreater';
  import { BasicTable, useTable, EditRecordRow, TableActionType } from '/@/components/Table';

  export default defineComponent({
    name: 'Person',
    components: { BasicTable, Popup },
    emits: ['register', 'select'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerTable] = useTable({
        columns: columns,
        // clickToRowSelect: false, // 点击行不勾选
        api: getPersonList,
        useSearchForm: true,
        showTableSetting: true,
        tableSetting: {
          redo: false,
          size: false,
        },
        beforeFetch: beforeFetch,
        formConfig: getFormConfig(),
        maxHeight: 190,
        showIndexColumn: false,
        bordered: true,
      });
      const [addRegister, { openModal: openPopup }] = useModal();
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
        const list = [
          { key: 'name', type: 'like' },
          { key: 'company', type: 'like' },
          { key: 'birthday', type: 'between' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      function handleAdd() {
        // 开启弹窗
        openPopup(true, { family: [] });
      }
      function selectionChange(evt) {
        emit('select', evt.rows[0]);
      }

      function rowClick(record: EditRecordRow) {
        emit('select', record);
      }

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        await addPerson(data).then(() => {
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
        getTableAction,
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

  .tool-btn-wrap {
    flex: 1;
  }

  .tool-btn-wrap button {
    margin-right: 5px;
  }
</style>
