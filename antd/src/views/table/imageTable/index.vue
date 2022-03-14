<template>
  <div class="p-4">
    <BasicTable ref="tableRef" @register="registerTable" :bordered="true" rowKey="id">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
      <template #form-custom> custom-slot </template>

      <template #toolbar>
        <Upload>
          <!-- <a-button type="primary"> t('component.upload.upload') </a-button> -->
        </Upload>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import {
    createTableColumns,
    createPreviewActionColumn,
  } from '/@/components/customComponents/imageData';
  import { createImgPreview } from '/@/components/Preview/index';
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
        dataSource: [
          {
            id: 1,
            name: '图片1',
            thumbUrl:
              'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1999921673,816131569&fm=26&gp=0.jpg',
            size: 205,
          },
          {
            id: 2,
            thumbUrl:
              'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2496571732,442429806&fm=26&gp=0.jpg',
            name: '图片2',
            size: 342,
          },
          {
            id: 3,
            name: '图片3',
            thumbUrl:
              'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2151136234,3513236673&fm=26&gp=0.jpg',
            size: 18,
          },
        ],
        showIndexColumn: false,
        actionColumn: createPreviewActionColumn(handleRemove, handlePreview, handleDownload),
      });
      const [addRegister] = useModal();
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

      function handleSubmit() {
        console.log('handleSubmit');
        // console.log(data)
      }

      function deleteSelect() {
        console.log('删除选中行');
        let data = getTableAction().getSelectRowKeys();
        console.log(`data`, data);
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
      // 预览
      function handlePreview(record: FileItem) {
        console.log(record);
        const urlList = [record.thumbUrl] as string[];
        createImgPreview({ imageList: urlList });
      }
      // 下载
      function handleDownload(record: FileItem) {
        console.log('点击了下载');
        console.log(record);
        console.log('点击了下载');
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
