<template>
  <CollapseContainer
    class="sys-container"
    title="角色组"
    :canExpan="false"
    helpMessage="角色组可以有多个,角色有上下级层级关系,如果子角色有角色组和管理员的权限则可以派生属于自己组别的下级角色组或管理员"
  >
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      @fetchSuccess="ExpandAllRows"
      @selectionChange="selectionChange"
      @rowClick="rowClick"
      @rowDbClick="handleEdit"
      defaultExpandAllRows
      showTableSetting
      rowKey="id"
    >
      <template #toolbar>
        <div class="tool-btn-wrap">
          <a-button type="primary" @click="toggleRowShow">{{ btn_text }}</a-button>
          <a-button type="primary" @click="addGroupFn"> 添加 </a-button>
          <a-button color="error" :disabled="disable_btn" @click="deleteBatches"> 删除 </a-button>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <Popup @register="addRegister" :popupData="popupData" @saveData="saveData" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, nextTick, createVNode } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import { useModal } from '/@/components/Modal';
  import { columns } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import {
    getGroupTree,
    addGroup,
    editGroup,
    deleteGroup,
    deleteBatchesGroup,
    getGroupById,
  } from '/@/api/sys/user';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';

  interface PopupData {
    title: string;
    treeData: object[];
    group_ids: number[];
  }
  interface Btn {
    btn_text: string;
    btn_status: boolean;
    disable_btn: boolean;
  }

  interface Group {
    id: any;
    name: string;
  }

  export default defineComponent({
    name: 'Group',
    components: { CollapseContainer, BasicTable, TableAction, Popup },
    setup() {
      const userStore = useUserStore();
      const groups = userStore.getUserInfo.groups as Group[];
      const group_ids = groups.map((item) => item.id);
      const { createMessage } = useMessage();
      const { success /*, error */ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const popupData = reactive<PopupData>({
        title: '添加',
        treeData: [{}],
        group_ids: [],
      });

      const btn = reactive<Btn>({
        btn_text: '展开全部',
        btn_status: true,
        disable_btn: true,
      });
      const [registerTable, { expandAll, collapseAll }] = useTable({
        rowSelection: {
          type: 'checkbox',
          getCheckboxProps: (record) => ({
            disabled: group_ids.includes(record.id), // Column configuration not to be checked
          }),
        },
        columns: columns,
        // clickToRowSelect: false, // 点击行不勾选
        api: getGroupTree,
        isTreeTable: true,
        pagination: false, // 树列表不显示分页
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        indentSize: 10, // 展开按钮缩进
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        tableSetting: {
          // redo: false,
          size: false,
          formSearch: false,
        },
        showIndexColumn: false,
        bordered: true,
      });
      const [addRegister, { openModal: openPopup }] = useModal();

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
        params.filter = JSON.stringify(params.filter);
        params.offset = params.page;
        params.limit = params.pageSize;
        delete params.page;
        delete params.pageSize;
      }
      function afterFetch(result) {
        popupData.treeData = result;
      }

      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      function addGroupFn() {
        console.log('添加');
        popupData.title = '添加';
        popupData.group_ids = group_ids;
        openPopup(true, {});
      }

      async function ExpandAllRows() {
        await nextTick();
        toggleRowShow();
      }

      function toggleRowShow() {
        if (btn.btn_status) {
          expandAll();
          btn.btn_text = '折叠全部';
          btn.btn_status = false;
        } else {
          collapseAll();
          btn.btn_text = '展开全部';
          btn.btn_status = true;
        }
      }

      function handleEdit(record: EditRecordRow) {
        if (group_ids.includes(record.id)) {
          return;
        }
        // currentEditKeyRef.value = record.id; // record.key
        popupData.title = '编辑';
        getGroupById({ id: record.id }).then((res) => {
          const data = res.row;
          openPopup(true, data);
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteGroup({ id: record.id }).then(() => {
          getTableAction().reload();
          ExpandAllRows();
          success('删除成功!');
        });
      }

      async function selectionChange() {
        const keys = await getTableAction().getSelectRowKeys();
        if (keys.length) {
          btn.disable_btn = false;
        } else {
          btn.disable_btn = true;
        }
      }
      async function rowClick(target) {
        const keys = await getTableAction().getSelectRowKeys();
        if (group_ids.includes(target.id)) {
          keys.splice(
            keys.findIndex((item) => item === target.id),
            1
          );
        }
        if (keys.length) {
          btn.disable_btn = false;
        } else {
          btn.disable_btn = true;
        }
      }

      async function deleteBatches() {
        const keys = await getTableAction().getSelectRowKeys();
        const count = keys.length;
        const ids = keys.toString();
        if (!ids) {
          return;
        }
        Modal.confirm({
          title: '删除提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: '确定删除选中的' + count + '项?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          maskClosable: true,
          async onOk() {
            await deleteBatchesGroup({ ids }).then(() => {
              getTableAction().reload();
              ExpandAllRows();
              success('删除成功!');
              getTableAction().setSelectedRowKeys([]);
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      async function saveData(params: any) {
        params.data.rules = params.data.rules.toString();
        const data = params.data;
        const closeModel = params.closeModal;
        console.log(`data`, data);
        if (!data.id) {
          await addGroup(data).then(() => {
            getTableAction().reload();
            closeModel();
            ExpandAllRows();
            success('创建成功!');
          });
        } else {
          await editGroup(data).then(() => {
            getTableAction().reload();
            closeModel();
            ExpandAllRows();
            success('修改成功!');
          });
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (record.pid === 0 || group_ids.includes(record.id)) {
          return [
            {
              label: '',
              icon: '',
            },
          ];
        } else {
          return [
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
      }
      return {
        popupData,
        tableRef,
        registerTable,
        addGroupFn,
        handleEdit,
        deleteBatches,
        createActions,
        getTableAction,
        rowClick,
        selectionChange,
        toggleRowShow,
        addRegister,
        saveData,
        ExpandAllRows,
        ...toRefs(btn),
      };
    },
  });
</script>
<style scoped>
  .tool-btn-wrap {
    flex: 1;
  }
  .tool-btn-wrap {
    flex: 1;
  }
  .tool-btn-wrap button {
    margin-right: 5px;
  }
</style>
