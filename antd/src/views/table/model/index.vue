<template>
  <CollapseContainer
    class="sys-container"
    title="自定义表单管理"
    :canExpan="false"
    helpMessage="自定义表单管理"
  >
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="id"
      @selectionChange="selectionChange"
      @rowClick="rowClick"
      @rowDbClick="handleEdit"
      showTableSetting
      :canResize="true"
      :pagination="{
        pageSize: 10,
        defaultPageSize: 10,
        showSizeChanger: false,
      }"
    >
      <template #toolbar>
        <div class="tool-btn-wrap">
          <a-button type="primary" @click="handleAdd">添加</a-button>
        </div>
      </template>
      <template #form-custom>custom-slot</template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <ExpExcelModel @register="register" @success="defaultHeader" />
    <Popup @register="addRegister" :popupData="popupData" @saveData="saveData" />
    <Info @register="infoRegister" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, createVNode } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import Info from './info.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getFormConfig, columns } from './data';
  import moment from 'moment';
  import {
    getModelList,
    addModel,
    getModel,
    editModel,
    deleteModel,
  } from '/@/api/sys/table';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import { OpsCreater } from '/@/utils/opsCreater';

  interface PopupData {
    title: string;
  }
  interface Btn {
    disable_btn: boolean;
  }

  export default defineComponent({
    name: 'Model',
    components: { CollapseContainer, BasicTable, TableAction, Popup, Info },
    setup() {
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const popupData = reactive<PopupData>({
        title: '添加',
      });
      const btn = reactive<Btn>({
        disable_btn: true,
      });
      const [registerTable] = useTable({
        rowSelection: {
          type: 'checkbox',
        },
        columns: columns,
        api: getModelList,
        useSearchForm: true,
        tableSetting: {
          redo: false,
          size: false,
        },
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        formConfig: getFormConfig(),
        actionColumn: {
          width: 260,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        showIndexColumn: false,
        bordered: true,
      });
      const [register, { openModal }] = useModal();
      const [addRegister, { openModal: openPopup }] = useModal();
      const [infoRegister, { openModal: openInfo }] = useModal();
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
        const list = [{ key: 'name', type: 'like' }];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      // 接口列表
      function afterFetch(result) {
        console.log(`result`, result);
      }

      function handleAdd() {
        popupData.title = '添加';
        openPopup(true, { id: 0 });
      }

      async function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.id; // record.key
        popupData.title = '编辑';
        getModel({ id: record.id }).then((res) => {
          const data = res.row;
          openPopup(true, data);
        });
      }

      async function handleInfo(record: Recordable) {
        popupData.title = '字段管理';
        // getAccountRecordList({ id: record.id }).then((res) => {
        //   const data = res.list;
        openInfo(true, { id: record.id });
        // });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        try {
          await deleteModel({ id: record.id }).then(() => {
            getTableAction().reload();
            success('删除成功!');
          });
        } catch (error) {
          console.log(`error`, error);
        }
      }

      function selectionChange() {
        const keys = getTableAction().getSelectRowKeys();
        if (keys.length) {
          btn.disable_btn = false;
        } else {
          btn.disable_btn = true;
        }
      }
      function rowClick() {
        const keys = getTableAction().getSelectRowKeys();
        if (keys.length) {
          btn.disable_btn = false;
        } else {
          btn.disable_btn = true;
        }
      }

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        if (!data.id) {
          await addModel(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            success('创建成功!');
          });
          console.log('----------add---');
        } else {
          await editModel(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            success('修改成功!');
          });
          console.log('----------edit---');
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: '字段管理',
            icon: 'ant-design:info-circle-outlined',
            onClick: handleInfo.bind(null, record),
          },
          {
            label: '编辑',
            icon: 'ant-design:edit-outlined',
            color: 'warning',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '删除',
            color: 'error',
            icon: 'ic:outline-delete-outline',
            popConfirm: {
              title: '是否确认删除',
              confirm: handleDelete.bind(null, record),
            },
          },
        ];
      }
      return {
        popupData,
        tableRef,
        registerTable,
        handleAdd,
        handleEdit,
        createActions,
        getTableAction,
        rowClick,
        selectionChange,
        addRegister,
        infoRegister,
        saveData,
        openModal,
        register,
        ...toRefs(btn),
      };
    },
  });
</script>
<style scoped>
  .ant-calendar-picker {
    width: 100%;
  }
  @media (max-width: 639px) {
    .sys-container .vben-basic-table-header__toolbar > * {
      margin-right: 3px;
    }

    .sys-container .vben-basic-table .ant-table-wrapper {
      padding: 3px;
    }
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
