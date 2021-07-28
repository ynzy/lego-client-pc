<!--  -->
<template>
  <div class="file-upload">
    <button @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button>
    <input 
      ref="fileInput" 
      type="file" 
      :style="{ display: 'none' }" 
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

type UploadStatus = "ready" | "loading" | "success" | "error";
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
}
export default defineComponent({
  name: "uploader",
  components: {},
  props: {
    action: {
      type: String,
      required: true,
      default: "http://local.test:7001/api/upload",
    },
  },
  setup(props, { emit }) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const uploadedFiles = ref<UploadFile[]>([])
    const isUploading = computed(()=>{
      return uploadedFiles.value.some(file=>file.status ==='loading')
    })
    // 获取到input dom， 通过点击button，模拟点击input
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        const formData = new FormData();
        // uploadedFile.name
        formData.append('upload', uploadedFile);
        const fileObj = reactive<UploadFile>({
          uid: uuidv4(),
          size: uploadedFile.size,
          name: uploadedFile.name,
          status: 'loading',
          raw: uploadedFile
        }) 
        uploadedFiles.value.push(fileObj);
        axios
          .post(props.action, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res.data);
              fileObj.status = 'success'
          })
          .catch(() => {
              fileObj.status = 'error'
          });
      }
    };
    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      uploadedFiles,
      isUploading
    };
  },
});
</script>
<style lang="scss" scoped></style>
