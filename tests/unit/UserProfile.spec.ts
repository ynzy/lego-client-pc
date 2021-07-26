import { mount, VueWrapper } from "@vue/test-utils";
import { message } from "ant-design-vue";
import UserProfile from "@/components/UserProfile.vue";
import store from "@/store/index";
let wrapper: VueWrapper<any>;
jest.mock("ant-design-vue");
jest.mock("vuex");
jest.mock("vue-router");

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
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false },
      },
      global: {
        components: globalComponents,
      },
    });
  });
  // 如果没有登录，显示登录按钮
  it("should render login button when login is false", () => {
    console.log(wrapper.html());
    expect(wrapper.get("div").text()).toBe("登录");
  });
  // 点击登录，更新 store 的值
  it("should call message and update store when clicking login", async () => {});
  // 登录状态时，username 是否渲染
  it("should render username when login is true", async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: "viking" },
    });
    console.log(wrapper.html());
    expect(wrapper.get(".user-profile-component").html()).toContain("viking");
    expect(wrapper.find(".user-profile-dropdown").exists()).toBeTruthy();
  });
  it("should call logout and show message, call router.push after timeout", async () => {});
  afterEach(() => {});
});
