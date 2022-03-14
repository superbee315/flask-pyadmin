import { FormProps, BasicColumn } from '/@/components/Table';
import Image from './customComponents/Image.vue';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { formatSize } from '/@/utils/foramtFileSize';
import moment from 'moment';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    align: 'center',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '预览',
    align: 'center',
    dataIndex: 'preview',
    width: 100,
    customRender: ({ record }) => {
      return h(Image, {
        src: record.url,
        height: '80px',
      });
    },
  },
  {
    title: '物理路径',
    align: 'center',
    dataIndex: 'url',
    width: 480,
    customRender: ({ record }) => {
      return h(
        Tag,
        {
          color: '#18bc9c',
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            margin: '0 auto',
          },
        },
        () => record.url
      );
    },
  },
  {
    title: '宽度',
    align: 'center',
    dataIndex: 'imagewidth',
    width: 100,
  },
  {
    title: '高度',
    align: 'center',
    dataIndex: 'imageheight',
    width: 100,
  },
  {
    title: '文件类型',
    align: 'center',
    dataIndex: 'imagetype',
    width: 100,
  },
  {
    title: '储存引擎',
    align: 'center',
    dataIndex: 'storage',
    width: 100,
  },
  {
    title: '文件大小',
    align: 'center',
    dataIndex: 'filesize',
    width: 100,
    customRender: ({ text = 0 }) => {
      return formatSize(text);
    },
  },
  {
    title: 'Mime类型',
    align: 'center',
    dataIndex: 'mimetype',
    width: 100,
  },
  {
    title: '创建日期',
    align: 'center',
    dataIndex: 'createtime',
    width: 160,
    customRender({ record }) {
      if (!record.createtime) {
        return null;
      }
      return moment(record.createtime * 1000).format('YYYY-MM-DD HH:mm:ss');
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
        componentProps: {
          placeholder: 'ID',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `imagetype`,
        label: `文件类型`,
        component: 'Input',
        componentProps: {
          placeholder: '文件类型',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `createtime`,
        label: `创建日期`,
        component: 'MyRangerPicker',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}
