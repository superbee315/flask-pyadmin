<template>
  <div class="p-4">
    <BasicTable ref="tableRef" @register="registerTable" :bordered="true" rowKey="id">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
      <!-- <template #action="{ record, column }">
      </template> -->
      <template #form-custom> custom-slot </template>

      <template #toolbar>
        <Upload action="http://localhost:8000/api/upload/" method="POST" :showUploadList="false" />
      </template>
    </BasicTable>
    <!-- <Model @register="addRegister" :modelData="modelData" /> -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import {
    createTableColumns,
    createPreviewActionColumn,
  } from '/@/components/customComponents/fileData';
  import { FileItem } from '/@/components/Upload/src/types';
  import Upload from '/@/components/customComponents/upload.vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import {
    // downloadByUrl,
    // downloadByData,
    // downloadByBase64,
    downloadByOnlineUrl,
  } from '/@/utils/file/download';

  interface ModelData {
    title: string;
  }
  export default defineComponent({
    components: { BasicTable, TableAction, Upload },
    setup() {
      const modelData = reactive<ModelData>({
        title: '',
      });
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const [registerTable] = useTable({
        title: '基础示例',
        titleHelpMessage: '温馨提醒',
        rowSelection: { type: 'checkbox' },
        columns: createTableColumns(),
        clickToRowSelect: false, // 点击行不勾选
        // showTableSetting: true,
        // columns: [{title:'Id',dataIndex:'id',width:150},{title:'姓名',dataIndex:'name',width:200},{title:'地址',dataIndex:'addr',width:250}],
        dataSource: [
          {
            id: 1,
            name: '文件1.jpg',
            thumbUrl:
              'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1999921673,816131569&fm=26&gp=0.jpg',
            size: 1504,
            type: 'jpg',
          },
          {
            id: 2,
            thumbUrl:
              'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2496571732,442429806&fm=26&gp=0.jpg',
            name: '未知.jpg',
            type: 'jpg',
            size: 442368,
          },
          { id: 3, name: '文件2', thumbUrl: '', size: 0 },
        ],
        showIndexColumn: false,
        actionColumn: createPreviewActionColumn(handleRemove, handleDownload),
      });
      const [addRegister, { openModal: openAdd }] = useModal();
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

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
      }

      async function handleSave(record: EditRecordRow) {
        const pass = await record.onEdit?.(false, true);
        console.log('------- 保存 ----------');
        console.log(record);
        console.log('------- 保存 ----------');
        if (pass) {
          currentEditKeyRef.value = '';
        }
      }

      // 删除
      function handleRemove(record: FileItem) {
        console.log('点击了删除');
        console.log(record);
        console.log('点击了删除');
      }

      // 下载
      function handleDownload(record: FileItem) {
        console.log('点击了下载');
        console.log(record);
        const fileUrl = record.thumbUrl as string;
        const fileName = record.name;
        downloadByOnlineUrl(fileUrl, fileName);
      }

      function handleDelete(record: Recordable) {
        console.log('点击了删除', record);
        const data = getTableAction().getDataSource();
        getTableAction().setTableData(data.filter((item) => item.id !== record.id));
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
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
        // ...toRefs(state),
        tableRef,
        registerTable,
        rowClick,
        addColumn,
        deleteSelect,
        createActions,
        getTableAction,
        getSelectRowList,
        getSelectRowKeyList,
        addRegister,
        handleSubmit,
      };
    },
  });
</script>
