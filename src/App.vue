<template>
  <div class="app-container">
    <!-- <Uploader action="http://127.0.0.1:5000/upload/img" drag listType="picture">
      <div class="uploader-container">
        <h4>上传图片</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded="{uploadedData}">
        <div class="uploaded-area">
          <img :src="uploadedData.data" alt="">
          <h3>点击重新上传</h3>
        </div>
      </template>
    </Uploader> -->
    <!-- <demo/> -->
    <router-view/>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
// import Uploader from '@/components/Uploader.vue';
// import demo from './demo.tsx';
export default defineComponent({
  components: {
    // demo,
    // Uploader
  },
})
</script>

<style lang="scss">
ul,li {
  list-style: none;
}

.uploaded-area {
   width:100%;
    height:100%;
  img { 
    width:100%;
    height:100%;
  }
}
</style>
