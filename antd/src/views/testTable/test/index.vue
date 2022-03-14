<template>
  <CollapseContainer
    class="sys-container"
    title="模型管理"
    :canExpan="false"
    helpMessage="模型管理"
  >
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="id"
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
          <a-button type="primary" @click="handleAdd">添加模型</a-button>
        </div>
      </template>
      <template #form-custom>custom-slot</template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <Popup @register="addRegister" :popupData="popupData" @saveData="saveData" />
    <Modal @register="modalRegister" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import Popup from './popup.vue';
  import Modal from './modal.vue';
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
      id: 1,
      name: '文章',
      database: 'news',
      desc: 'blasdfasdfjlasdg',
      status: 'normal',
      volume: 15,
    },
    {
      id: 2,
      name: '下载模型',
      database: 'download',
      desc: '下载文件',
      status: 'normal',
      volume: 3,
    },
    {
      id: 3,
      name: '图片',
      database: 'picture',
      desc: '图表表测试',
      status: 'disable',
      volume: 21,
    },
    {
      id: 4,
      name: '视频',
      database: 'video',
      desc: 'blasdfasdfjlasdg',
      status: 'normal',
      volume: 10,
    },
  ];

  export default defineComponent({
    name: 'TestTable',
    components: { CollapseContainer, BasicTable, TableAction, Popup, Modal },
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
      const [addRegister, { openModal: openPopup }] = useModal();
      const [modalRegister, { openModal }] = useModal();
      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      //点击添加模型按钮
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

      //点击禁用按钮
      function handleDisabled(record: EditRecordRow) {
        console.log('点击禁用按钮');
        console.log('record :>> ', record);
      }

      //点击字段管理按钮
      function handleFiledEdit(record: EditRecordRow) {
        console.log('点击字段管理按钮');
        openModal(true, { id: record.id });
      }

      //点击删除按钮
      function handleDelete(record: EditRecordRow) {
        console.log('点击删除按钮');
        console.log('record :>> ', record);
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
          closeModel();
          success('修改成功!');
          console.log('----------edit---');
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: '字段管理',
            color: 'success',
            onClick: handleFiledEdit.bind(null, record),
          },
          {
            label: '编辑',
            // color: 'primary',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '禁用',
            color: 'warning',
            onClick: handleDisabled.bind(null, record),
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
        modalRegister,
        addRegister,
        saveData,
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
