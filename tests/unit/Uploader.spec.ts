import { shallowMount, VueWrapper, mount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";
import axios from "axios";
import flushPromises from "flush-promises";
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
  const files = [file] as any;
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
  it("basic layout before uploading", () => {});
  it("upload process should works fine", async () => {});
  it("should return error text when post is rejected", async () => {});
  it("should show the correct interface when using custom slot", async () => {});
  it("before upload check", async () => {}),
    it("before upload check using Promise", async () => {});
  it("testing drag and drop function", async () => {});
  it("testing manual upload process", async () => {});
  it("PictureList mode should works fine", async () => {});
  afterEach(() => {
    mockedAxios.post.mockReset();
  });
});
