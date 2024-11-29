<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Chat App</router-link>
      <div class="navbar-nav ms-auto">
        <template v-if="!isLoggedIn">
          <router-link class="nav-link" to="/login">Login</router-link>
          <router-link class="nav-link" to="/register">Register</router-link>
        </template>
        <a v-else @click="logout" class="nav-link" style="cursor: pointer">Logout</a>
      </div>
    </div>
  </nav>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  margin-bottom: 2rem;
}
</style>
