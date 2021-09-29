<template>
  <div class="image-processer">
    <a-modal
      :width="1000"
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消">
      <div class="image-cropper">
        <!-- <img :src="dataURL" alt=""> -->
        <img id="processed-image" ref="cropperImageRef" :src="baseImageUrl" alt="">
      </div>
    </a-modal>

    <div class="image-preview" :style="{backgroundImage: backgroundUrl}"/>
    <div class="image-process">
      <StyledUploader
        shape="round"
        icon="UploadOutlined"
        type="default"
        fixed-width="100%"
        :titles="titles"
        @success="handleFileUploaded"
      />
      <a-button @click="showModal = true"> 
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </a-button>
      <a-button v-if="showDelete" type="danger" @click="handleDelete">
        <template v-slot:icon><DeleteOutlined /></template>删除图片
      </a-button>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref,computed, watch, nextTick } from 'vue';
import { UploadResp } from '@/extraType'
import StyledUploader from '@/components/StyledUploader.vue';
import { message } from "ant-design-vue";
import { ScissorOutlined,DeleteOutlined } from "@ant-design/icons-vue";
import Cropper from 'cropperjs'
import axios from 'axios';
interface CropDataProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default defineComponent({
  name: 'ImageProcesser',
  components: {
    StyledUploader,
    ScissorOutlined,
    DeleteOutlined
  },
  props: {
    value: {
      type: String as PropType<string>,
      required: true
    },
    ratio: {
      type: Number
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change','uploaded'],
  setup(props, {emit}) {
    const showModal = ref(false)
    const dataURL = ref('') // getCroppedCanvas获取到的url
    const backgroundUrl = computed(()=>`url(${props.value})`)
    const baseImageUrl = computed(()=> props.value.split('?')[0])
    const titles = ref(['更换图片', '上传中...', '更换图片']);
    const cropperImageRef = ref<null|HTMLImageElement>(null)
    let cropper: Cropper;
    let cropData: CropDataProps | null = null;
    watch(showModal, async(newValue)=>{
      if(newValue) {
        // 等待 dom 加载完再获取
        await nextTick()
        console.log(cropperImageRef.value);
        if(cropperImageRef.value){
          cropper = new Cropper(cropperImageRef.value, {
            // aspectRatio: 16 / 9,
            crop(event) {
              console.log(event.detail);
              const {x,y,width,height} = event.detail
              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height),
              }
            },
          });
        }
      }else {
        cropper && cropper.destroy()
      }
    })
    const handleOk = () => {
      if(cropData) {
        const {x,y,width,height} = cropData
        // 使用阿里OSS裁剪图片
        // 每次只能对原图进行裁剪，否则坐标位置会发生偏移
        const cropperURL = `${baseImageUrl.value}?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        emit('change',cropperURL)
        // dataURL.value = cropper.getCroppedCanvas().toDataURL()
        /* cropper.getCroppedCanvas().toBlob((blob)=>{
          if(blob) {
            const formData = new FormData()
            formData.append('croppedImage',blob,'test.png')
            // 重新上传图片
            axios.post('http://81.70.233.205:8081/api/utils/upload-img/single', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(resp=>{
              emit('change',resp.data.data.url)
            })
          }
        }) */
      }
      showModal.value = false
    }
    const handleFileUploaded = (data: {resp:UploadResp;file: File}) => {
      const {resp} = data
      message.success('上传成功')
      console.log(resp);
      
      emit('change',resp.data.url)
      emit('uploaded',data)
    }
    const handleDelete = () => {
      console.log('handleDelete');
      
    }
    return {
      showModal,
      backgroundUrl,
      titles,
      handleFileUploaded,
      handleDelete,
      cropperImageRef,
      handleOk,
      baseImageUrl,
      dataURL,
    };
  }
});
</script>

<style lang="scss" scoped>
.image-processer {
  width: 100%;
  padding: 10px 0;
  display: flex;
  box-sizing: border-box;

  .image-preview {
    flex: 0 0 150px;
    width: 150px;
    height: 84px;
    border: 1px dashed #e6ebed;
    background: no-repeat 50%/contain;
  }

  .image-process {
    flex: 1;
    padding: 5px 0;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .image-cropper img{
    display: block;
    max-width: 100%;
  }
}
</style>