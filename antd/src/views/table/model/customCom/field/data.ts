import { FormProps, BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import moment from 'moment';

const adaptWidth = adapt();

export const columns: BasicColumn[] = [
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

// =================popup================================
export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '字段名',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '字段名',
    },
    required: true,
  },
  {
    field: 'type',
    component: 'Input',
    label: '类型',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '类型',
    },
    required: true,
  },
  {
    field: 'title',
    component: 'Input',
    label: '字段别名',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '字段别名',
    },
  },
];
