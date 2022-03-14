<template>
  <CollapseContainer
    class="sys-container"
    title="系统配置"
    :canExpan="false"
    helpMessage="可以在此增改系统的变量和分组,也可以自定义分组和变量"
  >
    <div v-for="(group, index) in groupList" :key="index" style="display: inline-block">
      <a-button
        v-if="group !== 'add'"
        type="default"
        class="mr-2"
        :id="current_index === index ? 'current-btn' : 'static-btn'"
        @click="handleGroupBtn(group, index)"
      >
        {{ group }}
      </a-button>
      <a-button
        v-else
        type="default"
        preIcon="bx:bx-plus-medical"
        :id="current_index === index ? 'current-btn' : 'static-btn'"
        @mouseenter="showTip"
        @mouseleave="hideTip"
        @click="addConfig(index)"
        class="mr-2"
      />
    </div>
    <span v-if="tipShow" class="tip">点击添加新的配置{{ current_index === -1 }}</span>
    <BasicTable ref="tableRef" :canResize="true" v-if="tableShow" @register="registerTable">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" stopButtonPropagation />
      </template>
    </BasicTable>
    <BasicForm
      class="config-form"
      v-if="formShow"
      @register="registerForm"
      @submit="handleFormSubmit"
    />
    <div v-if="tableShow" class="actions">
      <a-button class="mr-2" type="default" @click="handleTableReset">
        {{ t('common.resetText') }}
      </a-button>
      <a-button class="mr-2" type="primary" @click="handleTableSubmit">
        {{ t('common.submitText') }}
      </a-button>
    </div>
  </CollapseContainer>
</template>
<script lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defineComponent, nextTick, reactive, ref, toRefs, unref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { adapt } from '/@/utils/adapt';
  import { validateType } from '/@/utils/validTools';
  import { useAppStore } from '/@/store/modules/app';
  import {
    BasicTable,
    useTable,
    TableAction,
    ActionItem,
    EditRecordRow,
    TableActionType,
  } from '/@/components/Table';
  import {
    getConfigGroup,
    getConfigInfo,
    addConfigInfo,
    editConfigInfo,
    deleteConfigInfo,
  } from '/@/api/sys/general';
  import { columns } from './data';

  export default defineComponent({
    name: 'Config',
    components: { CollapseContainer, BasicTable, BasicForm, TableAction },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const appStore = useAppStore();
      const { success /*, error */ } = createMessage;
      const tableHeight = adapt().tableHeight;
      const state = reactive({
        tipShow: false,
        tableShow: true,
        formShow: false,
        groupList: [] as string[],
        group: 'basic',
        current_index: 0,
      });
      const tableRef = ref<Nullable<TableActionType>>(null);
      const [registerTable] = useTable({
        columns: columns,
        maxHeight: tableHeight,
        api: getConfigInfo,
        afterFetch: afterFetch,
        actionColumn: {
          width: 160,
          // title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        showIndexColumn: false,
        pagination: false,
      });

      const [
        registerForm,
        // { validateFields, clearValidate, getFieldsValue, resetFields, setFieldsValue },
      ] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          span: 24,
        },
        showActionButtonGroup: true,
      });

      function getTableAction() {
        // 获取组件
        const tableAction = unref(tableRef);
        if (!tableAction) {
          throw new Error('tableAction is null');
        }
        return tableAction;
      }

      // 处理请求数据
      function afterFetch(result) {
        let res = result[state.group].list;
        if (state.group === 'basic' && res[0].title === 'Site name') {
          appStore.setAppTitle(res[0].value);
        }
        if (state.group === 'basic' && res[1].title === 'Logo') {
          appStore.setAppLogo(res[1].value);
        }
        console.log(`res`, res);
        return res;
      }
      getGroupList();
      async function getGroupList() {
        const res = await getConfigGroup();
        state.groupList = Object.values(res.group) as any;
        state.groupList.push('add');
      }

      function showTip() {
        state.tipShow = true;
      }

      function hideTip() {
        state.tipShow = false;
      }

      async function handleGroupBtn(group, i) {
        state.tableShow = true;
        state.formShow = false;
        state.current_index = i;
        await nextTick();
        getTableAction().reload();
        state.group = group.toLowerCase();
      }

      function addConfig(i) {
        state.current_index = i;
        state.tableShow = false;
        state.formShow = true;
      }

      function handleTableReset() {
        getTableAction().reload();
      }

      async function handleTableSubmit() {
        const data = getTableAction().getDataSource();
        console.log(`data`, data);
        let flag = true;
        data.map((item) => {
          if (item.rule && item.type !== 'array') {
            const rule = item.rule.split(',');
            const res = validateType(rule, item.value);
            item.errMsg = res.errMsg;
            if (!res.isValid) {
              flag = res.isValid;
            }
          }
        });
        if (flag) {
          const params = {};
          data.map((item) => {
            if (item.type === 'array') {
              params[item.name] = JSON.stringify(item.value);
            } else {
              if (item.type === 'selects' || item.type === 'checkbox') {
                params[item.name] = item.value.toString();
              } else {
                params[item.name] = item.value;
              }
            }
          });
          await editConfigInfo(params).then(() => {
            getTableAction().reload();
            success('修改成功!');
            // 修改了字典配置更新分组
            if (state.group === 'dictionary') {
              getGroupList();
            }
          });
        } else {
          console.log('======未通过校验====');
        }
      }

      async function handleFormSubmit(e) {
        if (!e.rule) {
          e.rule = '';
        } else {
          e.rule = e.rule.toString();
        }
        await addConfigInfo(e).then(() => {
          success('创建成功!');
          handleGroupBtn('Basic', 0); // 跳转显示到table基础配置
        });
      }
      async function handleDelete(record: Recordable) {
        await deleteConfigInfo({ id: record.id }).then(() => {
          getTableAction().reload();
          success('删除成功!');
        });
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (record.id <= 9) {
          return [];
        }
        return [
          {
            label: '',
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
        createActions,
        tableRef,
        registerTable,
        registerForm,
        showTip,
        hideTip,
        handleGroupBtn,
        addConfig,
        handleTableReset,
        handleTableSubmit,
        handleFormSubmit,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .sys-container {
    position: relative;
  }

  ::v-deep .vben-collapse-container__body > .mr-2 {
    margin-top: 5px;
    font-weight: 550 !important;
  }

  .tip {
    position: absolute;
    top: 30px;
    padding: 3px 6px;
    color: #fff;
    background-color: black;
    border-radius: 3px;
  }

  .config-form {
    margin-top: 10px;
  }

  ::v-deep .ant-form-item-children {
    display: flex;
    justify-content: center;
  }

  ::v-deep .upload-btn {
    bottom: 0 !important;
  }

  #current-btn {
    color: #3785cc;
    border: 1px solid #3785cc;
  }
</style>
