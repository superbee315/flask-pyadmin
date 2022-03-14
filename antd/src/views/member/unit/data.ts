import { FormProps, BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { adapt } from '/@/utils/adapt';
import { h } from 'vue';
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
    title: '企业(单位)名称',
    dataIndex: 'name',
    width: 200,
    sorter: true,
    customRender({ record }) {
      const dom: object[] = [];
      dom.push(h('span', {}, record.name));
      if (record.nature === 0) {
        dom.push(h('span', { style: { fontSize: '18px', fontWeight: 'bold', color: 'red' } }, '★'));
      }
      return dom;
    },
  },
  {
    title: '法人代表',
    dataIndex: 'legalman',
    width: 130,
    sorter: true,
  },
  {
    title: '成立时间',
    dataIndex: 'foundingtime',
    width: 150,
    customRender({ record }) {
      return moment(record.foundingtime).format('YYYY-MM-DD');
    },
    sorter: true,
  },
  {
    title: '工商登记号',
    dataIndex: 'businessNo',
    width: 350,
    sorter: true,
  },
  {
    title: '单位性质',
    dataIndex: 'nature',
    width: 160,
    customRender: ({ record }) => {
      const options = [
        '机关事业单位',
        '国有企业',
        '集体所有制',
        '私营企业',
        '股份制企业',
        '有限合伙企业',
        '联营企业',
        '外商投资企业',
        '个人独资企业',
      ];
      return options[record.nature];
    },
    sorter: true,
  },
  {
    title: '行业分类',
    dataIndex: 'job',
    width: 160,
    sorter: true,
  },
  {
    title: '注册资金',
    dataIndex: 'regMoney',
    width: 160,
    sorter: true,
  },
  {
    title: '职工人数',
    dataIndex: 'jobnum',
    width: 160,
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
        label: `企业(单位)名称`,
        component: 'Input',
        componentProps: {
          placeholder: '企业或单位名称',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `legalman`,
        label: `法人代表`,
        component: 'Input',
        componentProps: {
          placeholder: '法人代表',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `foundingtime`,
        label: `成立时间`,
        component: 'MyRangerPicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `businessNo`,
        label: `工商登记号`,
        component: 'Input',
        componentProps: {
          placeholder: '工商登记号',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `nature`,
        label: `单位性质`,
        component: 'Select',
        componentProps: {
          placeholder: '单位性质',
          options: [
            {
              label: '机关事业单位',
              value: 0,
            },
            {
              label: '国有企业',
              value: 1,
            },
            {
              label: '集体所有制',
              value: 2,
            },
            {
              label: '私营企业',
              value: 3,
            },
            {
              label: '股份制企业',
              value: 4,
            },
            {
              label: '有限合伙企业',
              value: 5,
            },
            {
              label: '联营企业',
              value: 6,
            },
            {
              label: '外商投资企业',
              value: 7,
            },
            {
              label: '个人独资企业',
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
        field: `job`,
        label: `行业分类`,
        component: 'Input',
        componentProps: {
          placeholder: '行业分类',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `regMoney`,
        label: `注册资金`,
        component: 'RangeNumber',
        componentProps: {
          placeholder: '注册资金',
        },
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
      {
        field: `jobnum`,
        label: `职工人数`,
        component: 'RangeNumber',
        componentProps: {
          placeholder: '职工人数',
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
    label: '企业名称',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '企业名称',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '单位名称',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '单位名称',
    },
    show: ({ values }) => {
      if (values.nature === 0) {
        return true;
      }
      return false;
    },
    required: ({ values }) => {
      if (values.nature === 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'nature',
    label: '单位性质',
    component: 'Select',
    componentProps: {
      placeholder: '单位性质',
      options: [
        {
          label: '机关事业单位',
          value: 0,
        },
        {
          label: '国有企业',
          value: 1,
        },
        {
          label: '集体所有制',
          value: 2,
        },
        {
          label: '私营企业',
          value: 3,
        },
        {
          label: '股份制企业',
          value: 4,
        },
        {
          label: '有限合伙企业',
          value: 5,
        },
        {
          label: '联营企业',
          value: 6,
        },
        {
          label: '外商投资企业',
          value: 7,
        },
        {
          label: '个人独资企业',
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
    field: 'legalman',
    component: 'Input',
    label: '法人代表',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '法人代表',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            let dealValue = '';
            if (value) {
              dealValue = value.replace(/\s*/g, '');
            }
            if (values.nature && dealValue === '') {
              return Promise.reject('请输入法人代表');
            }
          },
          trigger: 'blur',
        },
      ];
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'level',
    component: 'Input',
    label: '行政级别',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '行政级别',
    },
    show: ({ values }) => {
      if (values.nature === 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'area',
    component: 'Input',
    label: '所属地区',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '所属地区',
    },
    show: ({ values }) => {
      if (values.nature === 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'parent',
    component: 'Input',
    label: '上级单位',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '上级单位',
    },
    show: ({ values }) => {
      if (values.nature === 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'businessNo',
    component: 'Input',
    label: '工商登记号',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '工商登记号',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            let dealValue = '';
            if (value) {
              dealValue = value.replace(/\s*/g, '');
            }
            if (values.nature && dealValue === '') {
              return Promise.reject('请输入工商登记号');
            }
          },
          trigger: 'blur',
        },
      ];
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'centralTax',
    component: 'Input',
    label: '国税税号',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '国税税号',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'landTax',
    component: 'Input',
    label: '地税税号',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '地税税号',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'foundingtime',
    component: 'DatePicker',
    label: '成立时间',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '成立时间',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'job',
    component: 'Input',
    label: '行业分类',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '行业分类',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            let dealValue = '';
            if (value) {
              dealValue = value.replace(/\s*/g, '');
            }
            if (values.nature && dealValue === '') {
              return Promise.reject('请输入行业分类');
            }
          },
          trigger: 'blur',
        },
      ];
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'jobnum',
    component: 'Input',
    label: '职工人数',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '职工人数',
    },
  },
  {
    field: 'partynum',
    component: 'Input',
    label: '党员数',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '党员数',
    },
  },
  {
    field: 'tel',
    component: 'Input',
    label: '电话',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '电话',
    },
  },
  {
    field: 'fax',
    component: 'Input',
    label: '传真',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '传真',
    },
  },
  {
    field: 'zipcode',
    component: 'Input',
    label: '邮编',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '邮箱',
    },
  },
  {
    field: 'address',
    component: 'Input',
    label: '地址',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '地址',
    },
    required: true,
  },
  {
    field: 'culturalnum',
    component: 'Input',
    label: '大专以上文化人数',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '大专以上文化人数',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'laidnum',
    component: 'Input',
    label: '安置下岗人数',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '安置下岗人数',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'partyCase',
    component: 'Input',
    label: '党、团工会情况',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '党、团工会情况',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'web',
    component: 'Input',
    label: '网址',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '网址',
    },
    rules: [
      {
        validator: async (_, value: any) => {
          const regex =
            /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
          if (value && !regex.test(value)) {
            return Promise.reject('请填写有效的网址');
          }
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'email',
    component: 'Input',
    label: '电子邮箱',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '电子邮箱',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'technology',
    label: '高新技术企业认证',
    component: 'Switch',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '高新技术企业认证',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'technologyDept',
    component: 'Input',
    label: '高新技术企业认证部门',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (values.technology && values.nature !== 0) {
        return true;
      }
      return false;
    },
    componentProps: {
      placeholder: '高新技术企业认证部门',
    },
    required: ({ values }) => {
      if (values.technology && values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'foreignTrade',
    label: '外贸自营进出口权',
    component: 'Switch',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '外贸自营进出口权',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'foreignTradeDept',
    component: 'Input',
    label: '外贸自营进出口权批准部门',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (values.foreignTrade && values.nature !== 0) {
        return true;
      }
      return false;
    },
    componentProps: {
      placeholder: '外贸自营进出口权批准部门',
    },
    required: ({ values }) => {
      if (values.foreignTrade && values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'quality',
    label: '质量管理、质量保证系列认证标准',
    component: 'Switch',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '质量管理、质量保证系列认证标准',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'qualityDept',
    component: 'Input',
    label: '质量管理、质量保证系列认证标准认证部门',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    show: ({ values }) => {
      if (values.quality && values.nature !== 0) {
        return true;
      }
      return false;
    },
    componentProps: {
      placeholder: '质量管理、质量保证系列认证标准认证部门',
    },
    required: ({ values }) => {
      if (values.quality && values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'regMoney',
    component: 'Input',
    label: '注册资金(万元)',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '注册资金(万元)',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            let dealValue = '';
            if (value) {
              dealValue = value.replace(/\s*/g, '');
            }
            if (values.nature && dealValue === '') {
              return Promise.reject('请输入注册资金');
            }
            if (values.nature && value < 0) {
              return Promise.reject('注册资金不能小于0');
            }
          },
          trigger: 'blur',
        },
      ];
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'money',
    component: 'Input',
    label: '资产(万元)',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '资产(万元)',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'ownerMoney',
    component: 'Input',
    label: '所有者权益(万元)',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '所有者权益(万元)',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'sellMoney',
    component: 'Input',
    label: '销售收入(万元)',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      type: 'number',
      placeholder: '销售收入(万元)',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'product',
    component: 'InputTextArea',
    label: '主要经营项目',
    labelWidth: adaptWidth.labelWidth,
    colProps: {
      span: adaptWidth.elContainer,
    },
    componentProps: {
      placeholder: '主要经营项目',
    },
    show: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: async (_, value: any) => {
            let dealValue = '';
            if (value) {
              dealValue = value.replace(/\s*/g, '');
            }
            if (values.nature && dealValue === '') {
              return Promise.reject('请输入主要经营项目');
            }
          },
          trigger: 'blur',
        },
      ];
    },
    required: ({ values }) => {
      if (values.nature !== 0) {
        return true;
      }
      return false;
    },
  },
];
