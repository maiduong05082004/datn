import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Gán Pusher vào window để sử dụng toàn cục (tuỳ chọn)
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'c944babeaf4cf6134005',  // App Key từ Pusher
  cluster: 'ap1',  // Cluster của Pusher
  wsHost: 'pusher.com',
  wsPort: 80,  // Port WebSocket không SSL (sẽ không sử dụng)
  wssPort: 443,
  forceTLS: true,  // Đảm bảo TLS bật nếu sử dụng HTTPS
  enabledTransports: ['http'],  // Chỉ sử dụng HTTP long-polling (Không dùng WebSocket)
  authEndpoint: 'http://localhost:8000/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json',
    },
  },
});

// Cấu hình kết nối Pusher và xử lý các trạng thái kết nối
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

// Hàm để tham gia vào một kênh và lắng nghe sự kiện
export const joinChannel = (channelName: string) => {
  // Tham gia vào kênh (private hoặc public)
  const channel = echo.channel(channelName);

  // Lắng nghe sự kiện MessageSent từ server
  channel.listen('MessageSent', (event: { message: string }) => {
    console.log('Message received:', event.message);
  });

  return channel;
};

// Ngắt kết nối khi cần thiết
export const disconnectEcho = () => {
  echo.disconnect();
};

export default echo;
