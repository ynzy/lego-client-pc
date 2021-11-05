import { mount, VueWrapper } from "@vue/test-utils";
import InlineEdit from "@/components/InlineEdit.vue";
import { nextTick } from 'vue'
let wrapper: VueWrapper<any>;

describe("InlineEdit component", () => {
  beforeAll(() => {
    wrapper = mount(InlineEdit, {
      props: {
        value: "test",
      },
      slots: {
        default: '<template #default="{ text }"><h2>{{text}}</h2></template>'
      }
    });
  });

  it('should render the default layout', () => {
    expect(wrapper.get('h2').text()).toBe('test')
  })
  it('should render input when clicking the element', async () => {
    await wrapper.trigger('click')
    expect(wrapper.find('input').exists()).toBeTruthy()
    const input = wrapper.get('input').element as HTMLInputElement;
    expect(input.value).toBe('test')
  })

  it('press enter should render to default layout with new value', async () => {
    const newText = 'testnew'
    await wrapper.get('input').setValue(newText)
    // 全局调用事件
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('h2').exists()).toBeTruthy()
    expect(wrapper.get('h2').text()).toBe(newText)
    const events: any = wrapper.emitted('change')
    expect(events[0]).toEqual([newText])
  })

  it('press esc should render to default layout with old value', async () => {
    const newText = 'test123'
    await wrapper.trigger('click')
    await wrapper.get('input').setValue(newText)
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('h2').exists()).toBeTruthy()
    expect(wrapper.get('h2').text()).toBe('testnew')
  })

  /* it('click outside should render to default layout with new value',async ()=>{

  }) */
});


