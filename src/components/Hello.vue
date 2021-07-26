<!--  -->
<template>
  <div>{{msg}}</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  components: {},
  props: {
    msg: String
  },
  setup(props) {
    return {};
  },
});
</script>
<style lang="scss" scoped></style>
