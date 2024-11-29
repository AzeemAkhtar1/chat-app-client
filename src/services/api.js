import axios from 'axios'

const api = axios.create({
  baseURL: 'https://chat-app-server-production-98cb.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api