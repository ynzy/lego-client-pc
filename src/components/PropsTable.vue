<!--  -->
<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
    >
      <span class="label">{{value?.text}}</span>
      <div class="prop-component">
        <!-- 父组件 -->
        <component 
          :is="value.component" 
          :value="value.value"
          :[value.valueProp]="value.value" 
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <!-- 子组件 -->
          <template v-if="value.options">
            <component 
              :is="value.subComponent" 
              v-for="(option, k) in value.options" :key="k"
              :value="option.value"
            >
              <render-vnode :vNode="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>  

<script lang="ts">
import { computed, defineComponent, PropType, VNode } from "vue";
import { reduce } from "lodash";
import { TextComponentProps } from "@/defaultProps";
import { mapPropsToForms, PropsToForms } from "@/propsMap";
interface FormProps {
  component: string;
  subComponent?: string;
  value: string;  // 组件的值
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;  // 动态事件名字
  events: { [key: string]: (e: any) => void };
}
export default defineComponent({
  name: "props-table",
  components: {},
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      require: true,
    }
  },
  emits: ['change'],
  setup(props,context) {
    // 属性转换成表单数据渲染
    const finalProps = computed(()=>{
      return reduce(props.props,(result,value,key) =>{
        const newKey = key as keyof TextComponentProps
        const item = mapPropsToForms[newKey]
        // 判断是否存在这个组件，如果存在渲染到页面上
        if(item) {
          const { valueProp = 'value', eventName = 'change', initalTransform,afterTransform } = item
          const newItem: FormProps = {
            ...item,
            value: initalTransform ? initalTransform(value) : value,
            valueProp,
            eventName,
            events: {
              [eventName]: (e:any) => {
                context.emit('change', {key, value: afterTransform ? afterTransform(e) : e})
              }
            }
          }
          result[newKey] = newItem
        }
        return result
        // Required 把可选变成必选
      },{} as {[key: string]: FormProps})
    })    
    return {
      finalProps
    };
  },
});
</script>
<style lang="scss" scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
</style>
