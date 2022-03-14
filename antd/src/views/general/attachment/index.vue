<template>
  <CollapseContainer
    class="attachment-container"
    title="附件管理"
    :canExpan="false"
    helpMessage="主要用于管理上传到服务器或第三方存储的数据"
  >
    <a-button
      v-for="tab in tabs"
      :key="tab.id"
      type="default"
      class="mr-2"
      :id="current_tab.id === tab.id ? 'current-btn' : ''"
      @click="handleTabChange(tab)"
    >
      {{ tab.title }}
    </a-button>
    <BasicTable
      ref="tableRef"
      :canResize="true"
      rowKey="id"
      @register="registerTable"
      @rowClick="rowClick"
      @selectionChange="selectionChange"
      showTableSetting
    >
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
      <template #toolbar>
        <div class="tool-btn-wrap">
          <a-upload
            :showUploadList="false"
            :multiple="false"
            :before-upload="beforeUpload"
            @change="handleChange"
            accept=".jpg,.gif,.png,.txt,.pdf,.xls,.xlsx,.jpeg,.webp"
          >
            <a-button type="primary" :disabled="disabled">
              {{ t('component.upload.upload') }}
            </a-button>
          </a-upload>
          <a-button color="error" :disabled="disable_btn" @click="deleteBatches">
            {{ t('common.delText') }}
          </a-button>
        </div>
      </template>
    </BasicTable>
  </CollapseContainer>
</template>
<script lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, reactive, ref, toRefs, unref, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Upload, Progress, Modal } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { adapt } from '/@/utils/adapt';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import { getFormConfig, columns } from './data';
  import { getAttachmentList, deleteAttachment, deleteBatchesAttachment } from '/@/api/sys/general';
  import { uploadApi } from '/@/api/sys/upload';
  import { OpsCreater } from '/@/utils/opsCreater';

  interface Tab {
    id: number;
    title: string;
  }

  interface State {
    tabs: Tab[];
    current_tab: Tab;
    disabled: boolean;
    disable_btn: boolean;
  }
  export default defineComponent({
    name: 'Attchment',
    components: {
      CollapseContainer,
      BasicTable,
      TableAction,
      [Upload.name]: Upload,
      [Modal.name]: Modal,
      [Progress.name]: Progress,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const tableHeight = adapt().tableHeight;
      const state = reactive<State>({
        tabs: [
          { id: 0, title: '全部' },
          { id: 1, title: '图片' },
          { id: 2, title: '文本' },
        ],
        current_tab: { id: 0, title: '全部' },
        disable_btn: true,
        disabled: false,
      });
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerTable, { getForm }] = useTable({
        rowSelection: {
          type: 'checkbox',
        },
        formConfig: getFormConfig(),
        columns: columns,
        maxHeight: tableHeight,
        beforeFetch: beforeFetch,
        api: getAttachmentList,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        showIndexColumn: false,
        pagination: true,
      });
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
        // tab切换 暂时方法 图片
        if (state.current_tab.id === 1) {
          if (!params.filter) {
            params.filter = {};
          }
          params.filter.imagetype = 'png,jpg,jpeg,gif';
        } else if (state.current_tab.id === 2) {
          if (!params.filter) {
            params.filter = {};
          }
          params.filter.imagetype = 'txt,pdf,xls,xlsx,.webp';
        }
        //模糊查询字段
        const list = [
          { key: 'createtime', type: 'between' },
          { key: 'imagetype', type: 'in' },
        ];
        const op = OpsCreater(list, params);
        params.op = op;
      }

      function beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          error('文件必须小于10MB!');
          return false;
        }
        uploadApi({ file })
          .then((res) => {
            console.log(`res`, res);
            success('文件上传成功');
            getTableAction().reload();
          })
          .catch((err) => {
            error('文件上传失败');
            console.log(`err`, err);
          });
        return false;
      }

      function handleChange(info) {
        console.log(`info`, info);
      }

      async function handleTabChange(tab) {
        state.current_tab = tab;
        // 重置查询
        getForm().resetFields();
        getTableAction().reload();
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

      // async function handleEdit(record: Recordable) {
      //   console.log(`record`, record);
      //   console.log('=====编辑');
      // }
      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteAttachment({ id: record.id }).then(() => {
          getTableAction().reload();
          success('删除成功!');
        });
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
            await deleteBatchesAttachment({ ids }).then((res) => {
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

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          // {
          //   label: '编辑',
          //   icon: 'ant-design:edit-outlined',
          //   color: 'warning',
          //   onClick: handleEdit.bind(null, record),
          // },
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
        t,
        selectionChange,
        rowClick,
        createActions,
        tableRef,
        deleteBatches,
        registerTable,
        beforeUpload,
        handleChange,
        handleTabChange,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .attachment-container {
    position: relative;
  }

  #current-btn {
    color: #3785cc;
    border: 1px solid #3785cc;
  }

  .vben-collapse-container__body > .mr-2 {
    margin-top: 5px;
    font-weight: 550 !important;
  }

  /* .upload-progress {
    padding: 20px 30px;
  } */
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
