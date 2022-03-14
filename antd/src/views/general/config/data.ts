import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { h } from 'vue';
import moment from 'moment';
import Input from './customComponents/Input.vue';
import InputTextArea from './customComponents/InputTextArea.vue';
import InputNumber from './customComponents/InputNumber.vue';
import ArrayCom from './customComponents/ArrayCom.vue';
import Select from './customComponents/Select.vue';
import MultipleSelect from './customComponents/MultipleSelect.vue';
import Checkbox from './customComponents/Checkbox.vue';
import Radio from './customComponents/Radio.vue';
import DatePicker from './customComponents/DatePicker.vue';
import TimePicker from './customComponents/TimePicker.vue';
import Switch from './customComponents/Switch.vue';
import UploadImage from './customComponents/UploadImage.vue';
import UploadFile from './customComponents/UploadFile.vue';
import { configNameExist } from '/@/api/sys/general';
import { getConfigGroup } from '/@/api/sys/general';
import { Tinymce } from '/@/components/Tinymce/index';

export const columns: BasicColumn[] = [
  {
    title: '变量标题',
    align: 'left',
    dataIndex: 'title',
    width: 100,
  },
  {
    title: '变量值',
    align: 'left',
    dataIndex: 'value',
    width: 550,
    customRender: ({ record }) => {
      switch (record.type) {
        case 'string':
          const onchange = (val) => {
            record.value = val;
            console.log(`record`, record);
          };
          return h(Input, {
            value: record.value,
            tip: record.tip,
            errMsg: record.errMsg || '',
            rules: record.rule.split(',') || [],
            style: { width: '100%' },
            onChange: onchange,
          });
        case 'number':
          const onNumberChange = (val) => {
            record.value = val;
          };
          return h(InputNumber, {
            value: record.value,
            tip: record.tip,
            errMsg: record.errMsg || '',
            rules: record.rule.split(',') || [],
            style: { width: '100%' },
            onChange: onNumberChange,
          });
        case 'select':
          const onSelectChange = (val) => {
            record.value = val;
          };
          // const options: any[] = [];
          // record.content.map((item, i) => {
          //   options.push({ label: item, value: i });
          // });

          return h(Select, {
            value: record.value,
            options: record.content,
            tip: record.tip,
            mode: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
            placeholder: '没有选中任何项',
            onChange: onSelectChange,
          });
        case 'selects':
          const onMultipleChange = (val) => {
            record.value = val;
          };
          return h(MultipleSelect, {
            value: record.value,
            options: record.content,
            tip: record.tip,
            placeholder: '没有选中任何项',
            onChange: onMultipleChange,
          });
        case 'date':
          const onDatePickerChange = (val) => {
            record.value = val;
          };
          if (record.value !== '') {
            record.value = moment(record.value).format('YYYY-MM-DD');
          }
          return h(DatePicker, {
            placeholder: '没有选择日期',
            value: record.value,
            tip: record.tip,
            onChange: onDatePickerChange,
          });
        case 'time':
          const onTimePickerChange = (val) => {
            console.log(`val`, val);
            record.value = val;
          };
          return h(TimePicker, {
            placeholder: '没有选择时间',
            value: record.value,
            tip: record.tip,
            onChange: onTimePickerChange,
          });
        case 'text':
          const onTextAreaChange = (val) => {
            record.value = val;
          };
          return h(InputTextArea, {
            value: record.value,
            tip: record.tip,
            errMsg: record.errMsg || '',
            rules: record.rules || [],
            style: { width: '100%' },
            onChange: onTextAreaChange,
          });
        case 'switch':
          const onSwitchChange = (val) => {
            record.value = val;
          };
          return h(Switch, {
            checked: record.value,
            tip: record.tip,
            onChange: onSwitchChange,
          });
        case 'checkbox':
          const onCheckboxChange = (val) => {
            record.value = val;
          };
          return h(Checkbox, {
            value: record.value,
            options: record.content,
            tip: record.tip,
            onChange: onCheckboxChange,
          });
        case 'radio':
          const onRadioChange = (val) => {
            record.value = val;
          };
          return h(Radio, {
            value: record.value,
            options: record.content,
            tip: record.tip,
            onChange: onRadioChange,
          });
        case 'editor':
          const onEditorChange = (val) => {
            record.value = val;
          };
          return h(Tinymce, {
            value: record.value,
            onChange: onEditorChange,
          });
        case 'array':
          const onArrayChange = (val) => {
            record.value = val;
          };
          return h(ArrayCom, {
            value: record.value,
            // options: record.content,
            // style: { width: '65%' },
            onChange: onArrayChange,
          });
        case 'image':
          const onImageChange = (val) => {
            record.value = val;
          };
          return h(UploadImage, {
            value: record.value,
            type: 'image',
            tip: record.tip,
            options: record.content,
            style: { width: '65%' },
            onChange: onImageChange,
          });
        case 'images':
          const onImagesChange = (val) => {
            console.log(`imgs获取到的参数 =======》`, val);
            record.value = val;
          };
          return h(UploadImage, {
            value: record.value,
            type: 'images',
            tip: record.tip,
            options: record.content,
            style: { width: '65%' },
            onChange: onImagesChange,
          });
        case 'file':
          const onFileChange = (val) => {
            record.value = val;
          };
          return h(UploadFile, {
            value: record.value,
            type: 'file',
            tip: record.tip,
            options: record.content,
            style: { width: '65%' },
            onChange: onFileChange,
          });
        case 'files':
          const onFilesChange = (val) => {
            record.value = val;
          };
          return h(UploadFile, {
            value: record.value,
            type: 'files',
            tip: record.tip,
            options: record.content,
            style: { width: '65%' },
            onChange: onFilesChange,
          });
        case 'custom':
          return h('p', {}, record.value);
      }
    },
  },
  {
    title: '变量名',
    align: 'left',
    dataIndex: 'name',
    width: 120,
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'type',
    component: 'Select',
    label: '类型',
    colProps: {
      span: 20,
    },
    defaultValue: 'string',
    componentProps: {
      options: [
        {
          label: '字符',
          value: 'string',
        },
        {
          label: '文本',
          value: 'text',
        },
        {
          label: '编辑器',
          value: 'editor',
        },
        {
          label: '数字',
          value: 'number',
        },
        {
          label: '日期',
          value: 'date',
        },
        {
          label: '时间',
          value: 'time',
        },
        {
          label: '列表',
          value: 'select',
        },
        {
          label: '列表多选',
          value: 'selects',
        },
        {
          label: '图片',
          value: 'image',
        },
        {
          label: '图片(多)',
          value: 'images',
        },
        {
          label: '文件',
          value: 'file',
        },
        {
          label: '文件(多)',
          value: 'files',
        },
        {
          label: '开关',
          value: 'switch',
        },
        {
          label: '复选',
          value: 'checkbox',
        },
        {
          label: '单选',
          value: 'radio',
        },
        {
          label: '数组',
          value: 'array',
        },
        {
          label: '自定义',
          value: 'custom',
        },
      ],
    },
  },
  {
    field: 'group',
    component: 'GroupApiSelect',
    label: '分组',
    colProps: {
      span: 20,
    },
    defaultValue: 'basic',
    componentProps: {
      api: getConfigGroup,
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '变量名',
    colProps: {
      span: 20,
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
            return Promise.reject('请输入变量名');
          }
          if (value.length < 3 || value.lenght > 30) {
            return Promise.reject('请填写3到30个字符');
          }
          const isExit = await configNameExist({ name: value });
          if (isExit.bool) {
            return Promise.reject('变量名已经存在');
          }
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'title',
    component: 'Input',
    label: '变量标题',
    colProps: {
      span: 20,
    },
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    field: 'value',
    component: 'Input',
    label: '变量值',
    defaultValue: '',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'content',
    component: 'InputTextArea',
    label: '数据列表',
    colProps: {
      span: 20,
    },
    defaultValue: `label1|value1\nlabel2|value2`,
    componentProps: {
      placeholder: 'label1|value1\nlabel2|value2',
    },
    required: true,
    show: ({ values }) => {
      if (
        values.type === 'radio' ||
        values.type === 'checkbox' ||
        values.type === 'selects' ||
        values.type === 'select'
      ) {
        return true;
      }
      return false;
    },
  },
  {
    field: 'tip',
    component: 'Input',
    label: '提示信息',
    defaultValue: '',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'rule',
    component: 'Select',
    label: '校验规则',
    colProps: {
      span: 20,
    },
    componentProps: {
      mode: 'multiple',
      options: [
        {
          label: '必选(required)',
          value: 'required',
          key: 'required',
        },
        {
          label: '数字(digits)',
          value: 'digits',
          key: 'digits',
        },
        {
          label: '字母(letters)',
          value: 'letters',
          key: 'letters',
        },
        {
          label: '日期(time)',
          value: 'time',
          key: 'time',
        },
        {
          label: '邮箱(email)',
          value: 'email',
          key: 'email',
        },
        {
          label: '网址(url)',
          value: 'url',
          key: 'url',
        },
        {
          label: 'QQ号(qq)',
          value: 'qq',
          key: 'qq',
        },
        {
          label: '身份证(IDcard)',
          value: 'IDcard',
          key: 'IDcard',
        },
        {
          label: '座机电话(tel)',
          value: 'tel',
          key: 'tel',
        },
        {
          label: '手机(mobile)',
          value: 'mobile',
          key: 'mobile',
        },
        {
          label: '邮编(zipcode)',
          value: 'zipcode',
          key: 'zipcode',
        },
        {
          label: '中文(chinese)',
          value: 'chinese',
          key: 'chinese',
        },
        {
          label: '用户名(username)',
          value: 'username',
          key: 'username',
        },
        {
          label: '密码(password)',
          value: 'password',
          key: 'password',
        },
      ],
    },
  },
  {
    field: 'extend',
    component: 'InputTextArea',
    label: '扩展属性',
    defaultValue: '',
    colProps: {
      span: 20,
    },
  },
];
