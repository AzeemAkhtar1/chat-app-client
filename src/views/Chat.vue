<template>
    <div class="chat-container">
      <div class="row g-0 h-100">
        <!-- Conversation List -->
        <div class="col-md-4 col-lg-3 border-end">
          <ConversationList 
            :users="users"
            :selectedUser="selectedUser"
            @select-user="selectUser"
          />
        </div>
  
        <!-- Chat Area -->
        <div class="col-md-8 col-lg-9">
          <div v-if="selectedUser" class="chat-area">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="d-flex align-items-center">
                <div class="avatar">
                  {{ selectedUser.username.charAt(0).toUpperCase() }}
                </div>
                <div class="ms-3">
                  <h5 class="mb-0">{{ selectedUser.username }}</h5>
                  <small class="text-muted">
                    {{ selectedUser.isOnline ? 'Online' : 'Offline' }}
                  </small>
                </div>
              </div>
            </div>
  
            <!-- Messages -->
            <MessageList 
              :messages="currentConversation" 
              :currentUser="currentUser"
            />
  
            <!-- Message Input -->
            <MessageInput 
              @send-message="sendMessage" 
              :disabled="!selectedUser"
            />
          </div>
  
          <!-- No Conversation Selected -->
          <div v-else class="no-conversation">
            <div class="text-center text-muted">
              <i class="bi bi-chat-dots" style="font-size: 3rem;"></i>
              <h4 class="mt-3">Select a conversation</h4>
              <p>Choose a user from the list to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ConversationList from '../components/chat/ConversationList.vue'
  import MessageList from '../components/chat/MessageList.vue'
  import MessageInput from '../components/chat/MessageInput.vue'
  import socketService from '../services/socket.service'
  import { chatService } from '../services/api.service'
  
  export default {
    name: 'Chat',
    components: {
      ConversationList,
      MessageList,
      MessageInput
    },
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('user')),
        users: [],
        selectedUser: null,
        currentConversation: []
      }
    },
    async created() {
      await this.loadUsers()
      this.initializeSocket()
    },
    methods: {
      async loadUsers() {
        try {
          const users = await chatService.getUsers()
          this.users = users.map(user => ({
            ...user,
            isOnline: false
          }))
          console.log('Loaded users:', this.users)
        } catch (error) {
          console.error('Error loading users:', error)
        }
      },
      
      async selectUser(user) {
        this.selectedUser = user
        await this.loadConversation(user._id)
      },
      async loadConversation(userId) {
        try {
          const messages = await chatService.getConversation(userId)
          this.currentConversation = messages
          console.log('Loaded conversation:', messages)
        } catch (error) {
          console.error('Error loading conversation:', error)
        }
      },
      async sendMessage(content) {
        if (!this.selectedUser) return
  
        try {
          const message = await chatService.sendMessage(content, this.selectedUser._id)
          this.currentConversation.push(message)
          socketService.sendMessage({
            ...message,
            receiver: this.selectedUser._id
          })
        } catch (error) {
          console.error('Error sending message:', error)
        }
      },
      initializeSocket() {
        const token = localStorage.getItem('token')
        socketService.connect(token)
  
        socketService.onMessage((message) => {
          if (this.selectedUser && 
              (message.sender === this.selectedUser._id || 
               message.receiver === this.selectedUser._id)) {
            this.currentConversation.push(message)
          }
        })
  
        socketService.onUserStatus(({ userId, isOnline }) => {
          const user = this.users.find(u => u._id === userId)
          if (user) {
            user.isOnline = isOnline
          }
        })
      }
    },
    beforeUnmount() {
      socketService.disconnect()
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    height: calc(100vh - 56px);
    background-color: white;
  }
  
  .chat-area {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
  }
  
  .no-conversation {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
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
  }
  </style>