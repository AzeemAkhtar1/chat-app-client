<template>
    <div class="conversation-list">
      <div class="search-box mb-3">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search users..."
          v-model="searchQuery"
        >
      </div>
      
      <div class="users-list">
        <div 
          v-for="user in filteredUsers" 
          :key="user._id"
          class="user-item"
          :class="{ 'active': selectedUser?._id === user._id }"
          @click="selectUser(user)"
        >
          <div class="avatar">
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          <div class="user-info">
            <div class="username">{{ user.username }}</div>
            <div class="last-message text-muted small">
              {{ user.lastMessage || 'Start a conversation' }}
            </div>
          </div>
          <div class="status-dot" :class="{ 'online': user.isOnline }"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConversationList',
    props: {
      users: {
        type: Array,
        default: () => []
      },
      selectedUser: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        searchQuery: ''
      }
    },
    computed: {
      filteredUsers() {
        return this.users.filter(user => 
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
    },
    methods: {
      selectUser(user) {
        this.$emit('select-user', user)
      }
    }
  }
  </script>
  
  <style scoped>
  .conversation-list {
    height: calc(100vh - 100px);
    border-right: 1px solid #dee2e6;
    padding: 1rem;
  }
  
  .user-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 0.5rem;
    transition: background-color 0.2s;
  }
  
  .user-item:hover {
    background-color: #f8f9fa;
  }
  
  .user-item.active {
    background-color: #e9ecef;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
  }
  
  .user-info {
    flex: 1;
  }
  
  .username {
    font-weight: 500;
  }
  
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #dee2e6;
  }
  
  .status-dot.online {
    background-color: #28a745;
  }
  
  .search-box {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  </style>