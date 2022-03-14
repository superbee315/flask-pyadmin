<template>
  <CollapseContainer
    class="sys-container"
    title="个人管理"
    :canExpan="false"
    helpMessage="个人管理"
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
  import { OpsCreater } from '/@/utils/opsCreater';
  import {
    getPersonList,
    addPerson,
    deleteBatchesPerson,
    getPerson,
    editPerson,
    deletePerson,
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

  interface Btn {
    disable_btn: boolean;
  }

  export default defineComponent({
    name: 'Person',
    components: { CollapseContainer, BasicTable, TableAction, Popup, ExpExcelModel },
    setup() {
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const popupData = reactive<PopupData>({
        title: '添加',
      });
      const btn = reactive<Btn>({
        disable_btn: true,
      });
      const [registerTable] = useTable({
        rowSelection: { type: 'checkbox' },
        columns: columns,
        // clickToRowSelect: false, // 点击行不勾选
        api: getPersonList,
        useSearchForm: true,
        tableSetting: {
          redo: false,
          size: false,
        },
        beforeFetch: beforeFetch,
        afterFetch: afterFetch,
        formConfig: getFormConfig(),
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          // fixed: undefined,
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
        const list = [
          { key: 'name', type: 'like' },
          { key: 'company', type: 'like' },
          { key: 'birthday', type: 'between' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      function afterFetch(result) {
        console.log(`result`, result);
        // tableData.result = result;
      }

      function handleAdd() {
        popupData.title = '添加';
        openPopup(true, {});
      }

      async function handleEdit(record: EditRecordRow) {
        popupData.title = '编辑';
        getPerson({ id: record.id }).then((res) => {
          const data = res.row;
          console.log(`data`, data);
          openPopup(true, data);
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await deletePerson({ id: record.id }).then((res) => {
          console.log(res);
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
      function rowClick() {
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
            await deleteBatchesPerson({ ids }).then((res) => {
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
          await addPerson(data).then((res) => {
            console.log(res);
            getTableAction().reload();
            closeModel();
            success('创建成功!');
          });
          console.log('----------add---');
        } else {
          await editPerson(data).then((res) => {
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
        const options = [
          '群众',
          '中共党员',
          '中共预备党员',
          '共青团员',
          '民革会员',
          '民盟盟员',
          '民建会员',
          '民进会员',
          '农工党党员',
          '致公党党员',
          '九三学社社员',
          '台盟盟员',
          '无党派人士',
        ];
        jsondata.map((item, i) => {
          let data = {
            No: 0,
            id: '',
            name: '',
            gender: '',
            origin: '',
            birthday: '',
            party: '',
            nation: '',
            company: '',
            peopleJob: '',
            cppccJob: '',
            socialJob: '',
            mobile: '',
          };
          data.No = i + 1;
          data.id = item.id;
          data.name = item.name;
          data.gender = item.gender ? '男' : '女';
          data.origin = item.origin;
          data.birthday = moment(item.birthday).format('YYYY-MM-DD');
          data.party = options[item.party];
          data.nation = item.nation;
          data.company = item.company;
          data.peopleJob = item.peopleJob;
          data.cppccJob = item.cppccJob;
          data.socialJob = item.socialJob;
          data.mobile = item.mobile;
          excelData.push(data);
        });
        jsonToSheetXlsx({
          data: excelData,
          header: {
            No: 'No.',
            id: 'ID',
            name: '姓名',
            gender: '性别',
            origin: '籍贯',
            birthday: '出生年月',
            party: '政治面貌',
            nation: '民族',
            company: '单位',
            peopleJob: '人大职务',
            cppccJob: '政协职务',
            socialJob: '社会职务',
            mobile: '联系方式',
          },
          filename,
          write2excelOpts: {
            bookType,
          },
        });
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
        handleAdd,
        handleEdit,
        deleteBatches,
        createActions,
        getTableAction,
        rowClick,
        selectionChange,
        addRegister,
        saveData,
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
