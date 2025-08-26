import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Top50userClaps() {
  const [limit, setLimit] = useState(50); // Default to 50 users
  const [timeFrame, setTimeFrame] = useState('all-time'); // Default to all time
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
  const [sortedUsers, setSortedUsers] = useState([]);
  
  // Mock data for claps
  const usersData = [
    { id: 1, name: 'Emma Wilson', email: 'emma@example.com', totalClaps: 762, thisWeek: 54, thisMonth: 145 },
    { id: 2, name: 'Robert Brown', email: 'robert@example.com', totalClaps: 691, thisWeek: 41, thisMonth: 132 },
    { id: 3, name: 'Liam Jones', email: 'liam@example.com', totalClaps: 645, thisWeek: 39, thisMonth: 120 },
    { id: 4, name: 'Olivia Davis', email: 'olivia@example.com', totalClaps: 567, thisWeek: 62, thisMonth: 124 },
    { id: 5, name: 'Noah Miller', email: 'noah@example.com', totalClaps: 534, thisWeek: 47, thisMonth: 118 },
    { id: 6, name: 'Sophia Martinez', email: 'sophia@example.com', totalClaps: 504, thisWeek: 37, thisMonth: 98 },
    { id: 7, name: 'Ethan Johnson', email: 'ethan@example.com', totalClaps: 481, thisWeek: 31, thisMonth: 87 },
    { id: 8, name: 'Ava Taylor', email: 'ava@example.com', totalClaps: 458, thisWeek: 42, thisMonth: 104 },
    { id: 9, name: 'Lucas Moore', email: 'lucas@example.com', totalClaps: 435, thisWeek: 28, thisMonth: 76 },
    { id: 10, name: 'Isabella Smith', email: 'isabella@example.com', totalClaps: 412, thisWeek: 32, thisMonth: 81 },
    { id: 11, name: 'Mason Anderson', email: 'mason@example.com', totalClaps: 392, thisWeek: 47, thisMonth: 94 },
    { id: 12, name: 'Emily Wilson', email: 'emily@example.com', totalClaps: 378, thisWeek: 26, thisMonth: 72 },
    { id: 13, name: 'Aiden Taylor', email: 'aiden@example.com', totalClaps: 359, thisWeek: 38, thisMonth: 87 },
    { id: 14, name: 'Charlotte Garcia', email: 'charlotte@example.com', totalClaps: 341, thisWeek: 19, thisMonth: 64 },
    { id: 15, name: 'Elijah Rodriguez', email: 'elijah@example.com', totalClaps: 328, thisWeek: 21, thisMonth: 69 },
  ];
  
  // Sort users based on selected time frame
  useEffect(() => {
    let sorted = [...usersData];
    
    if (timeFrame === 'all-time') {
      sorted.sort((a, b) => b.totalClaps - a.totalClaps);
    } else if (timeFrame === '7-days') {
      sorted.sort((a, b) => b.thisWeek - a.thisWeek);
    } else if (timeFrame === '30-days') {
      sorted.sort((a, b) => b.thisMonth - a.thisMonth);
    }
    
    // Limit the number of users
    setSortedUsers(sorted.slice(0, limit));
  }, [limit, timeFrame]);

  // Get the claps value based on selected time frame
  const getClapsValue = (user) => {
    if (timeFrame === 'all-time') return user.totalClaps;
    if (timeFrame === '7-days') return user.thisWeek;
    return user.thisMonth; // 30-days
  };

  // Handler for user click
  const handleUserClick = (userId) => {
    // Navigate to user profile or show details
    console.log(`Navigate to user profile: ${userId}`);
  };

  // Colors for chart bars
  const getBarColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-[#202031] p-4 sm:p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-medium text-white mb-3 sm:mb-0">Top Users by Claps</h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <label htmlFor="limit" className="text-sm text-gray-400 mr-2">Show:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
            >
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="timeFrame" className="text-sm text-gray-400 mr-2">Period:</label>
            <select
              id="timeFrame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
            >
              <option value="all-time">All Time</option>
              <option value="7-days">Last 7 Days</option>
              <option value="30-days">Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
              className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded flex items-center"
            >
              {viewMode === 'table' ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  Chart View
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path>
                  </svg>
                  Table View
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedUsers.slice(0, 10)} // Show only top 10 in chart for clarity
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: '#9ca3af' }} 
                label={{ value: 'Claps', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                labelStyle={{ color: '#f3f4f6' }}
                itemStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey={getClapsValue} name="Claps">
                {sortedUsers.slice(0, 10).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(index)}
                    onClick={() => handleUserClick(entry.id)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center text-sm text-gray-400 mt-2">
            Click on a bar to view user profile
          </div>
        </div>
      )}
      
      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          {/* Desktop/tablet table view */}
          <table className="hidden sm:table min-w-full bg-[#161625] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Claps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <button 
                      className="font-medium text-blue-400 hover:text-blue-300"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.name}
                    </button>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-right">
                    {getClapsValue(user)}
                    {timeFrame !== 'all-time' && (
                      <span className="text-xs text-gray-500 ml-1">({user.totalClaps} total)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Mobile view (cards) */}
          <div className="sm:hidden space-y-4">
            {sortedUsers.map((user, index) => (
              <div key={user.id} className="bg-[#161625] p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start">
                    <span className="text-gray-400 mr-2">#{index + 1}</span>
                    <button 
                      className="font-medium text-blue-400 hover:text-blue-300"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.name}
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">{getClapsValue(user)}</div>
                    {timeFrame !== 'all-time' && (
                      <div className="text-xs text-gray-500">{user.totalClaps} total</div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}