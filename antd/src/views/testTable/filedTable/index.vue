<template>
  <CollapseContainer
    class="sys-container"
    title="字段管理"
    :canExpan="false"
    helpMessage="字段管理"
  >
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="order"
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
          <a-button type="primary" @click="handleAdd">添加字段</a-button>
        </div>
      </template>
      <template #form-custom>custom-slot</template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <Popup @register="addRegister" :popupData="popupData" @saveData="saveData" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { getFormConfig, columns } from './data';
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

  const fakeData = [
    {
      order: 1,
      name: 'age',
      title: '年龄',
      type: 'Number',
      contribution: '测试',
      system: 'normal',
      require: 'normal',
      search: 'normal',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 2,
      name: 'id',
      title: 'ID',
      type: 'Number',
      contribution: '测试',
      system: 'normal',
      require: 'normal',
      search: 'normal',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 3,
      name: 'file',
      title: '文件',
      type: 'download',
      contribution: '测试',
      system: 'normal',
      require: 'disabled',
      search: 'normal',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 4,
      name: 'title',
      title: '标题',
      type: 'Input',
      contribution: '测试',
      system: 'normal',
      require: 'disable',
      search: 'normal',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 4,
      name: 'video',
      title: '视频',
      type: 'Video',
      contribution: '测试',
      system: 'normal',
      require: 'disabled',
      search: 'disabled',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 4,
      name: 'name',
      title: '姓名',
      type: 'Input',
      contribution: '测试',
      system: 'disabled',
      require: 'normal',
      search: 'normal',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 5,
      name: 'attachment',
      title: '附件',
      type: 'Editor',
      contribution: '测试',
      system: 'disabled',
      require: 'normal',
      search: 'disabled',
      status: 'normal',
      ableOrder: 'disabled',
    },
    {
      order: 6,
      name: 'time',
      title: '日期',
      type: 'DatePicker',
      contribution: '测试',
      system: 'disabled',
      require: 'normal',
      search: 'disabled',
      status: 'normal',
      ableOrder: 'disabled',
    },
  ];
  export default defineComponent({
    name: 'TestTable',
    components: { CollapseContainer, BasicTable, TableAction, Popup },
    setup() {
      const { createMessage } = useMessage();
      const { success } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const popupData = reactive<PopupData>({
        title: '添加',
      });
      const [registerTable] = useTable({
        rowSelection: {
          type: 'checkbox',
        },
        columns: columns,
        dataSource: fakeData,
        useSearchForm: true,
        formConfig: getFormConfig(),
        actionColumn: {
          width: 160,
          title: '管理操作',
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

      function handleAdd() {
        popupData.title = '添加';
        openPopup(true, {});
      }

      //点击编辑按钮
      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.id; // record.key
        popupData.title = '编辑';
        openPopup(true, record);
      }

      //点击删除按钮
      function handleDelete(e) {
        console.log('e', e);
      }

      async function saveData(params: any) {
        const data = params.data;
        const closeModel = params.closeModal;
        if (!data.id) {
          getTableAction().reload();
          closeModel();
          success('创建成功!');
          console.log('----------add---');
        } else {
          getTableAction().reload();
          closeModel();
          success('修改成功!');
          console.log('----------edit---');
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: '编辑',
            // color: 'primary',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '禁用',
            color: 'warning',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '删除',
            color: 'error',
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
        addRegister,
        saveData,
        openModal,
        register,
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
