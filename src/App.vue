<template>
  <div class="app-container">
    <Uploader action="http://127.0.0.1:5000/upload/img"/>
    <!-- <demo/> -->
    <router-view/>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Uploader from '@/components/Uploader.vue';
// import demo from './demo.tsx';
export default defineComponent({
  components: {
    // demo,
    Uploader
  },
})
</script>

<style lang="scss">

</style>
