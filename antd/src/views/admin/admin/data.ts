import { FormProps, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { formatToDate } from '/@/utils/dateUtil';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import UploadImage from '/@/views/general/config/customComponents/UploadImage.vue';

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
    title: '用户名',
    dataIndex: 'username',
    width: 130,
    sorter: true,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 150,
    sorter: true,
  },
  {
    title: '所属组别',
    dataIndex: 'groups',
    width: 350,
    // align: 'left',
    customRender: ({ record }) => {
      const color = ['pink', 'red', 'geekblue', 'volcano', 'cyan', 'yellow', 'blue', 'green'];
      const dom: object[] = [];
      let i = 0;
      record.groups.map((item) => {
        dom.push(
          h(
            Tag,
            { color: color[i], style: { fontSize: '12px', fontWeight: 'bold', margin: '2px 0' } },
            () => item.name
          )
        );
        dom.push(h(() => ' '));
        i++;
      });
      return dom;
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 160,
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
    title: '最后登录',
    dataIndex: 'logintime',
    width: 150,
    sorter: true,
    customRender: ({ record }) => {
      const logintime = record.logintime;
      return formatToDate(logintime * 1000);
    },
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
        field: `username`,
        label: `用户名`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `nickname`,
        label: `昵称`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `email`,
        label: `Email`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `logintime`,
        label: `最后登录`,
        component: 'MyRangerPicker',
        componentProps: {
          placeholder: '最后登录',
          showTime: true,
        },
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
    field: 'groups_value',
    label: '所属组别',
    component: 'MultipleTreeSelect',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'groups',
        value: 'id',
      },
    },
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'avatar',
    component: 'Input',
    label: '头像',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    render: ({ model, field }) => {
      return h(UploadImage, {
        value: model.avatar,
        type: 'image',
        style: { width: '100%' },
        onChange(value) {
          model[field] = value;
        },
      });
    },
  },
  {
    field: 'nickname',
    component: 'Input',
    label: '昵称',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'email',
    component: 'Input',
    label: 'Email',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    rules: [
      {
        validator: async (_, value: any) => {
          const isEmail = (e: string) => {
            return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
              e
            );
          };
          if (!isEmail(value)) {
            return Promise.reject('请填写有效的邮箱');
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
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'loginfailure',
    component: 'Input',
    label: '失败次数',
    labelWidth: adaptWidth.adminLabelWidth,
    defaultValue: 0,
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
];
