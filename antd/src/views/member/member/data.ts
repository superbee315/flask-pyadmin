import { FormProps, BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import { h } from 'vue';
import CustomInput from './customCom/CustomInput.vue';
import CustomInputPassword from './customCom/CustomInputPassword.vue';
import moment from 'moment';
import { Tag } from 'ant-design-vue';

const adaptWidth = adapt();

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
    title: '姓名(名称)',
    dataIndex: 'name',
    width: 150,
    sorter: true,
  },
  {
    title: '会员身份',
    dataIndex: 'type',
    width: 130,
    customRender: ({ record }) => {
      const type = record.type;
      const enable = type === 2;
      const color = enable ? 'green' : 'red';
      const text = enable ? '个人' : '单位';
      return h(Tag, { color: color }, () => text);
    },
    sorter: true,
  },
  {
    title: '职务',
    dataIndex: 'duty',
    width: 130,
    customRender({ record }) {
      const options = ['会长', '副会长', '秘书长', '副秘书长', '理事', '会员'];
      return options[record.duty];
    },
    sorter: true,
  },
  {
    title: '入会时间',
    dataIndex: 'jointime',
    width: 160,
    customRender({ record }) {
      return moment(record.jointime).format('YYYY-MM-DD');
    },
    sorter: true,
  },
  {
    title: '当年会费',
    dataIndex: 'nowdues',
    width: 150,
    customRender({ record }) {
      if (!record.nowdues) {
        return h('span', { style: { color: 'red' } }, '未缴纳');
      }
      return h('span', {}, '已缴纳');
    },
    sorter: true,
  },
  {
    title: '去年会费',
    dataIndex: 'lastdues',
    width: 150,
    customRender({ record }) {
      if (!record.lastdues) {
        return h('span', { style: { color: 'red' } }, '未缴纳');
      }
      return h('span', {}, '已缴纳');
    },
    sorter: true,
  },
  {
    title: '当年参会率',
    dataIndex: 'nowmeeting',
    width: 130,
    customRender({ record }) {
      return h('span', {}, record.nowmeeting + '%');
    },
    sorter: true,
  },
  {
    title: '去年参会率',
    dataIndex: 'lastmeeting',
    width: 130,
    customRender({ record }) {
      return h('span', {}, record.lastmeeting + '%');
    },
    sorter: true,
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
        componentProps: {
          placeholder: 'ID',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `name`,
        label: `姓名(名称)`,
        component: 'Input',
        componentProps: {
          placeholder: '姓名(名称)',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `type`,
        label: `会员身份`,
        component: 'Select',
        componentProps: {
          placeholder: '会员身份',
          options: [
            { label: '个人', value: 2 },
            { label: '单位', value: 1 },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `jointime`,
        label: `入会时间`,
        component: 'MyRangerPicker',
        componentProps: {
          placeholder: '入会时间',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `nowdues`,
        label: `当年会费`,
        component: 'Select',
        componentProps: {
          placeholder: '当年会费',
          options: [
            { label: '未缴纳', value: 0 },
            { label: '已缴纳', value: 1 },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `lastdues`,
        label: `去年会费`,
        component: 'Select',
        componentProps: {
          placeholder: '去年会费',
          options: [
            { label: '未缴纳', value: 0 },
            { label: '已缴纳', value: 1 },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `nowmeeting`,
        label: `当年参会率`,
        component: 'Input',
        componentProps: {
          placeholder: '当年参会率',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `lastmeeting`,
        label: `去年参会率`,
        component: 'Input',
        componentProps: {
          placeholder: '去年参会率',
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
    field: 'type',
    label: '会员身份',
    component: 'RadioButtonGroup',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: () => {
      return {
        options: [
          { label: '个人', value: 2 },
          { label: '单位', value: 1 },
        ],
      };
    },
    defaultValue: 2,
  },
  {
    field: 'duty',
    component: 'Select',
    label: '职务',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '职务',
      options: [
        {
          label: '会长',
          value: 0,
        },
        {
          label: '副会长',
          value: 1,
        },
        {
          label: '秘书长',
          value: 2,
        },
        {
          label: '副秘书长',
          value: 3,
        },
        {
          label: '理事',
          value: 4,
        },
        {
          label: '会员',
          value: 5,
        },
      ],
    },
    required: true,
  },
  {
    field: 'jointime',
    component: 'DatePicker',
    label: '入会时间',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '入会时间',
    },
    required: true,
  },
  {
    field: 'name',
    component: 'Input',
    label: '姓名(名称)',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    render: ({ model, field }) => {
      return h(CustomInput, {
        value: model.name,
        type: model.type,
        placeholder: '添加个人',
        onChange(value) {
          model[field] = value;
          model['username'] = value.name;
        },
      });
    },
    required: true,
  },
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '用户名',
    },
    rules: [
      {
        required: true,
        validator: async (_, value: any) => {
          let dealValue = '';
          if (value) {
            dealValue = value.replace(/\s*/g, '');
          }
          if (dealValue === '') {
            return Promise.reject('请输入用户名');
          }
          if (value.length < 3 || value.lenght > 30) {
            return Promise.reject('用户名：请填写3-12位数字、字母、下划线');
          }
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '123456',
    colProps: {
      span: adaptWidth.elContainer,
    },
    render: ({ model, field }) => {
      return h(CustomInputPassword, {
        value: model.password,
        tip: '初始密码为123456',
        placeholder: '密码',
        onChange(value) {
          model[field] = value;
        },
      });
    },
    required: true,
  },
];
// =================check popup================================
export const checkSchemas: FormSchema[] = [
  {
    field: 'reason',
    component: 'InputTextArea',
    label: '审批信息',
    labelWidth: adaptWidth.adminLabelWidth,
    defaultValue: 0,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'isCheck',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '通过', value: 1 },
        { label: '拒绝', value: 0 },
      ],
    },
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
];
