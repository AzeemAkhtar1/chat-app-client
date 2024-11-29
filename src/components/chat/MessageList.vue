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
             :class="{ 
               'message-own': isOwnMessage(msg),
               'message-other': !isOwnMessage(msg)
             }">
          <div class="message-content">
            <div class="message-sender" v-if="!isOwnMessage(msg)">
              {{ msg.sender.username }}
            </div>
            <div class="message-text">{{ msg.content }}</div>
            <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
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
    isOwnMessage(message) {
      return message.sender._id === this.currentUser.id || 
             message.sender === this.currentUser.id;
    },
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
    }
  },
  updated() {
    // Scroll to bottom when new messages arrive
    this.$nextTick(() => {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
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
  max-width: 70%;
  margin: 0.5rem 0;
}

.message-own {
  margin-left: auto;
}

.message-other {
  margin-right: auto;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.message-own .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-other .message-content {
  background: white;
  color: #212529;
  border-bottom-left-radius: 0.25rem;
}

.message-sender {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #6c757d;
}

.message-text {
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: right;
}

.message-own .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-other .message-time {
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

.no-messages {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}
</style>