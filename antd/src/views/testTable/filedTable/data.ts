import { FormProps, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';

const adaptWidth = adapt();

export const columns: BasicColumn[] = [
  {
    title: '排序',
    dataIndex: 'order',
    editComponentProps: {
      prefix: '$',
    },
    width: 100,
    sorter: true,
  },
  {
    title: '字段名',
    dataIndex: 'name',
    width: 120,
    sorter: true,
  },
  {
    title: '别名',
    dataIndex: 'title',
    width: 120,
    sorter: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    customRender({ record }) {
      const options = [
        {
          value: 'Input',
          label: '单行文本',
        },
        {
          value: 'InputTextArea',
          label: '多行文本',
        },
        {
          value: 'Editor',
          label: '编辑器',
        },
        {
          value: 'Pic',
          label: '图片',
        },
        {
          value: 'Pics',
          label: '多图片',
        },
        {
          value: 'Number',
          label: '数字',
        },
        {
          value: 'DatePicker',
          label: '日期和时间',
        },
        {
          value: 'author',
          label: '作者',
        },
        {
          value: 'Member',
          label: '会员组',
        },
        {
          value: 'Menu',
          label: '联动菜单',
        },
        {
          value: 'download',
          label: '镜像下载',
        },
        {
          value: 'upload',
          label: '多文件上传',
        },
        {
          value: 'map',
          label: '地图字段',
        },
        {
          value: 'universal',
          label: '万能字段',
        },
        {
          value: 'Video',
          label: '视频库',
        },
      ];
      let type = '';
      options.map((item) => {
        if (item.value === record.type) {
          type = item.label;
        }
      });
      return type;
    },
  },
  {
    title: '系统',
    dataIndex: 'system',
    width: 80,
    customRender: ({ record }) => {
      const status = record.system;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '必填',
    dataIndex: 'require',
    width: 80,
    customRender: ({ record }) => {
      const status = record.require;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '搜索',
    dataIndex: 'search',
    width: 80,
    customRender: ({ record }) => {
      const status = record.search;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '排序',
    dataIndex: 'ableOrder',
    width: 80,
    customRender: ({ record }) => {
      const status = record.ableOrder;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '投稿',
    dataIndex: 'contribution',
    width: 80,
    customRender: ({ record }) => {
      const status = record.contribution;
      const enable = status === 'normal';
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '禁用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        label: `字段名`,
        component: 'Input',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `type`,
        label: `类型`,
        component: 'Select',
        componentProps: {
          placeholder: '请选择类型',
          options: [
            {
              value: 'Input',
              label: '单行文本',
            },
            {
              value: 'InputTextArea',
              label: '多行文本',
            },
            {
              value: 'Editor',
              label: '编辑器',
            },
            {
              value: 'Pic',
              label: '图片',
            },
            {
              value: 'Pics',
              label: '多图片',
            },
            {
              value: 'Number',
              label: '数字',
            },
            {
              value: 'DatePicker',
              label: '日期和时间',
            },
            {
              value: 'author',
              label: '作者',
            },
            {
              value: 'Member',
              label: '会员组',
            },
            {
              value: 'Menu',
              label: '联动菜单',
            },
            {
              value: 'download',
              label: '镜像下载',
            },
            {
              value: 'upload',
              label: '多文件上传',
            },
            {
              value: 'map',
              label: '地图字段',
            },
            {
              value: 'universal',
              label: '万能字段',
            },
            {
              value: 'video',
              label: '视频库',
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
    field: 'type',
    label: '字段类型',
    component: 'Select',
    componentProps: {
      placeholder: '字段类型',
      options: [
        {
          value: 'Input',
          label: '单行文本',
        },
        {
          value: 'InputTextArea',
          label: '多行文本',
        },
        {
          value: 'Editor',
          label: '编辑器',
        },
        {
          value: 'Pic',
          label: '图片',
        },
        {
          value: 'Pics',
          label: '多图片',
        },
        {
          value: 'Number',
          label: '数字',
        },
        {
          value: 'DatePicker',
          label: '日期和时间',
        },
        {
          value: 'author',
          label: '作者',
        },
        {
          value: 'Member',
          label: '会员组',
        },
        {
          value: 'Menu',
          label: '联动菜单',
        },
        {
          value: 'download',
          label: '镜像下载',
        },
        {
          value: 'upload',
          label: '多文件上传',
        },
        {
          value: 'map',
          label: '地图字段',
        },
        {
          value: 'universal',
          label: '万能字段',
        },
        {
          value: 'video',
          label: '视频库',
        },
      ],
    },
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'isMain',
    label: '作为主表字段',
    component: 'Switch',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '字段名',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '字段名',
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            if (!(value && value.trim())) {
              return Promise.reject('请输入字段名');
            }

            const reg = /^(?!.*?_$)^[a-zA-Z][a-zA-Z0-9_]*$/;
            if (!reg.test(value)) {
              return Promise.reject(
                '只能由英文字母、数字和下划线组成，并且仅能字母开头，不以下划线结尾'
              );
            }
          },
          trigger: 'blur',
        },
      ];
    },
    helpMessage: '只能由英文字母、数字和下划线组成，并且仅能字母开头，不以下划线结尾',
  },
  {
    field: 'title',
    component: 'Input',
    label: '字段别名',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '字段别名',
    },
    required: true,
    helpMessage: '例如:文章标题',
  },
  {
    field: 'placeholder',
    component: 'Input',
    label: '字段提示',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '字段提示',
    },
    required: true,
    helpMessage: '显示在表单输入框内作为输入提示',
  },

  {
    field: 'unique',
    label: '值唯一',
    component: 'Switch',
    labelWidth: adaptWidth.adminLabelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
  },
];
