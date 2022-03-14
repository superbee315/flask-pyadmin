<template>
  <CollapseContainer
    class="sys-container"
    title="会员管理"
    :canExpan="false"
    helpMessage="会员管理"
  >
    <a-button
      v-for="tab in tabs"
      :key="tab.isCheck"
      type="default"
      class="mr-2"
      :id="current_tab.isCheck === tab.isCheck ? 'current-btn' : ''"
      @click="handleTab(tab)"
    >
      {{ tab.name }}
    </a-button>
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="id"
      @selectionChange="selectionChange"
      @rowClick="rowClick"
      @rowDbClick="handleEdit"
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
    <CheckPopup @register="checkRegister" @saveData="saveCheckData" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, createVNode } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import CheckPopup from './CheckPopup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { jsonToSheetXlsx, ExpExcelModel, ExportModalResult } from '/@/components/Excel';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getFormConfig, columns } from './data';
  import moment from 'moment';
  import { OpsCreater } from '/@/utils/opsCreater';
  import {
    getUserList,
    addUser,
    deleteBatchesUser,
    getUser,
    editUser,
    deleteUser,
  } from '/@/api/sys/member';
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
  }

  interface Tab {
    isCheck: number;
    name: string;
  }

  interface State {
    tabs: Tab[];
    current_tab: Tab;
    disable_btn: boolean;
  }

  export default defineComponent({
    name: 'Member',
    components: { CollapseContainer, BasicTable, TableAction, CheckPopup, Popup, ExpExcelModel },
    setup() {
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const popupData = reactive<PopupData>({
        title: '添加',
      });
      const state = reactive<State>({
        tabs: [
          { isCheck: 1, name: '会员列表' },
          { isCheck: 0, name: '待审核' },
        ],
        current_tab: { isCheck: 1, name: '会员列表' },
        disable_btn: true,
      });
      const [registerTable] = useTable({
        rowSelection: { type: 'checkbox' },
        columns: columns,
        api: getUserList,
        useSearchForm: true,
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        showTableSetting: true,
        tableSetting: {
          redo: false,
          size: false,
        },
        formConfig: getFormConfig(),
        actionColumn: {
          width: 180,
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
      const [checkRegister, { openModal: openCheckPopup }] = useModal();
      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }
      // 请求之前处理参数
      function beforeFetch(params) {
        // 通过tab获取不同的数据
        params.isCheck = state.current_tab.isCheck;
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
          { key: 'jointime', type: 'between' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      function afterFetch(result) {
        console.log(`result`, result);
        // tableData.result = result;
      }

      function handleTab(tab) {
        state.current_tab = tab;
        getTableAction().reload();
      }

      function handleAdd() {
        popupData.title = '添加';
        openPopup(true, { family: [] });
      }

      async function handleEdit(record: EditRecordRow) {
        popupData.title = '编辑';
        await getUser({ id: record.id }).then((res) => {
          const data = res.row;
          openPopup(true, data);
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteUser({ id: record.id }).then((res) => {
          console.log(res);
          getTableAction().reload();
          success('删除成功!');
        });
      }

      function handleCheck(record: Recordable) {
        console.log(record);
        openCheckPopup(true, record);
      }

      function selectionChange() {
        const keys = getTableAction().getSelectRowKeys();
        if (keys.length) {
          state.disable_btn = false;
        } else {
          state.disable_btn = true;
        }
      }
      function rowClick() {
        const keys = getTableAction().getSelectRowKeys();
        if (keys.length) {
          state.disable_btn = false;
        } else {
          state.disable_btn = true;
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

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        console.log(`data`, data);
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

      async function saveCheckData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        await editUser(data).then((res) => {
          console.log(res);
          // 如果审核通过切换到获取正式会员
          if (data.isCheck) {
            state.current_tab = { isCheck: 1, name: '会员列表' };
            getTableAction().reload();
          }
          closeModel();
          success('操作成功!');
        });
      }

      // 导出
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        const jsondata = getTableAction().getDataSource();
        const excelData: object[] = [];
        const options = ['会长', '副会长', '秘书长', '副秘书长', '理事', '会员'];
        jsondata.map((item, i) => {
          let data = {
            No: 0,
            id: '',
            name: '',
            type: '',
            duty: '',
            jointime: '',
            nowdues: '',
            lastdues: '',
            nowmeeting: '',
            lastmeeting: '',
            createtime: '',
          };
          data.No = i + 1;
          data.id = item.id;
          data.name = item.name;
          data.type = item.type === 'unit' ? '单位' : '个人';
          data.duty = options[item.duty];
          data.jointime = moment(item.jointime).format('YYYY-MM-DD');
          data.nowdues = item.nowdues;
          data.lastdues = item.lastdues;
          data.nowmeeting = item.nowmeeting;
          data.lastmeeting = item.lastmeeting;
          data.createtime = moment(item.createtime * 1000).format('YYYY-MM-DD');
          excelData.push(data);
        });
        jsonToSheetXlsx({
          data: excelData,
          header: {
            No: 'No.',
            id: 'ID',
            name: '姓名(名称)',
            type: '会员身份',
            duty: '职务',
            jointime: '入会时间',
            nowdues: '当年会费',
            lastdues: '去年会费',
            nowmeeting: '当年参会率',
            lastmeeting: '去年参会率',
            createtime: '创建日期',
          },
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        const actionArr: ActionItem[] = [
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
        if (record.ischeck === 0) {
          // 如果不是正式会员添加审核操作
          actionArr.unshift({
            label: '审核',
            icon: 'ant-design:check-circle-outlined',
            color: 'success',
            onClick: handleCheck.bind(null, record),
          });
        }
        return actionArr;
      }
      return {
        popupData,
        handleTab,
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
        checkRegister,
        saveData,
        saveCheckData,
        defaultHeader,
        openModal,
        register,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  #current-btn {
    color: #3785cc;
    border: 1px solid #3785cc;
  }

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
