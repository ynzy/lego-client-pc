<template>
  <!-- action="http://81.70.233.205:8081/api/utils/upload-img" -->
  <!-- action="http://127.0.0.1:5000/upload/img" -->
  <!-- action="http://127.0.0.1:3000/api/utils/upload-img/single" -->
  <uploader
    action="http://81.70.233.205:8081/api/utils/upload-img/single"
    class="styled-uploader"
    :showUploadList="false"
    :beforeUpload="commonUploadCheck"
    @success="(data) => {handleUploadSuccess(data.resp, data.file.raw)}"
  >
    <div class="uploader-container">
      <a-button
        :type="type"
        :shape="shape"
        :style="{width: fixedWidth}"
      >
        <template #icon>
          <component
            :is="icon"
          />
        </template>
        {{ titles[0] }}
      </a-button>
    </div>
    <template #loading>
      <div class="uploader-container">
        <a-button
          :type="type"
          :shape="shape"
          :style="{width: fixedWidth}"
        >
          <template #icon>
            <LoadingOutlined spin/>
          </template>
          {{ titles[1] }}
        </a-button>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <a-button
          :type="type"
          :shape="shape"
          :style="{width: fixedWidth}"
        >
          <template #icon>
            <component
              :is="icon"
            />
          </template>
          {{ titles[2] }}
        </a-button>
      </div>
    </template>
  </uploader>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { FileImageOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { commonUploadCheck } from '../helper';
import Uploader from './Uploader.vue';

type ButtonType = 'primary' | 'default' | 'dashed' | 'danger' | 'link';
type Shape = 'circle' | 'round' | 'default'
type Titles = string[];
type Icon = 'FileImageOutlined' | 'UploadOutlined';
export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary'
    },
    shape: {
      type: String as PropType<Shape>,
      default: 'default'
    },
    titles: {
      type: Array as PropType<Titles>,
      default() {
        return ['上传图片', '上传中...', '上传图片'];
      }
    },
    fixedWidth: {
      type: [String, Number],
      default: '110px'
    },
    icon: {
      type: String as PropType<Icon>,
      default: 'FileImageOutlined'
    }
  },
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
    UploadOutlined
  },
  emits: ['success'],
  setup(props, {emit}) {
    const handleUploadSuccess = (resp: any, file: File) => {
      emit('success', {resp, file});
    };
    return {
      commonUploadCheck,
      handleUploadSuccess
    };
  }
});
</script>