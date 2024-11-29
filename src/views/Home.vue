<template>
    <div class="container mt-5">
      <h1 class="text-center">Welcome to the Chat App</h1>
      <p class="text-center">
        <router-link to="/login">Login</router-link> or 
        <router-link to="/register">Register</router-link> to start chatting.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>