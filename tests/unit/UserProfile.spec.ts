import { mount, VueWrapper } from "@vue/test-utils";
import { message } from "ant-design-vue";
import UserProfile from "@/components/UserProfile.vue";
import store from "@/store/index";
let wrapper: VueWrapper<any>;
// 回调函数，返回模块的实现
jest.mock("ant-design-vue", () => ({
  message: {
    success: jest.fn(),
  },
}));
const mockedRoutes: string[] = [];
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: (url: string) => mockedRoutes.push(url),
  }),
}));

const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
};
const globalComponents = {
  "a-button": mockComponent,
  "a-dropdown-button": mockComponent2,
  "router-link": mockComponent,
  "a-menu": mockComponent,
  "a-menu-item": mockComponent,
};

describe("UserProfile component", () => {
  beforeAll(() => {
    jest.useFakeTimers(); // 模拟定时器
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false },
      },
      global: {
        components: globalComponents,
        // https://github.com/vuejs/vue-test-utils-next/issues/196
        provide: {
          store, // 挂载实例
        },
      },
    });
  });
  // 如果没有登录，显示登录按钮
  it("should render login button when login is false", async () => {
    // console.log(wrapper.html());
    expect(wrapper.get("div").text()).toBe("登录");
    await wrapper.get("div").trigger("click");
    expect(message.success).toHaveBeenCalled();
    expect(store.state.user.userName).toBe("viking");
  });
  // 点击登录，更新 store 的值
  it("should call message and update store when clicking login", async () => {});
  // 登录状态时，username 是否渲染
  it("should render username when login is true", async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: "viking" },
    });
    // console.log(wrapper.html());
    expect(wrapper.get(".user-profile-component").html()).toContain("viking");
    expect(wrapper.find(".user-profile-dropdown").exists()).toBeTruthy();
  });
  // 退出登录 显示信息，2秒以后，路由跳转
  it("should call logout and show message, call router.push after timeout", async () => {
    await wrapper.get(".user-profile-dropdown div").trigger("click");
    expect(store.state.user.isLogin).toBeFalsy();
    expect(message.success).toHaveBeenCalledTimes(1);
    jest.runAllTimers(); // 结束定时器
    expect(mockedRoutes).toEqual(["/"]);
  });
  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset();
  });
});
