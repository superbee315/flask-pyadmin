import { BasicColumn } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    editComponentProps: {
      prefix: '$',
    },
    width: 100,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 130,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 150,
  },
  {
    title: 'Url',
    dataIndex: 'url',
    width: 150,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 150,
  },
  {
    title: 'Browser',
    dataIndex: 'browser',
    width: 170,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    width: 150,
  },
];
