<template>
  <CollapseContainer
    class="sys-container"
    title="菜单规则"
    :canExpan="false"
    helpMessage="规则通常对应一个控制器的方法,同时左侧的菜单栏数据也从规则中体现,通常建议通过命令行进行生成规则节点"
  >
    <!-- canDragRow -->
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      @fetchSuccess="ExpandAllRows"
      @selectionChange="selectionChange"
      @rowClick="selectionChange"
      @rowDbClick="handleEdit"
      @dragRow="dragRow"
      showTableSetting
      rowKey="id"
    >
      <template #toolbar>
        <div class="tool-btn-wrap">
          <a-button type="primary" @click="toggleRowShow">{{ btn_text }}</a-button>
          <a-button type="primary" @click="addRuleFn"> 添加 </a-button>
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
  import { usePermission } from '/@/hooks/web/usePermission';
  import { defineComponent, reactive, ref, toRefs, unref, nextTick, createVNode } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns } from './data';
  import {
    getRuleTree,
    addRule,
    editRule,
    deleteRule,
    deleteBatchesRule,
    getRuleById,
  } from '/@/api/sys/user';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
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
  }

  interface Btn {
    btn_text: string;
    btn_status: boolean;
    disable_btn: boolean;
  }

  export default defineComponent({
    name: 'Rule',
    components: { CollapseContainer, BasicTable, TableAction, Popup },
    setup() {
      const { reloadMenu } = usePermission();
      const { createMessage } = useMessage();
      const { success /*, error */ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const popupData = reactive<PopupData>({
        title: '添加',
        treeData: [{}],
      });
      const btn = reactive<Btn>({
        btn_text: '展开全部',
        btn_status: true,
        disable_btn: true,
      });
      const [registerTable, { expandAll, collapseAll }] = useTable({
        rowSelection: { type: 'checkbox' },
        columns: columns,
        indentSize: 10, // 展开按钮缩进
        isTreeTable: true,
        pagination: false, // 树列表不显示分页
        api: getRuleTree,
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        // dataSource: formData,
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

      const [addRegister, { openModal: openAdd }] = useModal();

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

      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      function addRuleFn() {
        popupData.title = '添加';
        openAdd(true, {});
      }

      function handleEdit(record: EditRecordRow) {
        popupData.title = '编辑';

        getRuleById({ id: record.id }).then((res) => {
          const data = res.row;
          openAdd(true, data);
        });
      }

      async function handleDelete(record: Recordable) {
        console.log('点击了删除', record.id);
        console.log(record);
        await deleteRule({ id: record.id }).then(() => {
          getTableAction().reload();
          if (record.ismenu) {
            // 只有删除的是菜单才重新加载菜单
            reloadMenu();
          }
          ExpandAllRows();
          success('删除成功!');
        });
      }

      function selectionChange() {
        const keys = getTableAction().getSelectRowKeys();
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
            await deleteBatchesRule({ ids }).then(() => {
              getTableAction().reload();
              getTableAction().setSelectedRowKeys([]);
              reloadMenu();
              ExpandAllRows();
              success('删除成功!');
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        console.log(`data????`, data);
        if (!data.id) {
          await addRule(data).then(() => {
            getTableAction().reload();
            closeModel();
            if (data.ismenu) {
              // 只有添加的是菜单才重新加载菜单
              reloadMenu();
            }
          });
          ExpandAllRows();
          success('创建成功!');
          console.log('----------add---');
        } else {
          if (!data.pid) {
            data.pid = 0;
          }
          console.log(`ruledata`, data);
          await editRule(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            if (params.menuChange || data.ismenu) {
              // 修改了菜单切换按钮 或者本身是菜单才重新加载菜单
              reloadMenu();
            }
          });
          ExpandAllRows();
          success('修改成功!');
          console.log('----------edit---');
        }
      }

      // 拖拽
      function dragRow(evt) {
        console.log('=======拖拽完成才触发=========');
        const index = evt.newIndex - 1;
        const el = evt.item.querySelector('.ant-table-row-cell-ellipsis');
        if (index < 0) {
          console.log(`el`, el.innerText);
          console.log(`pre_el`, -1);
          return;
        }
        const tbody = evt.from.querySelectorAll('.ant-table-row')[index];
        const pre_el = tbody.querySelector('.ant-table-row-cell-ellipsis');
        console.log(`el`, el.innerText);
        console.log(`pre_el`, pre_el.innerText);
      }

      function createActions(record: EditRecordRow): ActionItem[] {
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
      return {
        popupData,
        tableRef,
        registerTable,
        addRuleFn,
        handleEdit,
        deleteBatches,
        createActions,
        getTableAction,
        selectionChange,
        addRegister,
        saveData,
        ExpandAllRows,
        toggleRowShow,
        dragRow,
        ...toRefs(btn),
      };
    },
  });
</script>
<style scoped>
  .tool-btn-wrap {
    flex: 1;
  }
  .tool-btn-wrap button {
    margin-right: 5px;
  }
</style>
