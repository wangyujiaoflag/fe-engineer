<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserProfile } from '@/api/user'

const count = ref(0)
const username = ref('未登录')
const email = ref('邮箱')

onMounted(async () => {
  try {
    const data = await getUserProfile
    username.value = data?.name || '请求api出错'
    email.value = data?.email || '请求api出错'
  } finally {
    username.value = '请求api出错'
    email.value = '请求api出错'
  }
})
</script>

<template>
  <div class="hero">
    <div class="fetch">姓名： {{ username }}</div>
    <div class="fetch">邮箱： {{ email }}</div>
  </div>
  <button class="counter" @click="count++">Count is {{ count }}</button>
</template>
