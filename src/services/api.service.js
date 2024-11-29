import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chatService = {
    // Get all users
    async getUsers() {
        const response = await api.get('/chat/users');
        return response.data;
    },

    // Get conversation with specific user
    async getConversation(userId) {
        const response = await api.get(`/chat/messages/${userId}`);
        return response.data;
    },

    // Send message
    async sendMessage(content, receiverId) {
        const response = await api.post('/chat/messages', {
            content,
            receiver: receiverId
        });
        return response.data;
    }
};

export default api;