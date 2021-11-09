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
              :hidden="component.isHidden"
              :active="component.id === currentElement?.id"
              @setActive="setActive"
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
        <a-tabs type="card" v-model:activeKey="activePanel" >
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <PropsTable
                v-if="!currentElement.isLocked"
                :props="currentElement.props"
                @change="handleChange"
              ></PropsTable>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>
            <pre>
              {{currentElement?.props}}
            </pre>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置" >
            <LayerList
              :list="components"
              :selectedId="currentElement && currentElement.id"
              @change="handleChange"
              @select="setActive"
            >
            </LayerList>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Tab 3">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent,ref } from "vue";
import { useStore } from "vuex";
import { ComponentData } from "@/store/editor";
import LText from "@/components/LText.vue";
import LImage from "@/components/LImage.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import ComponentsList from "@/components/ComponentsList.vue";
import PropsTable from "@/components/PropsTable.vue";
import LayerList from "@/components/LayerList.vue";
// import PropsTable from "@/components/PropsTable.tsx";

import { defaultTextTemplates } from "@/defaultTemplates";
export type TabType = 'component' | 'layer' | 'page';
export default defineComponent({
  name: "",
  components: {
    LText,
    LImage,
    ComponentsList,
    EditWrapper,
    PropsTable,
    LayerList
  },
  props: {},
  setup() {
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>('component')
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
      handleChange,
      activePanel
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
