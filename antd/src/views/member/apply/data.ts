import { FormProps, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { DescItem } from '/@/components/Description/index';
import moment from 'moment';

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
    title: '申请成员',
    dataIndex: 'name',
    width: 160,
    sorter: true,
  },
  {
    title: '审批信息',
    dataIndex: 'reason',
    width: 220,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const color = status ? 'green' : 'red';
      const text = status ? '通过' : '未通过';
      return h(Tag, { color: color }, () => text);
    },
    sorter: true,
  },
  {
    title: '审批时间',
    dataIndex: 'createtime',
    width: 150,
    customRender({ record }) {
      return moment(record.createtime * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
    sorter: true,
  },
];

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 110,
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
        label: `申请成员`,
        component: 'Input',
        componentProps: {
          placeholder: '申请成员',
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
              label: '通过',
              value: 1,
              key: 'status',
            },
            {
              label: '未通过',
              value: 0,
              key: 'status',
            },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `createtime`,
        label: `审批日期`,
        component: 'MyRangerPicker',
        componentProps: {
          // showTime: true,
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
export const schemas: DescItem[] = [
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'name',
    label: '申请成员',
  },
  {
    field: 'createtime',
    label: '审批时间',
    render: (_, data) => {
      return moment(data.createtime * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    field: 'status',
    label: '审批结果',
    render: (_, data) => {
      return data.status ? '通过' : '未通过';
    },
  },
  {
    field: 'reason',
    label: '审批信息',
  },
];
