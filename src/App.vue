<script setup lang="ts"></script>

<template>
  <div class="nav">
    <router-link to="/">go to home</router-link>
    <router-link to="/test">go to test</router-link>
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</template>
