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
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import axios from 'axios';
import Hello from "./Hello.vue";
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
    return {
      count,
      todo,
      todos,
      setCount,
      addTodo,
      user,
      loadUser
    };
  },
});
</script>
<style lang="scss" scoped></style>
