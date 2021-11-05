<!--  -->
<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input v-if="isEditing" v-model="innerValue"  placeholder="文本不能为空" ref="inputRef" />
    <slot v-else :text="innerValue">
      <span>{{ innerValue }}</span>
    </slot>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref, watch, watch, watch } from 'vue'
import useKeyPress from "@/hooks/useKeyPress";
export default defineComponent({
  name: 'inline-edit',
  props: {
    value: {
      type: String,
      requiered: true,
    }
  },
  emits: ['change'],
  setup(props,context) {
    const innerValue = ref(props.value)
    let cachedOldValue = ''
    const isEditing = ref(false)
    const handleClick = () => {
      isEditing.value = true
    }
    watch(isEditing,(isEditing)=>{
      if(isEditing) {
        cachedOldValue = innerValue.value || ''
      }
    })
    useKeyPress('Enter',()=>{
      if(isEditing.value) {
        isEditing.value = false
        context.emit('change',innerValue.value)
      }
    })
    useKeyPress('Escape',()=>{
      if(isEditing.value){
        isEditing.value = false
        innerValue.value = cachedOldValue
      }
    })
    return {
      innerValue,
      isEditing,
      handleClick
    };
  }
})
</script>
<style lang='scss' scoped>
.inline-edit {

}
</style>
