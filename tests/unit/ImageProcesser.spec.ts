import { mount, VueWrapper } from "@vue/test-utils";
import ImageProcesser from "@/components/ImageProcesser.vue";
import flushPromises from "flush-promises";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let wrapper: VueWrapper<any>;
// 测试文件
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockButtonComponent = {
  template: "<button><slot></slot></button>",
};
const mockComponents = {
  UploadOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  "a-button": mockButtonComponent,
};
//  设置文件的值
const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any;
  Object.defineProperty(input, "files", {
    value: files,
    writable: false,
  });
};
describe("ImageProcesser", () => {
  beforeAll(() => {
    wrapper = mount(ImageProcesser, {
      props: {
        value: "test.url",
      },
      global: {
        stubs: mockComponents,
      },
    });
  });

  it("测试图片是否显示", () => {
    expect(wrapper.find(".image-preview").attributes("style")).toBe(
      "background-image: url(test.url);"
    );
  });
  it("测试更改图片", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: "a.png" } });
    const vm = wrapper.vm as any;
    vm.handleUploadSuccess = jest.fn();
    expect(wrapper.get("button").text()).toBe("更换图片");
    const input = wrapper.get("input").element as HTMLInputElement;
    setInputValue(input);
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).toBeCalledTimes(1);
    // expect(wrapper.get("button").text()).toBe("上传中");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("更换图片");
    expect(vm.handleUploadSuccess).toBeCalled();
    expect(vm.handleUploadSuccess).toBeCalledWith(
      {
        url: "a.png",
      },
      testFile
    );
    await wrapper.setProps({
      value: "a.png",
    });
    expect(wrapper.find(".image-preview").attributes("style")).toBe(
      "background-image: url(a.png);"
    );
  });
  afterEach(() => {
    mockedAxios.post.mockReset();
  });
});
