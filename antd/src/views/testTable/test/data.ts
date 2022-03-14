import { FormProps, BasicColumn } from '/@/components/Table';
// import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';

const adaptWidth = adapt();

export const columns: BasicColumn[] = [
  {
    title: 'formid',
    dataIndex: 'id',
    editComponentProps: {
      prefix: '$',
    },
    width: 100,
    sorter: true,
  },
  {
    title: '表单名称',
    dataIndex: 'name',
    width: 120,
    sorter: true,
  },
  {
    title: '数据表',
    dataIndex: 'database',
    width: 120,
    sorter: true,
  },
  {
    title: '描述',
    dataIndex: 'desc',
    width: 300,
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
    title: '数据量',
    dataIndex: 'volume',
    width: 100,
  },
];

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `id`,
        label: `formid`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `name`,
        label: `表单名称`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}

// =================popup================================
export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '表单名称',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '表单名称',
    },
    required: true,
  },
  {
    field: 'database',
    component: 'Input',
    label: '数据表',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '数据表',
    },
    required: true,
  },
  {
    field: 'desc',
    component: 'InputTextArea',
    label: '描述',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '描述',
    },
    required: true,
    helpMessage: '显示在表单输入框内作为输入提示',
  },

  {
    field: 'status',
    label: '状态',
    component: 'Switch',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'volumn',
    label: '数据量',
    component: 'Input',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
];
