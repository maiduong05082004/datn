import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

const queryClient = new QueryClient();

// Tìm phần tử DOM gốc
const rootElement = document.getElementById('root');

// Tạo createRoot
const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Sử dụng phương thức render với createRoot
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
