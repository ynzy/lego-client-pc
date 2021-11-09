<!--  -->
<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input v-if="isEditing" v-model="innerValue" placeholder="文本不能为空" ref="inputRef" />
    <slot v-else :text="innerValue">
      <span>{{ innerValue }}</span>
    </slot>
  </div>
</template>
<script lang='ts'>
import { defineComponent, nextTick, ref, watch } from 'vue'
import useKeyPress from "@/hooks/useKeyPress";
import useClickOutside from "@/hooks/useClickOutside";
export default defineComponent({
  name: 'inline-edit',
  props: {
    value: {
      type: String,
      requiered: true,
    }
  },
  emits: ['change'],
  setup(props, context) {
    const innerValue = ref(props.value)
    const wrapper = ref<null | HTMLElement>(null)
    const inputRef = ref<null | HTMLInputElement>(null)
    const isOutside = useClickOutside(wrapper)
    let cachedOldValue = ''
    const isEditing = ref(false)
    const handleClick = () => {
      isEditing.value = true
    }
    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cachedOldValue = innerValue.value || ''
        await nextTick() // 此时还没有获取 dom 节点
        if(inputRef.value) { // 获取input，添加聚焦
          inputRef.value.focus()
        }
      }
    })
    watch(isOutside, (newValue) => {
      if (newValue && isEditing.value) {
        isEditing.value = false
        context.emit('change', innerValue.value)
      }
      isOutside.value = false
    })
    useKeyPress('Enter', () => {
      if (isEditing.value) {
        isEditing.value = false
        context.emit('change', innerValue.value)
      }
    })
    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false
        innerValue.value = cachedOldValue
      }
    })
    return {
      innerValue,
      isEditing,
      handleClick,
      wrapper,
      inputRef
    };
  }
})
</script>
<style lang='scss' scoped>
.inline-edit {
  cursor: pointer;
}
.ant-input.input-error {
  border: 1px solid #f5222d;
}
.ant-input.input-error:focus {
  border-color:  #f5222d;
}
.ant-input.input-error::placeholder {
  color: #f5222d;
}
</style>
