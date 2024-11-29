<template>
    <div class="message-container" ref="messageContainer">
      <div class="messages-wrapper">
        <div v-if="messages.length === 0" class="no-messages text-center text-muted">
          <p>No messages yet. Start the conversation!</p>
        </div>
        
        <div v-for="(message, index) in groupedMessages" :key="index" class="message-group">
          <div class="message-date text-center text-muted small mb-3">
            {{ formatDate(message.date) }}
          </div>
          
          <div v-for="msg in message.messages" 
               :key="msg._id" 
               class="message"
               :class="{ 'message-own': msg.sender === currentUser.id }">
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-info">
                <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
                <span v-if="msg.sender === currentUser.id" class="message-status">
                  <i class="bi bi-check2" v-if="msg.status === 'sent'"></i>
                  <i class="bi bi-check2-all" v-if="msg.status === 'delivered'"></i>
                  <i class="bi bi-check2-all text-primary" v-if="msg.status === 'read'"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MessageList',
    props: {
      messages: {
        type: Array,
        default: () => []
      },
      currentUser: {
        type: Object,
        required: true
      }
    },
    computed: {
      groupedMessages() {
        const groups = [];
        let currentDate = null;
        let currentGroup = null;
  
        this.messages.forEach(message => {
          const messageDate = new Date(message.createdAt).toDateString();
          
          if (messageDate !== currentDate) {
            currentDate = messageDate;
            currentGroup = {
              date: message.createdAt,
              messages: []
            };
            groups.push(currentGroup);
          }
          
          currentGroup.messages.push(message);
        });
  
        return groups;
      }
    },
    methods: {
      formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
  
        if (date.toDateString() === today.toDateString()) {
          return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString();
        }
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.messageContainer;
          container.scrollTop = container.scrollHeight;
        });
      }
    },
    watch: {
      messages: {
        handler() {
          this.scrollToBottom();
        },
        deep: true
      }
    }
  }
  </script>
  
  <style scoped>
  .message-container {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: #f8f9fa;
  }
  
  .messages-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .message {
    max-width: 75%;
    margin: 0.5rem 0;
  }
  
  .message-own {
    margin-left: auto;
  }
  
  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    background: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    position: relative;
  }
  
  .message-own .message-content {
    background: #007bff;
    color: white;
  }
  
  .message-text {
    margin-bottom: 0.25rem;
    word-break: break-word;
  }
  
  .message-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .message-own .message-info {
    justify-content: flex-end;
  }
  
  .message-status {
    display: flex;
    align-items: center;
  }
  
  .no-messages {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
  }
  
  .message-date {
    position: sticky;
    top: 0;
    background: rgba(248, 249, 250, 0.9);
    padding: 0.5rem;
    z-index: 1;
    margin: 1rem 0;
  }
  </style>