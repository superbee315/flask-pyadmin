import { FormProps, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { formatToDate } from '/@/utils/dateUtil';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import CustomInput from './customCom/CustomInput.vue';

const adaptWidth = adapt();

// const isDir = (type: string) => type === '0';
// const isMenu = (type: string) => type === '1';
// const isButton = (type: string) => type === '2';
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    editComponentProps: {
      prefix: '$',
    },
    width: 100,
    sorter: true,
  },
  {
    title: '关联数据表名称',
    dataIndex: 'tablename',
    width: 130,
    sorter: true,
  },
  {
    title: '表单名',
    dataIndex: 'name',
    width: 130,
    sorter: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
    sorter: true,
  },
  {
    title: '字段数',
    dataIndex: 'num',
    width: 150,
    sorter: true,
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
      return h(Tag, { color: color }, text);
    },
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    width: 200,
    sorter: true,
    customRender: ({ record }) => {
      const createtime = record.createtime;
      return formatToDate(createtime * 1000);
    },
  },
];

export const info_columns: BasicColumn[] = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   width: 160,
  // },
  {
    title: '字段名',
    dataIndex: 'name',
    width: 130,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 130,
  },
  {
    title: '字段别名',
    dataIndex: 'title',
    width: 130,
  },
];

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `id`,
        label: `ID`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `name`,
        label: `表单名`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `status`,
        label: `状态`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '启用',
              value: 'normal',
              key: 'status',
            },
            {
              label: '停用',
              value: 'locked',
              key: 'status',
            },
          ],
        },
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
    label: '表单名',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'tablename',
    component: 'Input',
    label: '关联数据表名称',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
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
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'user',
    component: 'Input',
    label: '字段管理',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    render: ({ model, field }) => {
      return h(CustomInput, {
        value: model.user,
        placeholder: '字段管理',
        onChange(value) {
          model[field] = value;
        },
      });
    },
  },
];
