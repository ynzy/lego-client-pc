import { computed } from "vue";
import { pick } from "lodash-es";
import { TextComponentProps } from "@/defaultProps";
const useComponentCommon = (
  // Readonly 只读，Partial 把传入的类型变为可选类型
  props: Readonly<Partial<TextComponentProps>>,
  picks: string[]
) => {
  /**
   * 抽离页面样式函数
   * 重用并且简化 属性提取
   * 抽离并且获得 styleProps
   * pick 创建一个从 object 中选中的属性的对象。
   */
  const styleProps = computed(() => pick(props, picks));
  // 点击事件的处理
  const handleClick = () => {
    if (props.actionType === "url" && props.url) {
      window.location.href = props.url;
    }
  };
  return {
    styleProps,
    handleClick,
  };
};

export default useComponentCommon;
