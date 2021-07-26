<template>
  <div class="app-container">
    <!-- <demo/> -->
    <HelloWorld :msg="1243"/>
    <router-view/>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
// import demo from './demo.tsx';
export default defineComponent({
  components: {
    // demo,
  },
})
</script>

<style lang="scss">

</style>
