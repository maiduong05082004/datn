import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000'); // Thay bằng URL của server socket.io của bạn
