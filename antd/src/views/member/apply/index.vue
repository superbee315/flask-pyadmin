<template>
  <CollapseContainer
    class="sys-container"
    title="审核管理"
    :canExpan="false"
    helpMessage="审核管理"
  >
    <BasicTable
      ref="tableRef"
      @register="registerTable"
      rowKey="id"
      :rowClassName="tableRowClass"
      @selectionChange="selectionChange"
      @rowClick="rowClick"
      @rowDbClick="handleDetail"
      :canResize="true"
      :pagination="{
        pageSize: 10,
        defaultPageSize: 10,
        showSizeChanger: false,
      }"
    >
      <template #toolbar>
        <div class="tool-btn-wrap">
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
    <Popup @register="addRegister" />
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
    GetChecRecordkList,
    GetChecRecord,
    deleteBatchesCheckRecord,
    deleteChecRecord,
  } from '/@/api/sys/member';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import { OpsCreater } from '/@/utils/opsCreater';

  interface Btn {
    disable_btn: boolean;
  }

  export default defineComponent({
    components: { CollapseContainer, BasicTable, TableAction, Popup, ExpExcelModel },
    setup() {
      const { createMessage } = useMessage();
      const { success /*, error*/ } = createMessage;
      const tableRef = ref<Nullable<TableActionType>>(null);
      const currentEditKeyRef = ref('');
      const btn = reactive<Btn>({
        disable_btn: true,
      });
      const [registerTable] = useTable({
        rowSelection: { type: 'checkbox' },
        columns: columns,
        api: GetChecRecordkList,
        useSearchForm: true,
        showTableSetting: true,
        tableSetting: {
          redo: false,
          size: false,
        },
        beforeFetch: beforeFetch,
        formConfig: getFormConfig(),
        actionColumn: {
          width: 140,
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
          { key: 'createtime', type: 'between' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      function handleDetail(record: EditRecordRow) {
        currentEditKeyRef.value = record.id; // record.key
        GetChecRecord({ id: record.id }).then((res) => {
          const data = res.row;
          openPopup(true, data);
        });
      }

      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteChecRecord({ id: record.id }).then((res) => {
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
            await deleteBatchesCheckRecord({ ids }).then((res) => {
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

      // 导出
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        const jsondata = getTableAction().getDataSource();
        const excelData: object[] = [];
        jsondata.map((item, i) => {
          let data = {
            No: 0,
            id: '',
            name: '',
            reason: '',
            createtime: '',
          };
          data.No = i + 1;
          data.id = item.id;
          data.name = item.name;
          data.reason = item.reason;
          data.createtime = moment(item.createtime).format('YYYY-MM-DD');
          excelData.push(data);
        });
        jsonToSheetXlsx({
          data: excelData,
          header: {
            No: 'No.',
            id: 'ID',
            name: '申请成员',
            reason: '审批信息',
            createtime: '审批时间',
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
            label: '详情',
            icon: 'ant-design:info-circle-outlined',
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

      function tableRowClass(record) {
        if (record.nature === 0) {
          return 'rowClass';
        }
        return '';
      }
      return {
        tableRef,
        registerTable,
        handleDetail,
        deleteBatches,
        createActions,
        rowClick,
        selectionChange,
        addRegister,
        defaultHeader,
        openModal,
        register,
        tableRowClass,
        ...toRefs(btn),
      };
    },
  });
</script>
<style scoped>
  .search-wrap {
    display: flex;
    width: 90%;
    margin: 0 auto;
    justify-content: flex-end;
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

  ::v-deep table .rowClass {
    background: #e9e173;
    color: rgba(0, 0, 0, 0.85);
  }

  /* 鼠标悬停不变色 */
  ::v-deep table tbody .rowClass:hover > td {
    background-color: #e9e173 !important;
  }
</style>
