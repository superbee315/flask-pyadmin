<template>
  <CollapseContainer
    class="sys-container"
    title="管理员管理"
    :canExpan="false"
    helpMessage="一个管理员可以有多个角色组,左侧的菜单根据管理员所拥有的权限进行生成"
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
          <a-button type="primary" @click="handleAdd"> 添加 </a-button>
          <a-button color="error" :disabled="disable_btn" @click="deleteBatches"> 删除 </a-button>
          <a-button @click="openModal"> 导出 </a-button>
        </div>
      </template>
      <template #form-custom> custom-slot </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <ExpExcelModel @register="register" @success="defaultHeader" />
    <Popup @register="addRegister" :popupData="popupData" @saveData="saveData" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, createVNode } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { jsonToSheetXlsx, ExpExcelModel, ExportModalResult } from '/@/components/Excel';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getFormConfig, columns } from './data';
  import moment from 'moment';
  import {
    getUserList,
    addUser,
    editUser,
    deleteUser,
    getGroupTree,
    deleteBatchesUser,
  } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
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
    treeData: object[];
  }
  interface Btn {
    disable_btn: boolean;
  }

  export default defineComponent({
    name: 'Admin',
    components: { CollapseContainer, BasicTable, TableAction, Popup, ExpExcelModel },
    setup() {
      init();
      const userStore = useUserStore();
      const id: any = userStore.getUserInfo?.id;
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const popupData = reactive<PopupData>({
        title: '添加',
        treeData: [],
      });
      const btn = reactive<Btn>({
        disable_btn: true,
      });
      const [registerTable] = useTable({
        rowSelection: {
          type: 'checkbox',
          getCheckboxProps: (record) => ({
            disabled: record.id === id || !record.groups[0], // Column configuration not to be checked
          }),
        },
        columns: columns,
        // clickToRowSelect: false, // 点击行不勾选
        api: getUserList,
        useSearchForm: true,
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        formConfig: getFormConfig(),
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
        },
        showIndexColumn: false,
        bordered: true,
      });
      const [register, { openModal }] = useModal();
      const [addRegister, { openModal: openPopup }] = useModal();
      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      // 请求接口之前处理
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
        const list = [
          { key: 'name', type: 'like' },
          { key: 'nickname', type: 'like' },
          { key: 'logintime', type: 'between' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      //请求接口之后处理
      function afterFetch(result) {
        result.map((item) => {
          if (item.groups) {
            item.groups_value = [];
            item.groups.map((item_group) => {
              item.groups_value.push({ lable: item_group.name, value: parseInt(item_group.id) });
            });
          } else {
            item.groups = []; //null
            item.groups_text = [];
          }
        });
      }

      //获取弹窗下拉框选项
      async function init() {
        const GroupTree = await getGroupTree();
        popupData.treeData = GroupTree.list;
      }

      function handleAdd() {
        if (!popupData.treeData.length) {
          error('没有访问权限!');
          return;
        }
        popupData.title = '添加';
        openPopup(true, {});
      }

      function handleEdit(record: EditRecordRow) {
        if (record.id === id || !record.groups[0]) {
          // error('不可修改!');
          return;
        }
        currentEditKeyRef.value = record.id; // record.key
        popupData.title = '编辑';
        const data = getTableAction().getDataSource();
        data.map((item) => {
          if (item.id === record.id) {
            record = item;
          }
        });
        openPopup(true, record);
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteUser({ id: record.id }).then((res) => {
          console.log(res);
          // getTableAction().showTableSearch();
          getTableAction().reload();
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

      function rowClick(target) {
        const keys = getTableAction().getSelectRowKeys();
        if (!target.groups[0] || target.id === id) {
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
            await deleteBatchesUser({ ids }).then((res) => {
              console.log(res);
              getTableAction().reload();
              success('删除成功!');
              getTableAction().setSelectedRowKeys([]);
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      // 添加修改提交
      async function saveData(params: any) {
        const data = params.data;
        data.groups = [];
        if (data.groups_value) {
          data.groups_value.map((item) => {
            data.groups.push(item.value);
          });
        }
        const closeModel = params.closeModal;
        if (data.groups) {
          data.groups = data.groups.toString();
        } else {
          data.groups = data.groups_text = '';
        }
        delete data.groups_value;
        if (!data.id) {
          await addUser(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            success('创建成功!');
          });
          console.log('----------add---');
        } else {
          await editUser(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            success('修改成功!');
          });
          console.log('----------edit---');
        }
      }

      // 导出
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        const jsondata = getTableAction().getDataSource();
        const excelData: object[] = [];
        jsondata.map((item, i) => {
          let data = {
            No: 0,
            id: '',
            username: '',
            nickname: '',
            groups: '',
            email: '',
            status: '',
            logintime: '',
          };
          data.No = i + 1;
          data.id = item.id;
          data.username = item.username;
          data.nickname = item.nickname;
          item.groups.map((group, i) => {
            data.groups += group.name;
            if (i < item.groups.length - 1) {
              data.groups += ',';
            }
          });
          data.email = item.email;
          data.status = item.status === 'normal' ? '启用' : '停用';
          data.logintime = moment(item.logintime * 1000).format('YYYY-MM-DD HH:mm:ss');
          excelData.push(data);
        });
        jsonToSheetXlsx({
          data: excelData,
          header: {
            No: 'No.',
            id: 'ID',
            username: '用户名',
            nickname: '昵称',
            groups: '所属组别',
            email: '邮箱',
            status: '状态',
            logintime: '最后登录',
          },
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }

      // 创建操作列
      function createActions(record: EditRecordRow): ActionItem[] {
        if (id === record.id || !record.groups[0]) {
          return [
            {
              label: '',
            },
          ];
        }
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
        handleAdd,
        handleEdit,
        deleteBatches,
        createActions,
        getTableAction,
        rowClick,
        selectionChange,
        addRegister,
        saveData,
        getUserList,
        defaultHeader,
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
