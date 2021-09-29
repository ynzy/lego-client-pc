import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import { TextComponentProps, ImageComponentProps } from "@/defaultProps";
export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 一系列和其他状态相关的信息，应该有很多
  // 当前编辑的是哪个元素，uuid
  currentElement: string;
}
export interface ComponentData {
  // 每个元素 props 所有属性
  // 我们上节课已经分析过了，是 css 属性和其他属性的混合体
  // 并且我们会把这些属性完全平铺开来，其实在编辑器分析过后，你就能更感受到平铺的一个好处
  props: Partial<TextComponentProps & ImageComponentProps>;
  // id，uuid v4 生成
  id: string;
  // 业务组件库名称 l-text，l-image 等等
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      text: "hello",
      fontSize: "20px",
      color: "#000000",
      lineHeight: "1",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      text: "hello2",
      fontSize: "10px",
      fontWeight: "bold",
      lineHeight: "2",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      text: "hello3",
      fontSize: "15px",
      actionType: "url",
      url: "https://www.baidu.com",
      lineHeight: "3",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-image",
    props: {
      src:
        "http://lego-server.oss-cn-beijing.aliyuncs.com/upload-files/xiong-178972.jpg",
      width: "373px",
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
  },
  mutations: {
    // 添加組件
    addComponent(state, component: ComponentData) {
      state.components.push(component);
    },
    // 删除组件
    deleteComponent(state, component: ComponentData) {
      state.components = state.components.filter(
        (item) => item.id !== component.id
      );
    },
    // 画布选中组件的id
    setActive(state, currentId: string) {
      state.currentElement = currentId;
    },
    updateComponent(state, { key, value }) {
      const updatedComponent = state.components.find(
        (component) => component.id === state.currentElement
      );
      if (updatedComponent) {
        updatedComponent.props[key as keyof TextComponentProps] = value;
      }
    },
  },
  getters: {
    // 获取当前选中的组件属性
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement
      );
    },
  },
};

export default editor;
