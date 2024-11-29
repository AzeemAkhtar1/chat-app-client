<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleLogin">
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
                <button type="submit" class="btn btn-primary w-100">Login</button>
              </form>
              <p class="text-center mt-3">
                Don't have an account? 
                <router-link to="/register">Register</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { authService } from '../services/api.service';

export default {
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: null
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.error = null;
        console.log('Attempting login with:', this.credentials);
        const response = await authService.login(this.credentials);
        console.log('Login successful:', response);
        this.$router.push('/chat');
      } catch (error) {
        console.error('Login failed:', error);
        this.error = error.response?.data?.message || 'Login failed. Please try again.';
      }
    }
  }
};
</script>