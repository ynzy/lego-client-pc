import {
  shallowMount,
  VueWrapper,
  mount,
  flushPromises,
} from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
const testFile2 = new File(["xyz"], "viking.png", { type: "image/png" });
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
};
const setInputValue = (input: HTMLInputElement, file = testFile) => {
  const files = [file] as any; // 由于没有FileList构造函数，只能通过断言来创建一个数组
  // 虽然通过了Ts的类型校验，但是通过不了测试，所以用Object.defineProperty来修改属性
  Object.defineProperty(input, "files", {
    value: files,
    writable: false,
  });
};

describe("Uploader Component", () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url",
      },
      global: {
        stubs: mockComponents,
      },
    });
  });
  // 初始界面渲染
  it("basic layout before uploading", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("button span").text()).toBe("点击上传");
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  });
  // 上传成功显示的界面
  it("upload process should works fine", async () => {
    // change e.target.files
    // create a file
    mockedAxios.post.mockResolvedValueOnce({ status: "success" });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    // expect(wrapper.get("button").text()).toBe("正在上传");
    // button 为 disabled
    // console.log(wrapper.get("button").attributes());
    // expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
    // 列表长度修改，并且有正确的 class
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    // expect(firstItem.classes()).toContain("upload-loading");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
    // 有正确的 class，并且文件名称相对应
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });
  // 上传失败显示的界面
  it("should return error text when post is rejected", async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: "error" });
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    // expect(wrapper.get("button span").text()).toBe("正在上传");
    await flushPromises();
    expect(wrapper.get("button span").text()).toBe("点击上传");
    // 列表长度增加，并且列表的最后一项有正确的 class 名
    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.get("li:last-child");
    expect(lastItem.classes()).toContain("upload-error");
    // 点击列表中右侧的 button，可以删除这一项
    await lastItem.get(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
  });
  it("should show the correct interface when using custom slot", async () => {});
  it("before upload check", async () => {}),
    it("before upload check using Promise", async () => {});
  it("testing drag and drop function", async () => {});
  it("testing manual upload process", async () => {});
  it("PictureList mode should works fine", async () => {});
  afterEach(() => {
    // mockedAxios.post.mockReset();
  });
});
