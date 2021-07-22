import { computed, defineComponent, PropType, VNode } from "vue";
import { reduce } from "lodash";
import { TextComponentProps } from "@/defaultProps";
import { mapPropsToForms, PropsToForms } from "@/propsMap";
import { Input, InputNumber, Slider, Radio, Select  } from 'ant-design-vue'
const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any

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
// 转换首字母大写
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
              ['on' + capitalizeFirstLetter(eventName)]: (e: any) => { context.emit('change', { key, value: afterTransform? afterTransform(e) : e })}
            }
          }
          result[newKey] = newItem
        }
        return result
        // Required 把可选变成必选
      },{} as {[key: string]: FormProps})
    })    
    return () => (
      <div class="props-table">
        {
          Object.keys(finalProps.value).map(key =>{
            const value = finalProps.value[key]
            // 通过组件名字拿到对应组件实例
            const ComponentName = mapToComponent[value.component]
            const SubComponent = value.subComponent ? mapToComponent[value.subComponent] : null
            const props = {
              [value.valueProp]: value.value,
              ...value.extraProps,
              ...value.events
            }
            return (
              <div key={key} class="prop-item">
                { value.text && <span class="label">{value.text}</span> }
                <div class="prop-component">
                    <ComponentName {...props}>
                      {
                        value.options?.map(option => {
                          return (
                            <SubComponent value={option.value}>{option.text}</SubComponent>
                          )
                        })
                      }
                    </ComponentName>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  },
});