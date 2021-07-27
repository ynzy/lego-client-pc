import store from "@/store/index";
import { testData } from "@/store/templates";
import { testComponents, ComponentData } from "@/store/editor";
import { clone, last } from "lodash-es";
const cloneComponents = clone(testComponents);
describe("test vuex store", () => {
  // 是否有模块
  it("should have three modules", () => {
    expect(store.state).toHaveProperty("user");
    expect(store.state).toHaveProperty("templates");
    expect(store.state).toHaveProperty("editor");
  });

  describe("test user module", () => {
    it("test login mutation", () => {
      store.commit("login");
      expect(store.state.user.isLogin).toBeTruthy();
    });
    it("test logout mutation", () => {
      store.commit("logout");
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  describe("test templates module", () => {
    it("should have default templates", () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });
    it("should get the correct template by Id", () => {
      const selectTemplate = store.getters.getTemplateById(1);
      expect(selectTemplate.title).toBe("test title 1");
    });
  });

  describe("test editor module", () => {
    // 测试是否有此组件
    it("should have default components", () => {
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length
      );
    });
    // 设置当前组件，获取当前组件getters
    it("should get current component when set active one component", () => {
      store.commit("setActive", cloneComponents[0].id);
      expect(store.state.editor.currentElement).toBe(cloneComponents[0].id);
      const currentElement = store.getters.getCurrentElement;
      expect(currentElement.id).toBe(cloneComponents[0].id);
    });
    // 测试添加组件
    it("add component should works fine", () => {
      const payload: ComponentData = {
        name: "l-text",
        id: "1234",
        props: {
          text: "text1",
        },
      };
      store.commit("addComponent", payload);
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 1
      );
      // 匹配最后一项
      const lastItem = last(store.state.editor.components);
      expect(lastItem?.props.text).toBe("text1");
    });
    // 更新组件信息
    it("update component should works fine", () => {
      const newProps = {
        key: "text",
        value: "update",
      };
      store.commit("updateComponent", newProps);
      // 这里拿到的 currentElement 是之前第二个测试操作过的，如果不想要这个数据，使用afterEach做操作
      const currentElement: ComponentData = store.getters.getCurrentElement;
      expect(currentElement.props.text).toBe("update");
    });
  });
});
