<template>
  <CollapseContainer
    class="sys-container"
    title="管理员日志"
    :canExpan="false"
    helpMessage="管理员可以查看自己所拥有的权限的管理员日志"
    ><BasicTable ref="tableRef" @register="registerTable" rowKey="id" @rowDbClick="handleDetail">
      <template #toolbar>
        <a-button color="error" @click="deleteA"> 删除 </a-button>
        <a-button type="primary" @click="openModal"> 导出 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
    <ExpExcelModel @register="register" @success="defaultHeader" />
    <Popup @register="PopupRegister" :popupData="popupData" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import { getUserList, deleteUser } from '/@/api/sys/user';
  import { useModal } from '/@/components/Modal';
  import { jsonToSheetXlsx, ExpExcelModel, ExportModalResult } from '/@/components/Excel';
  import { columns } from './data';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';

  const formData = [
    {
      id: 1,
      username: 'test1',
      title: '日志1',
      url: 'http://localhost:3100/#/permission/admin',
      ip: '0.0.0.0',
      browser: 'Mozilla/5.0',
      time: '2020-10-20',
    },
    {
      id: 2,
      username: 'test2',
      title: '日志2',
      url: 'http://localhost:3100/#/permission/admin',
      ip: '0.0.0.0',
      browser: 'Mozilla/5.0',
      time: '2020-10-21',
    },
    {
      id: 3,
      username: 'test3',
      title: '日志3',
      url: 'http://localhost:3100/#/permission/admin',
      ip: '0.0.0.0',
      browser: 'Mozilla/5.0',
      time: '2020-10-21',
    },
  ];

  export default defineComponent({
    name: 'Log',
    components: { CollapseContainer, BasicTable, TableAction, Popup, ExpExcelModel },
    setup() {
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const popupData = reactive({
        title: '详情',
      });
      const { reloadMenu } = usePermission();
      const [register, { openModal }] = useModal();
      const [registerTable] = useTable({
        // title: '管理员日志',
        // titleHelpMessage: '',
        rowSelection: { type: 'checkbox' },
        columns: columns,
        clickToRowSelect: false, // 点击行不勾选
        // api: getUserList,
        dataSource: formData,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        showIndexColumn: false,
        bordered: true,
      });
      const [PopupRegister, { openModal: openAdd }] = useModal();

      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      function getSelectRowList() {
        // 获取选中行
        console.log(getTableAction().getSelectRows());
      }
      function getSelectRowKeyList() {
        // 获取选中行的key --- id
        console.log(getTableAction().getSelectRowKeys());
      }

      function handleDetail(record: EditRecordRow) {
        currentEditKeyRef.value = record.id; // record.key

        const data = getTableAction().getDataSource();
        data.map((item) => {
          if (item.id === record.id) {
            record = item;
          }
        });
        openAdd(true, record);
      }

      async function handleDelete(record: Recordable) {
        console.log('点击了删除', record.id);
        console.log(record);
        await deleteUser({ id: record.id }).then((res) => {
          console.log(res);
          getTableAction().reload();
        });
        // const data = getTableAction().getDataSource()
        // console.log(data)
        // getTableAction().setTableData(data.filter(item => item.id !== record.id))
      }

      // 导出
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        jsonToSheetXlsx({
          data: formData,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }
      function deleteA() {
        // document.location.reload();
        reloadMenu();
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: '详情',
            icon: 'akar-icons:eye-open',
            color: 'success',
            onClick: handleDetail.bind(null, record),
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
        defaultHeader,
        popupData,
        tableRef,
        registerTable,
        handleDetail,
        createActions,
        getTableAction,
        getSelectRowList,
        getSelectRowKeyList,
        PopupRegister,
        getUserList,
        register,
        openModal,
        deleteA,
      };
    },
  });
</script>
