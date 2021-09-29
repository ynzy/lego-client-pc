import { h, VNode } from "vue";
import { TextComponentProps,ImageComponentProps } from "./defaultProps";

export interface PropsToForm {
  component: string; // 渲染的组件
  subComponent?: string; // 渲染子组件
  extraProps?: { [key: string]: any }; // 组件上的一些属性
  text?: string; // 属性的说明 title
  options?: { text: string | VNode; value: any }[]; // 子组件的选项
  initalTransform?: (v: any) => any; // 接收值，进行转换
  afterTransform?: (v: any) => any; // 改变值，进行转换
  valueProp?: string; // 适配组件传入不同的属性名称
  eventName?: string; // 动态事件
}

/**
 * 通过属性映射表单
 * 
 * 通过keyof遍历拿到key，分别赋值一个属性
 * text: {
    component: 'input'
    },
 */
type AllProps = TextComponentProps & ImageComponentProps;
export type PropsToForms = {
  [P in keyof AllProps]?: PropsToForm;
};

const fontFamilyArr = [
  { text: "宋体", value: '"SimSun","STSong"' },
  { text: "黑体", value: '"SimHei","STHeiti"' },
  { text: "楷体", value: '"KaiTi","STKaiti"' },
  { text: "仿宋", value: '"FangSong","STFangsong"' },
];

const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    // text: h("span", { style: { fontFamily: font.value } }, font.text),
    text: <span style={{ fontFamily: font.value}}>{font.text}</span> as VNode
  };
});

export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: { rows: 3 },
    valueProp: "name",
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: "字号",
    component: "a-input-number",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : ""),
  },
  lineHeight: {
    text: "行高",
    component: "a-slider",
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [{ value: "", text: "无" }, ...fontFamilyOptions],
  },
  color: { 
    component: "color-picker",
    text: '字体颜色'
  },
  src: {
    component: 'ImageProcesser',
    text: ''
  }
};
