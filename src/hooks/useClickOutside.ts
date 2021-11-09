import { ref, onMounted, onUnmounted, Ref } from 'vue';

/**
 * 点击元素是否在当前区域内
 * @param elementRef
 */
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false); // 是否点击了区域外
  const handler = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      // 检查点击元素是否在当前区域内
      // 包含在区域内
      // 类型“EventTarget”的参数不能赋给类型“Node”的参数 可以使用类型断言，把父类断言成子类
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
