<template>
    <div class="message-input-container">
      <div v-if="isTyping" class="typing-indicator">
        {{ typingUser }} is typing...
      </div>
      <form @submit.prevent="sendMessage" class="message-form">
        <div class="input-group">
          <input 
            type="text" 
            v-model="message" 
            class="form-control" 
            placeholder="Type your message..."
            @input="handleTyping"
            :disabled="disabled"
          >
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!message.trim() || disabled"
          >
            <i class="bi bi-send"></i>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MessageInput',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      typingUser: {
        type: String,
        default: ''
      },
      isTyping: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        message: '',
        typingTimeout: null
      }
    },
    methods: {
      sendMessage() {
        if (this.message.trim()) {
          this.$emit('send-message', this.message);
          this.message = '';
          this.$emit('stop-typing');
        }
      },
      handleTyping() {
        this.$emit('typing');
        
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          this.$emit('stop-typing');
        }, 2000);
      }
    }
  }
  </script>
  
  <style scoped>
  .message-input-container {
    padding: 1rem;
    background: white;
    border-top: 1px solid #dee2e6;
  }
  
  .message-form {
    position: relative;
  }
  
  .typing-indicator {
    position: absolute;
    top: -20px;
    left: 1rem;
    font-size: 0.875rem;
    color: #6c757d;
  }
  
  .input-group {
    background: white;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .form-control {
    border: none;
    padding: 0.75rem 1rem;
  }
  
  .form-control:focus {
    box-shadow: none;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0;
  }
  
  .btn i {
    font-size: 1.2rem;
  }
  </style>