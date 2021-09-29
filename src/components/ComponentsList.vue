<!-- 左侧组件列表 -->
<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <LText v-bind="item" />
    </div>
  </div>
  <StyledUploader @success="onImageUploaded"/>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import LText from "@/components/LText.vue";
import StyledUploader from "@/components/StyledUploader.vue";
import { imageDefaultProps, TextComponentProps } from "lego-component-ynzy";
import { ComponentData } from "@/store/editor";
import { UploadResp } from '@/extraType'
import { getImageDimensions } from '@/helper'

export default defineComponent({
  name: "components-list",
  components: {
    LText,
    StyledUploader,
  },
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const onItemClick = (props: TextComponentProps) => {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: "l-text",
        props,
      };
      context.emit("on-item-click", newComponent);
    };
    const onImageUploaded = (data: { resp: UploadResp; file: File }) => {
      const { resp, file } = data
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功')
      componentData.props.src = resp.data.url
      getImageDimensions(file).then(({ width }) => {
        // console.log(width)
        const maxWidth = 373
        componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
        console.log(componentData);
        
        context.emit('on-item-click', componentData)
      })
    }
    return {
      onItemClick,
      onImageUploaded
    };
  },
});
</script>
<style lang="scss" scoped>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>
