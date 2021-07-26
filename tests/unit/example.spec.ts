import { flushPromises, shallowMount, VueWrapper } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Hello from "@/components/Hello.vue";
import axios from "axios";
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>; // 使用断言，让模拟的axios使用api后，可以正常调用mock的api
const msg = "new message";
let wrapper: VueWrapper<any>;
describe("HelloWorld.vue", () => {
  beforeAll(() => {
    wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
  });
  // 渲染 props.msg 是否通过
  it("renders props.msg when passed", () => {
    expect(wrapper.get("h1").text()).toBe(msg); // 测试 获取 h1 元素的文本，是否是 msg 对应的字符串
    expect(wrapper.findComponent(Hello).exists()).toBeTruthy(); // 测试子组件 Hello 是否存在
  });
  // 点击 button 时， count 是否更新
  it("should update the count when clicking the button", async () => {
    // 获取 button 触发点击事件
    await wrapper.get("button").trigger("click"); // 异步更新
    // 获取 button 的文本，是否等于2
    expect(wrapper.get("button").text()).toBe("2");
  });
  // 输入内容 点击button 查看列表是否更新
  it("should add todo when fill the input and click the add button", async () => {
    const todoContent = "buy milk";
    await wrapper.get("input").setValue(todoContent); // 表单输入内容
    expect(wrapper.get("input").element.value).toBe(todoContent); // 查看input的值是否等于输入的内容
    await wrapper.get(".addTodo").trigger("click"); // 点击button，执行了添加事件
    expect(wrapper.findAll("li")).toHaveLength(1); // 查看所有li的数组长度是否为1
    expect(wrapper.get("li").text()).toBe(todoContent); // 获取第一个li，查看是否等于输入的内容
    expect(wrapper.emitted()).toHaveProperty("send"); // 是否有 send 事件发送出来
    const events: any = wrapper.emitted("send"); // 拿到send事件中的值
    expect(events[0]).toEqual([todoContent]); // 比较数组，对象。。非严格相等的值
  });
  // 使用only跑一个单独的case
  // 点击按钮 测试 user 数据的加载 成功
  it("should load user message when click the load button", async () => {
    // 模拟接口，获取一次成功态，返回数据
    mockAxios.get.mockResolvedValueOnce({
      data: { userName: "viking" },
    });
    await wrapper.get(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled(); // 点击按钮之后，是否被调用
    expect(wrapper.find(".loading").exists()).toBeTruthy(); // 判断 .loading 元素是否存在(显示loading)
    await flushPromises(); // 将所有Promise pending状态都改为完成
    // 界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy(); // 判断 .loading 元素是否存在(隐藏loading)
    expect(wrapper.get(".userName").text()).toBe("viking");
  });

  // 点击按钮 测试 user 数据的加载 失败
  it("should load error when return promise reject", async () => {
    // 模拟接口，获取一次失败态，返回数据
    mockAxios.get.mockRejectedValueOnce("error");
    await wrapper.get(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    await flushPromises(); // 将所有Promise pending状态都改为完成
    // 界面更新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy(); // 判断 .loading 元素是否存在(隐藏loading)
    expect(wrapper.find(".error").exists()).toBeTruthy();
  });

  afterEach(() => {
    mockAxios.get.mockReset();
  });
});
