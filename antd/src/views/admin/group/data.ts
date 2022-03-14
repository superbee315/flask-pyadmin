import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';

const adaptWidth = adapt();

export const columns: BasicColumn[] = [
  {
    align: 'center',
    width: 70,
  },
  {
    title: 'ID',
    dataIndex: 'id',
    // align: 'left',
    editComponentProps: {
      prefix: '$',
    },
    width: 100,
  },
  {
    title: '父级',
    dataIndex: 'pid',
    width: 160,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 160,
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
];

// popup =====================================================
export const schemas: FormSchema[] = [
  {
    field: 'pid',
    label: '父级',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '名称',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  //   {
  //     field: 'rules',
  //     component: 'Input',
  //     label: '规则',
  //     labelWidth: adaptWidth.adminLabelWidth,
  //     colProps: {
  //       span: adaptWidth.elContainer,
  //     },
  //   },
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
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
];
