import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        const SOCKET_URL = process.env.VUE_APP_SOCKET_URL || 'http://localhost:5000';
        
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
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