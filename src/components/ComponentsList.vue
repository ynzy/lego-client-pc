<!--  -->
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
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { v4 as uuidv4 } from 'uuid'
import LText from "@/components/LText.vue";
import { TextComponentProps } from "@/defaultProps";
import { ComponentData } from "@/store/editor";

export default defineComponent({
  name: "components-list",
  components: {
    LText,
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
    return {
      onItemClick,
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
