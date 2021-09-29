<!--  -->
<template>
  <div class="editor-container" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <ComponentsList :list="defaultTextTemplates" @onItemClick="addItem"/>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <EditWrapper 
              v-for="component in components" 
              :key="component.id" 
              :id="component.id" 
              @setActive="setActive"  
              :active="component.id === currentElement?.id"
            >
              <component
                :is="component.name"
                v-bind="component.props"
              />
            </EditWrapper>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        组件属性
        <PropsTable
          v-if="currentElement?.props"
          :props="currentElement.props"
          @change="handleChange"
        ></PropsTable>
        <pre>
          {{currentElement?.props}}
        </pre>
      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { ComponentData } from "@/store/editor";
import LText from "@/components/LText.vue";
import LImage from "@/components/LImage.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import ComponentsList from "@/components/ComponentsList.vue";
import PropsTable from "@/components/PropsTable.vue";
// import PropsTable from "@/components/PropsTable.tsx";

import { defaultTextTemplates } from "@/defaultTemplates";
export default defineComponent({
  name: "",
  components: {
    LText,
    LImage,
    ComponentsList,
    EditWrapper,
    PropsTable
  },
  props: {},
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const addItem = (component: ComponentData) =>{
      store.commit('addComponent', component)
    }
    const handleDeleteComponent = (component:ComponentData) =>{
      store.commit('deleteComponent', component)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    const handleChange = (e:any) =>{
      console.log('event', e);
      store.commit('updateComponent', e)
      
    }
    return {
      components,
      defaultTextTemplates,
      addItem,
      handleDeleteComponent,
      setActive,
      currentElement,
      handleChange
    };
  },
});
</script>
<style lang="scss" scoped>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>
