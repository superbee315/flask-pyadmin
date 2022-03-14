<template>
  <BasicModal width="800px" v-bind="$attrs" @register="register" @ok="confirm" title="字段详情">
    <!-- :dataSource="infoData" -->
    <BasicTable @register="registerTable" rowKey="id" :maxHeight="500" :canResize="true" />
    <template #toolbar>
      <div class="tool-btn-wrap">
        <a-button type="primary" @click="handleAdd"> 添加 </a-button>
      </div>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref  } from 'vue';
  import Popup from './popup.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { info_columns } from './data';
  import { getFormConfig, columns } from './data';
  import { getField, addField } from '/@/api/sys/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, EditRecordRow, TableActionType } from '/@/components/Table';
  import { OpsCreater } from '/@/utils/opsCreater';

  interface PopupData {
    title: string;
  }

  interface Btn {
    disable_btn: boolean;
  }

  export default defineComponent({
    components: { BasicModal, BasicTable, Popup },
    emits: ['register', 'saveData'],
    setup() {
      const reactData = reactive({
        id: null,
      });
      const [registerTable, { reload }] = useTable({
        columns: info_columns,
        api: getField,
        beforeFetch: beforeFetch,
        showIndexColumn: true,
        bordered: true,
      });
      const [addRegister, { openModal: openPopup }] = useModal();
      const [register, { closeModal }] = useModalInner((data) => {
        reactData.id = data.id;

        // 打开弹窗重新加载表格
        reload();
      });

      function confirm() {
        closeModal();
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
        params.filter = JSON.stringify(params.filter);
        params.offset = params.page;
        params.limit = params.pageSize;
        delete params.page;
        delete params.pageSize;

        //通过传入账户id => 获取账户信息
        params.id = reactData.id;
      }


      function handleAdd() {
        popupData.title = '添加字段';
        openPopup(true, {});
      }

      return {
        register,
        registerTable,
        confirm,
        handleAdd,
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    overflow: hidden;
    text-align: center !important;
    // white-space: pre-wrap !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 639px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }
  }
</style>
