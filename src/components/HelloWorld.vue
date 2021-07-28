<!-- 单元测试 -->
<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo">
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo,index) in todos" :key="index">{{todo}}</li>
  </ul>
  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading</p>
  <div v-else class="userName" >{{user.data?.userName}}</div>
  <p v-if="user.error" class="error">error!</p>
  <Hello msg="1234" />
  <input class="upload" type="file" @change="upload">
  <span class="status status-loading" v-if="loadStatus==='loading'">正在上传</span>
  <span class="status status-success" v-else-if="loadStatus==='success'">上传成功</span>
  <span class="status" v-else>上传失败</span>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import axios from 'axios';
import Hello from "./Hello.vue";
type UploadStatus = "ready" | "loading" | "success" | "error";

export default defineComponent({
  name: "",
  components: {
    Hello,
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup(props,context) {
    const count = ref(1);
    const todo = ref('')
    const todos = ref<string[]>([])
    const user = reactive({
      data: null as any,
      loading: false,
      error: false,
    })
    const loadStatus = ref<UploadStatus>('ready')
    const setCount = () => {
      count.value++
    }
    const addTodo = () => {
      if(todo.value) {
        todos.value.push(todo.value)
        context.emit('send', todo.value)
      }
    }
    const loadUser = () => {
      user.loading = true
      axios.get('https:/ljsonplaceholder.typicode.com/users/1').then(res=>{
        console.log(res);
        user.data = res.data
      }).catch(() => {
        user.error = true
      }).finally(() => {
        user.loading = false
      }) 
    }
    const upload = () => {
      loadStatus.value = 'loading'
      axios.post('https:/ljsonplaceholder.typicode.com/users/1').then(res=>{
        console.log(res);
        loadStatus.value = 'success'

      }).catch(() => {
        loadStatus.value = 'error'
      })
    }
    return {
      count,
      todo,
      todos,
      setCount,
      addTodo,
      user,
      loadUser,
      upload,
      loadStatus
    };
  },
});
</script>
<style lang="scss" scoped></style>
