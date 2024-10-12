import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router } from 'react-router-dom'; // Nhập Router
import Routes from './routes'; // Đảm bảo đây là đúng tên import cho routes của bạn
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes /> {/* Sử dụng Routes ở đây */}
                <Toaster />
            </Router>
        </QueryClientProvider>
    );
}

export default App;