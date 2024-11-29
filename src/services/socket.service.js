import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io('http://localhost:5000', {
            auth: { token }
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    onInitialOnlineUsers(callback) {
        if (this.socket) {
            this.socket.on('initial_online_users', callback);
        }
    }

    onUserStatus(callback) {
        if (this.socket) {
            this.socket.on('user_status', callback);
        }
    }

    sendMessage(message) {
        if (this.socket) {
            this.socket.emit('send_message', message);
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.on('receive_message', callback);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketService();