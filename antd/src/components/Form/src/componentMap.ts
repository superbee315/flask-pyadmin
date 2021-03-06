import type { Component } from 'vue';
import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
} from 'ant-design-vue';

import RadioButtonGroup from './components/RadioButtonGroup.vue';
import MultipleTreeSelect from './components/MultipleTreeSelect.vue';
import FamilyArrCom from './components/FamilyArrCom.vue';
import CarArrayCom from './components/CarArrayCom.vue';
import RangeNumber from './components/RangeNumber.vue';
import MyRangerPicker from './components/MyRangerPicker.vue';
import YearPicker from './components/YearPicker.vue';
import ApiSelect from './components/ApiSelect.vue';
import GroupApiSelect from './components/GroupApiSelect.vue';
import UploadFile from './components/upload/UploadFile.vue';
import UploadImage from './components/upload/UploadImage.vue';
import { BasicUpload } from '/@/components/Upload';
import { StrengthMeter } from '/@/components/StrengthMeter';
import { IconPicker } from '/@/components/Icon';

const componentMap = new Map<ComponentType, Component>();
componentMap.set('Input', Input);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('RangeNumber', RangeNumber);
componentMap.set('YearPicker', YearPicker);
componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', Select);
componentMap.set('GroupApiSelect', GroupApiSelect);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('FamilyArrCom', FamilyArrCom);
componentMap.set('CarArrayCom', CarArrayCom);
componentMap.set('UploadFile', UploadFile);
componentMap.set('UploadImage', UploadImage);
// componentMap.set('SelectOptGroup', Select.OptGroup);
// componentMap.set('SelectOption', Select.Option);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('MultipleTreeSelect', MultipleTreeSelect);
// componentMap.set('Transfer', Transfer);
// componentMap.set('Radio', Radio);
componentMap.set('Switch', Switch);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('Cascader', Cascader);
componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('MyRangerPicker', MyRangerPicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('StrengthMeter', StrengthMeter);
componentMap.set('IconPicker', IconPicker);

componentMap.set('Upload', BasicUpload);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
