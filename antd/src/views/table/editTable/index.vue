<template>
  <div class="p-4">
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      @edit-end="handleEditEnd"
      :bordered="true"
      rowKey="id"
    >
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
      <!-- <template #action="{ record, column }">
      </template> -->
      <template #form-custom> custom-slot </template>

      <template #toolbar>
        <a-button @click="openModal"> 导出 </a-button>
        <a-button type="primary" @click="addColumn"> 添加 </a-button>
        <a-button color="error" @click="deleteSelect"> 删除选中 </a-button>
      </template>
    </BasicTable>
    <ExpExcelModel @register="register" @success="defaultHeader" />
    <Model @register="addRegister" :modelData="modelData" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { getFormConfig } from '../tableData';
  import { useModal } from '/@/components/Modal';
  import { jsonToSheetXlsx, ExpExcelModel, ExportModalResult } from '/@/components/Excel';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import Model from './model.vue';

  const columns: BasicColumn[] = [
    {
      title: 'id',
      dataIndex: 'id',
      editRow: true,
      // 默认必填校验
      editRule: true,
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      edit: true, // 点击修改当前单元格
      editComponentProps: {
        prefix: '$',
      },
      width: 200,
    },
    {
      title: '地址',
      dataIndex: 'addr',
      editRow: true,
      width: 200,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      editRow: true,
      width: 200,
    },
    {
      title: '开关',
      dataIndex: 'name6',
      editRow: true,
      editComponent: 'Switch',
      editValueMap: (value) => {
        return value ? '开' : '关';
      },
      width: 200,
    },
  ];

  interface ModelData {
    title: string;
  }
  export default defineComponent({
    components: { BasicTable, TableAction, Model, ExpExcelModel },
    setup() {
      const modelData = reactive<ModelData>({
        title: '',
      });
      const tableData = [
        { id: 1, name: '李白', addr: '新疆', age: 20 },
        { id: 2, name: '杜甫', addr: '北京', age: 32 },
        { id: 3, name: '贺知章', addr: '未知地点', age: 18 },
      ];
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const [registerTable] = useTable({
        title: '基础示例',
        titleHelpMessage: '温馨提醒',
        rowSelection: { type: 'checkbox' },
        columns: columns,
        useSearchForm: true,
        clickToRowSelect: false, // 点击行不勾选
        // showTableSetting: true,
        formConfig: getFormConfig('hello'),
        // columns: [{title:'Id',dataIndex:'id',width:150},{title:'姓名',dataIndex:'name',width:200},{title:'地址',dataIndex:'addr',width:250}],
        dataSource: tableData,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });
      const [addRegister, { openModal: openAdd }] = useModal();
      const [register, { openModal }] = useModal();
      const rowClick = (e: any) => {
        console.log(e);
      };

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

      function addColumn() {
        modelData.title = '添加';
        openAdd(true, {
          name: '',
          age: '',
          addr: '',
        });
      }

      function handleSubmit() {
        console.log('handleSubmit');
        // console.log(data)
      }

      function deleteSelect() {
        console.log('删除选中行');
        let data = getTableAction().getSelectRowKeys();
        // console.log(getTableAction().getSelectRowKeys());
        data.map((item) => {
          console.log(item);
        });
      }

      function handleEditEnd(record: EditRecordRow) {
        console.log('编辑完成end');
        console.log(record);
      }

      // function handleEdit(record: EditRecordRow) {
      //   currentEditKeyRef.value = record.id;  // record.key
      //   record.onEdit?.(true);
      // }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
      }

      async function handleSave(record: EditRecordRow) {
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
        }
      }
      function handleEdit(record: EditRecordRow) {
        console.log('编辑完成end');
        console.log(record);
        modelData.title = '编辑';
        openAdd(true, record);
      }
      function handleDelete(record: Recordable) {
        console.log('点击了删除', record);
        const data = getTableAction().getDataSource();
        getTableAction().setTableData(data.filter((item) => item.id !== record.id));
      }

      // 导出
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        console.log(`tableData`, tableData);
        jsonToSheetXlsx({
          data: tableData,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              icon: 'ant-design:edit-outlined',
              color: 'warning',
              disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              color: 'error',
              icon: 'ic:outline-delete-outline',
              disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }
      return {
        modelData,
        defaultHeader,
        tableRef,
        registerTable,
        rowClick,
        addColumn,
        deleteSelect,
        handleEdit,
        createActions,
        handleEditEnd,
        getTableAction,
        getSelectRowList,
        getSelectRowKeyList,
        addRegister,
        handleSubmit,
        register,
        openModal,
      };
    },
  });
</script>
