import { h } from 'vue';
import { Tag, Switch } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { Icon } from '/@/components/Icon';
import { adapt } from '/@/utils/adapt';
import { editRule } from '/@/api/sys/user';
import { usePermission } from '/@/hooks/web/usePermission';

const { reloadMenu } = usePermission();
const adaptWidth = adapt();

export const columns: BasicColumn[] = [
  {
    align: 'center',
    width: 70,
  },
  {
    title: 'ID',
    dataIndex: 'id',
    editComponentProps: {
      prefix: '$',
    },
    // align: 'left',
    width: 100,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 160,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '规则',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '菜单',
    dataIndex: 'ismenu',
    width: 80,
    customRender: ({ record }) => {
      let disabled = true;
      if (record.ismenu) {
        disabled = false;
      }
      async function onChange(val) {
        console.log(val, record.id);
        record.ismenu = val;
        const data = { id: record.id, ismenu: val };
        await editRule(data);
        reloadMenu();
      }
      return h(Switch, { checked: record.ismenu, disabled, onChange: onChange });
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '权重',
    dataIndex: 'weigh',
    width: 120,
  },
];

// popup =====================================================
export const schemas: FormSchema[] = [
  {
    field: 'pid',
    label: '父级',
    component: 'TreeSelect',
    defaultValue: 0,
    componentProps: {
      replaceFields: {
        title: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'title',
    component: 'Input',
    label: '标题',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '名称',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (values.ismenu) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'url',
    component: 'Input',
    label: '路径',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (!values.ismenu) {
        return false;
      }
      return true;
    },
  },
  {
    field: 'redirect',
    component: 'Input',
    label: '重定向',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (values.pid || !values.ismenu) {
        return false;
      }
      return true;
    },
    // required: ({ values }) => {
    //   if (values.pid || !values.ismenu) {
    //     return false;
    //   }
    //   return true;
    // },
  },
  {
    field: 'ismenu',
    label: '是否菜单',
    component: 'Switch',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'weigh',
    component: 'InputNumber',
    label: '权重',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 'normal',
    componentProps: {
      options: [
        { label: '启用', value: 'normal' },
        { label: '停用', value: 'locked' },
      ],
    },
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
];
