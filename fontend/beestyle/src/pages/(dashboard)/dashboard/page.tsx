import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const barChartData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 50 },
    { name: "Mar", value: 40 },
    { name: "Apr", value: 70 },
    { name: "May", value: 60 },
    { name: "Jun", value: 80 },
    { name: "Jul", value: 100 },
    { name: "Aug", value: 90 },
    { name: "Sep", value: 50 },
  ];

  const pieChartData = [
    { name: "Desktop", value: 35 },
    { name: "Tablet", value: 48 },
    { name: "Mobile", value: 27 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-800 p-8 text-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-black text-xl">
            Welcome back, <b>Jhon Anderson</b>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Today's Sales</h2>
          <p className="text-4xl font-bold mt-4">$65.4K</p>
          <p className="text-green-400 mt-2">+78.4% Growth</p>
        </div>
        <div className="bg-indigo-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Active Users</h2>
          <p className="text-4xl font-bold mt-4">42.5K</p>
          <p className="text-green-400 mt-2">+12.5% from last month</p>
        </div>
        <div className="bg-indigo-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Total Users</h2>
          <p className="text-4xl font-bold mt-4">97.4K</p>
          <p className="text-green-400 mt-2">+15.5% Growth</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Bar Chart */}
        <div className="bg-indigo-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" tick={{ fill: "#FFFFFF" }} />
              <YAxis tick={{ fill: "#FFFFFF" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-indigo-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Device Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-4">
            {pieChartData.map((entry, index) => (
              <li
                key={`legend-${index}`}
                className="flex items-center text-sm text-gray-200"
              >
                <span
                  className="w-3 h-3 mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {entry.name}: {entry.value}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
