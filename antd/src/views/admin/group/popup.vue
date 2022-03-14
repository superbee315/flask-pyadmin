<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="register"
    @ok="confirm"
    :title="title"
    :minHeight="500"
  >
    <BasicForm @register="registerForm" :model="model" />
    <!-- <MenuTree /> -->
    <div class="tree-wrap">
      <p class="tree-label">权限</p>
      <a-tree
        v-if="allowRule.length"
        checkable
        :tree-data="allowRule"
        :multiple="true"
        showLine
        defaultExpandAll
        :replace-fields="replaceFields"
        v-model:checkedKeys="rules"
      />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { Tree } from 'ant-design-vue';
  import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import { getAllowRule } from '/@/api/sys/user';

  interface PopupData {
    title: string;
    treeData: object[];
    group_ids: number[];
  }
  interface AllowRule {
    id: number;
  }
  interface ReactData {
    id: number | string;
    allowRule: AllowRule[];
    initRules: number[];
    rules: number[];
    treeData: object[];
  }

  export default defineComponent({
    components: { BasicModal, BasicForm, [Tree.name]: Tree },
    props: {
      popupData: {
        type: Object as PropType<PopupData>,
        default: () => {},
      },
    },
    emits: ['register', 'saveData'],
    setup(props, { emit }) {
      const { createMessage } = useMessage();
      const { error } = createMessage;
      const reactData = reactive<ReactData>({
        id: 0,
        allowRule: [],
        initRules: [],
        rules: [],
        treeData: [],
      });
      const popupData = props.popupData as PopupData;
      const modelRef = ref({});
      const replaceFields = {
        key: 'id',
      };

      const [registerForm, { updateSchema, setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: { span: 24 },
      });
      const [register, { closeModal }] = useModalInner((data) => {
        resetFields();
        if (data.id) {
          reactData.id = data.id;
        } else {
          reactData.id = 0;
          reactData.rules = [];
        }
        getRuleTree(data.pid);
        if (data.rules) {
          reactData.initRules = data.rules.split(','); // 编辑 的rules
          reactData.initRules = reactData.initRules.map((item) => parseInt(item));
        }

        setFieldsValue(data);
        formatTreeData(popupData.treeData); // 禁止选取自己或自己下级为父id
        updateSchema({
          field: 'pid',
          componentProps: {
            onChange: (e: ChangeEvent) => {
              getRuleTree(e);
            },
            treeData: popupData.treeData,
          },
        });
      });

      function formatChildren(child) {
        child.map((item) => {
          item.selectable = false;
          if (item.children) {
            formatChildren(item.children);
          }
        });
      }

      // 添加不可选
      function formatTreeData(tree) {
        tree.map((item) => {
          if (item.children) {
            formatTreeData(item.children);
          }
          if (item.id === reactData.id) {
            item.selectable = false;
            if (item.children) {
              formatChildren(item.children);
            }
          } else {
            item.selectable = true;
          }
        });
      }

      // 设置选中的rule key
      function setTreeCheckedRule(allowRule) {
        allowRule.map((item) => {
          if (reactData.initRules.includes(item.id)) {
            reactData.rules.push(item.id);
          }
          if (item.children) {
            setTreeCheckedRule(item.children);
          }
        });
      }

      async function getRuleTree(id) {
        if (!id) {
          // 没有id => 添加 => 默认通过当前用户的第一个角色组id请求权限树
          id = popupData.group_ids[0];
          // 添加 => 清除所有选中
          reactData.initRules = [];
        }
        await getAllowRule({ id }).then((res) => {
          reactData.allowRule = res.tree as AllowRule[];
          reactData.rules = [];
          setTreeCheckedRule(reactData.allowRule);
        });
      }

      async function confirm() {
        try {
          const data = await validate();
          data.rules = [...reactData.rules];
          if (reactData.id) {
            data.id = reactData.id;
          }
          const childData = { closeModal, data };
          emit('saveData', childData);
        } catch (err: any) {
          error(err.errorFields[0].errors[0]);
        }
      }
      return {
        register,
        schemas,
        registerForm,
        replaceFields,
        model: modelRef,
        confirm,
        ...toRefs(popupData),
        ...toRefs(reactData),
      };
    },
  });
</script>
<style lang="less">
  .ant-form-item-label {
    text-align: center !important;
  }

  .tree-wrap {
    display: flex;
  }

  .tree-label {
    width: 13.5%;
    margin-top: 8px;
    margin-bottom: 1em;
    text-align: center;
  }

  @media (max-width: 639px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }

    .tree-label {
      width: 24%;
      margin-top: 8px;
      margin-bottom: 1em;
      text-align: center;
    }
  }
  @media (max-width: 360px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }
    .tree-label {
      width: 40%;
      margin-top: 8px;
      margin-bottom: 1em;
      text-align: center;
    }
    .ant-tree li .ant-tree-node-content-wrapper {
      font-size: 13px;
    }
  }
  @media (max-width: 340px) {
    .ant-form-item-label {
      line-height: 2.5715 !important;
      text-align: center !important;
    }
    .tree-label {
      width: 40%;
      margin-top: 8px;
      margin-bottom: 1em;
      text-align: center;
    }
    .ant-tree li ul {
      padding: 0 0 0 8px !important;
    }
    .ant-tree li .ant-tree-node-content-wrapper {
      font-size: 12px;
    }
    .ant-tree li .ant-tree-node-content-wrapper {
      padding: 0;
    }
  }
</style>
