import { FormProps, BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import moment from 'moment';

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
    title: '姓名',
    dataIndex: 'name',
    width: 130,
    sorter: true,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 130,
    customRender({ record }) {
      const options = ['男', '女'];
      return options[record.gender];
    },
    sorter: true,
  },
  {
    title: '籍贯',
    dataIndex: 'origin',
    width: 150,
    sorter: true,
  },
  {
    title: '出生年月',
    dataIndex: 'birthday',
    width: 200,
    customRender({ record }) {
      return moment(record.birthday).format('YYYY-MM-DD');
    },
    sorter: true,
  },
  {
    title: '党派',
    dataIndex: 'party',
    width: 150,
    customRender({ record }) {
      const options = ['无', '民革', '民盟', '民建', '民进', '农工', '致公党', '九三学社', '台盟'];
      return options[record.party];
    },
    sorter: true,
  },
  {
    title: '民族',
    dataIndex: 'nation',
    width: 160,
    sorter: true,
  },
  {
    title: '单位',
    dataIndex: 'company',
    width: 160,
    sorter: true,
  },
  {
    title: '人大职务',
    dataIndex: 'peopleJob',
    width: 160,
    sorter: true,
  },
  {
    title: '政协职务',
    dataIndex: 'cppccJob',
    width: 160,
    sorter: true,
  },
  {
    title: '社会职务',
    dataIndex: 'job',
    width: 160,
    sorter: true,
  },
  {
    title: '联系方式',
    dataIndex: 'mobile',
    width: 160,
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
        label: `姓名`,
        component: 'Input',
        componentProps: {
          placeholder: '姓名',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `gender`,
        label: `性别`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '男',
              value: 0,
            },
            {
              label: '女',
              value: 1,
            },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `origin`,
        label: `籍贯`,
        component: 'Input',
        componentProps: {
          placeholder: '籍贯',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `birthday`,
        label: `出生年月`,
        component: 'MyRangerPicker',
        componentProps: {
          placeholder: '出生年月',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `party`,
        label: `党派`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '无',
              value: 0,
            },
            {
              label: '民革',
              value: 1,
            },
            {
              label: '民盟',
              value: 2,
            },
            {
              label: '民建',
              value: 3,
            },
            {
              label: '民进',
              value: 4,
            },
            {
              label: '农工',
              value: 5,
            },
            {
              label: '致公党',
              value: 6,
            },
            {
              label: '九三学社',
              value: 7,
            },
            {
              label: '台盟',
              value: 8,
            },
          ],
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `nation`,
        label: `民族`,
        component: 'Input',
        componentProps: {
          placeholder: '名族',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `company`,
        label: `单位`,
        component: 'Input',
        componentProps: {
          placeholder: '单位',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `peopleJob`,
        label: `人大职务`,
        component: 'Input',
        componentProps: {
          placeholder: '人大职务',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `cppccJob`,
        label: `政协职务`,
        component: 'Input',
        componentProps: {
          placeholder: '政协职务',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `job`,
        label: `社会职务`,
        component: 'Input',
        componentProps: {
          placeholder: '社会职务',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `mobile`,
        label: `联系方式`,
        component: 'Input',
        componentProps: {
          placeholder: '联系方式',
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
    label: '姓名',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '姓名',
    },
    required: true,
  },
  {
    field: 'gender',
    component: 'Select',
    label: '性别',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '性别',
      options: [
        {
          label: '男',
          value: 0,
        },
        {
          label: '女',
          value: 1,
        },
      ],
    },
    required: true,
  },
  {
    field: 'birthday',
    component: 'DatePicker',
    label: '出生年月',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '出生年月',
    },
    required: true,
  },
  {
    field: 'origin',
    component: 'Input',
    label: '籍贯',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '籍贯',
    },
    required: true,
  },
  {
    field: 'birthplace',
    component: 'Input',
    label: '出生地',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '出生地',
    },
    // required: true,
  },
  {
    field: 'cardNo',
    component: 'Input',
    label: '身份证号码',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '身份证号码',
    },
    // required: true,
  },
  {
    field: 'nation',
    component: 'Input',
    label: '民族',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '民族',
    },
    required: true,
  },
  {
    field: 'party',
    label: '党派',
    component: 'Select',
    componentProps: {
      placeholder: '党派',
      options: [
        {
          label: '无',
          value: 0,
        },
        {
          label: '民革',
          value: 1,
        },
        {
          label: '民盟',
          value: 2,
        },
        {
          label: '民建',
          value: 3,
        },
        {
          label: '民进',
          value: 4,
        },
        {
          label: '农工',
          value: 5,
        },
        {
          label: '致公党',
          value: 6,
        },
        {
          label: '九三学社',
          value: 7,
        },
        {
          label: '台盟',
          value: 8,
        },
      ],
    },
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    required: true,
  },
  {
    field: 'edu',
    component: 'Input',
    label: '学历',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '学历',
    },
    //     required: true,
  },
  {
    field: 'title',
    component: 'Input',
    label: '职称',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '职称',
    },
  },
  {
    field: 'job',
    component: 'Input',
    label: '职务',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '职务',
    },
    //     required: true,
  },
  {
    field: 'address',
    component: 'Input',
    label: '地址',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '地址',
    },
    //     required: true,
  },
  {
    field: 'zipcode',
    component: 'Input',
    label: '邮编',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '邮编',
    },
  },
  {
    field: 'tel',
    component: 'Input',
    label: '电话',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '电话',
    },
  },
  {
    field: 'mobile',
    component: 'Input',
    label: '手机',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '手机',
    },
    // required: true,
  },
  {
    field: 'old',
    component: 'Input',
    label: '办企业前工作单位',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '办企业前工作单位',
    },
  },
  {
    field: 'peopleJob',
    component: 'Input',
    label: '人大职务',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '人大职务',
    },
  },
  {
    field: 'cppccJob',
    component: 'Input',
    label: '政协职务',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '政协职务',
    },
  },
  {
    field: 'family',
    component: 'FamilyArrCom',
    label: '家庭主要成员',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    defaultValue: [],
    componentProps: ({ formModel }) => {
      return {
        placeholder: '家庭主要成员',
        value: formModel.family,
        onChange: () => {},
      };
    },
    // required: true,
  },
  {
    field: 'info',
    component: 'InputTextArea',
    label: '本人简历',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '本人简历',
    },
  },
  {
    field: 'company',
    component: 'Input',
    label: '所在单位',
    labelWidth: adaptWidth.labelWidth,
    defaultValue: '',
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '所在单位',
    },
    required: true,
  },
];
