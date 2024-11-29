<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Register</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="username" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="email" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="password" 
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
              </form>
              <p class="text-center mt-3">
                Already have an account? 
                <router-link to="/login">Login</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../services/api'
  
  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        email: '',
        password: ''
      }
    },
    methods: {
      async handleRegister() {
        try {
          const response = await api.post('/auth/register', {
            username: this.username,
            email: this.email,
            password: this.password
          })
          
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data))
          
          this.$router.push('/chat')
        } catch (error) {
          alert(error.response?.data?.message || 'Registration failed')
        }
      }
    }
  }
  </script>