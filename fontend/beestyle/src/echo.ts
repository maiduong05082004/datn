import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Đặt Pusher làm global trên window
window.Pusher = Pusher;

// Cấu hình Laravel Echo
const echo = new Echo({
  broadcaster: 'pusher',
  key: 'c944babeaf4cf6134005', // Thêm trực tiếp App Key
  cluster: 'ap1', // Cluster của bạn
  wsHost: `ws-ap1.pusher.com`, // Host WebSocket của Pusher
  wsPort: 80, // Port WebSocket không SSL
  wssPort: 443, // Port WebSocket SSL
  forceTLS: true, // Bắt buộc sử dụng TLS (HTTPS)
  enabledTransports: ['ws', 'wss'], // Chỉ sử dụng WebSocket
  authEndpoint: 'http://localhost:8000/broadcasting/auth', // Endpoint xác thực của Laravel
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm Bearer token để xác thực
    },
  },
});


// **Debug Pusher Logs**
// Ghi log trạng thái kết nối Pusher
window.Pusher.logToConsole = true;

echo.connector.pusher.connection.bind('connected', () => {
  console.log('Pusher connected successfully!');
});

echo.connector.pusher.connection.bind('state_change', (states: any) => {
  console.log('Pusher connection state changed:', states);
});

echo.connector.pusher.connection.bind('error', (error: any) => {
  console.error('Pusher connection error:', error);
});

echo.connector.pusher.connection.bind('disconnected', () => {
  console.warn('Pusher disconnected!');
});

export default echo;

