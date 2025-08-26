import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Top50userStory() {
  const [limit, setLimit] = useState(50);
  const [timeFrame, setTimeFrame] = useState('today'); // Default to today
  const [viewMode, setViewMode] = useState('table');
  const [sortedUsers, setSortedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Date filter state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Today's date by default
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock data for stories (in real app, replace with API call)
  const usersData = [
    { id: 1, name: 'John Smith', email: 'john@example.com', totalStories: 89, thisWeek: 3, thisMonth: 12 },
    { id: 2, name: 'Sophia Lee', email: 'sophia@example.com', totalStories: 76, thisWeek: 5, thisMonth: 14 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', totalStories: 72, thisWeek: 2, thisMonth: 8 },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', totalStories: 68, thisWeek: 4, thisMonth: 11 },
    { id: 5, name: 'William Jones', email: 'william@example.com', totalStories: 65, thisWeek: 3, thisMonth: 9 },
    { id: 6, name: 'Olivia Martin', email: 'olivia@example.com', totalStories: 61, thisWeek: 2, thisMonth: 7 },
    { id: 7, name: 'James Johnson', email: 'james@example.com', totalStories: 57, thisWeek: 3, thisMonth: 8 },
    { id: 8, name: 'Ava Garcia', email: 'ava@example.com', totalStories: 54, thisWeek: 4, thisMonth: 10 },
    { id: 9, name: 'Alexander Miller', email: 'alex@example.com', totalStories: 51, thisWeek: 2, thisMonth: 6 },
    { id: 10, name: 'Charlotte Davis', email: 'charlotte@example.com', totalStories: 49, thisWeek: 3, thisMonth: 8 },
    { id: 11, name: 'Benjamin Rodriguez', email: 'ben@example.com', totalStories: 47, thisWeek: 1, thisMonth: 5 },
    { id: 12, name: 'Mia Martinez', email: 'mia@example.com', totalStories: 45, thisWeek: 2, thisMonth: 7 },
    { id: 13, name: 'Ethan Anderson', email: 'ethan@example.com', totalStories: 44, thisWeek: 3, thisMonth: 6 },
    { id: 14, name: 'Abigail Taylor', email: 'abigail@example.com', totalStories: 42, thisWeek: 1, thisMonth: 4 },
    { id: 15, name: 'Daniel Thomas', email: 'daniel@example.com', totalStories: 40, thisWeek: 2, thisMonth: 6 },
  ];
  
  useEffect(() => {
    // In a real app, fetch data from API with pagination
    const fetchUserStories = async () => {
      try {
        setLoading(true);
        // Example API call:
        // const response = await fetch(
        //   `/api/user-stories?page=${currentPage}&limit=${itemsPerPage}&startDate=${startDate}&endDate=${endDate}&timeFrame=${timeFrame}`
        // );
        // const data = await response.json();
        // setSortedUsers(data.users);
        // setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
        
        // For demo, use mock data
        let sorted = [...usersData];
        
        if (timeFrame === 'today') {
          sorted.sort((a, b) => b.thisWeek - a.thisWeek); // Use thisWeek as a proxy for today in mock data
        } else if (timeFrame === 'all-time') {
          sorted.sort((a, b) => b.totalStories - a.totalStories);
        } else if (timeFrame === '7-days') {
          sorted.sort((a, b) => b.thisWeek - a.thisWeek);
        } else if (timeFrame === '30-days') {
          sorted.sort((a, b) => b.thisMonth - a.thisMonth);
        }
        
        // Calculate total pages
        const totalItems = sorted.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = sorted.slice(startIndex, startIndex + itemsPerPage);
        setSortedUsers(paginatedUsers);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user stories:", err);
        setError("Failed to load user story data");
        setLoading(false);
      }
    };
    
    fetchUserStories();
  }, [currentPage, itemsPerPage, startDate, endDate, timeFrame]);

  // Get the stories value based on selected time frame
  const getStoriesValue = (user) => {
    if (timeFrame === 'today') return user.thisWeek; // Use thisWeek as proxy for today in mock data
    if (timeFrame === 'all-time') return user.totalStories;
    if (timeFrame === '7-days') return user.thisWeek;
    return user.thisMonth; // 30-days
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Date filter handlers
  const handleDateFilterApply = () => {
    setCurrentPage(1); // Reset to first page when filter changes
    // In a real app, this would trigger data fetch with new dates
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
        <h2 className="text-xl font-medium text-white mb-3 sm:mb-0">Top Users by Story Count</h2>
        
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
              <option value="today">Today</option>
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
      
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
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
                    label={{ value: 'Stories', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                    labelStyle={{ color: '#f3f4f6' }}
                    itemStyle={{ color: '#d1d5db' }}
                  />
                  <Bar dataKey={getStoriesValue} name="Stories">
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
                    <th className="px-4 py-3 text-right">Stories</th>
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
                        {getStoriesValue(user)}
                        {timeFrame !== 'all-time' && (
                          <span className="text-xs text-gray-500 ml-1">({user.totalStories} total)</span>
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
                        <div className="text-lg">{getStoriesValue(user)}</div>
                        {timeFrame !== 'all-time' && (
                          <div className="text-xs text-gray-500">{user.totalStories} total</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}