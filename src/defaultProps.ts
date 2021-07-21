import { mapValues, without } from "lodash-es";
export interface CommonComponentProps {
  // actions 行为
  actionType: string;
  url: string;
  // size 大小边距
  height: string;
  width: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  // border type 边框
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  // shadow and opacity
  boxShadow: string;
  opacity: string;
  // position and x,y 定位
  position: string;
  left: string;
  top: string;
  right: string;
}

export const commonDefaultProps: CommonComponentProps = {
  // actions
  actionType: "",
  url: "",
  // size
  height: "",
  width: "373px",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
  // border type
  borderStyle: "none",
  borderColor: "#000",
  borderWidth: "0",
  borderRadius: "0",
  // shadow and opacity
  boxShadow: "0 0 0 #000000",
  opacity: "1",
  // position and x,y
  position: "absolute",
  left: "0",
  top: "0",
  right: "0",
};

export interface TextComponentProps extends CommonComponentProps {
  text: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
}

export interface ImageComponentProps extends CommonComponentProps {
  src: string;
}

export const textDefaultProps: TextComponentProps = {
  // basic props - font styles
  text: "正文内容",
  fontSize: "14px",
  fontFamily: "",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: "1",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "",
  ...commonDefaultProps,
};

export const imageDefaultProps: ImageComponentProps = {
  src: "test.url",
  ...commonDefaultProps,
};

/**
 * 剔除一些属性，只保留样式属性
 * without 创建一个剔除所有给定值的新数组，剔除值的时候，使用SameValueZero做相等比较,返回一个新数组
 */
export const textStylePropNames = without(
  Object.keys(textDefaultProps),
  "actionType",
  "url",
  "text"
);
export const imageStylePropsNames = without(
  Object.keys(imageDefaultProps),
  "src"
);

/**
 * 将component默认数据转换为vue props的格式
 * {
 *    type: String,
 *    default: item
 * }
 */
export const transformToComponentProps = <T extends { [key: string]: any }>(
  props: T
) => {
  // 创建一个对象，这个对象的key与object对象相同，值是通过 iteratee 运行 object 中每个自身可枚举属性名字符串产生的。
  return mapValues(props, (item) => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item,
    };
  });
};

/**
export const transformToComponentProps = (props: { [key: string]: any }) => {
  // 创建一个对象，这个对象的key与object对象相同，值是通过 iteratee 运行 object 中每个自身可枚举属性名字符串产生的。
  return mapValues(props, (item) => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item,
    };
  });
};
 */
