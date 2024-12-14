import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Users, 
  CreditCard, 
  Bell, 
  Search, 
  ChevronDown, 
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Briefcase,
  BarChart2
} from 'lucide-react';

const AdvancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const statsData = [
    { 
      icon: TrendingUp, 
      title: 'Total Revenue', 
      value: '$124,763', 
      change: '+12.5%', 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      icon: Users, 
      title: 'New Customers', 
      value: '2,543', 
      change: '+15.3%', 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      icon: ShoppingCart, 
      title: 'Total Orders', 
      value: '1,256', 
      change: '+8.7%', 
      color: 'bg-purple-100 text-purple-600' 
    },
    { 
      icon: DollarSign, 
      title: 'Pending Payouts', 
      value: '$45,231', 
      change: '-2.5%', 
      color: 'bg-orange-100 text-orange-600' 
    }
  ];

  const recentActivities = [
    {
      user: 'Alex Johnson',
      action: 'Completed project milestone',
      time: '5 mins ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      user: 'Emma Wilson',
      action: 'Submitted quarterly report',
      time: '1 hour ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      user: 'Michael Chen',
      action: 'Started new marketing campaign',
      time: '3 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
    }
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {statsData.map(({ icon: Icon, title, value, change, color }) => (
            <div 
              key={title} 
              className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition"
            >
              <div className={`w-12 h-12 rounded-full ${color} mb-4 flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{value}</h3>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">{title}</p>
                <span className={`
                  text-sm font-semibold 
                  ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}
                `}>
                  {change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map(({ user, action, time, avatar }) => (
              <div 
                key={user} 
                className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition"
              >
                <div className="flex items-center">
                  <img 
                    src={avatar} 
                    alt={user} 
                    className="w-10 h-10 rounded-full mr-4" 
                  />
                  <div>
                    <p className="font-semibold">{user}</p>
                    <p className="text-gray-500 text-sm">{action}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;