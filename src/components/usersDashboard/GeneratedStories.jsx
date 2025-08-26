import React, { useState, useEffect } from 'react';

export default function GeneratedStories({ selectedDate }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  
  // Filters
  const [filter, setFilter] = useState('recent'); // 'recent', 'frequent', 'inactive'
  const [dateRange, setDateRange] = useState('today'); // 'today', 'week', 'month', 'custom'
  const [startDate, setStartDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mock data for generated stories
  const mockStories = [
    {
      id: 1,
      title: "The Enchanted Forest",
      creator: {
        id: 101,
        name: "Emma Wilson",
        email: "emma@example.com",
        lastActive: "2023-08-11T15:30:00",
        storiesCount: 12
      },
      createdAt: "2023-08-10T09:25:00",
      genre: "Fantasy",
      ageGroup: "Children",
      metrics: {
        views: 245,
        likes: 56,
        completionRate: 78
      },
      children: [
        {
          id: 101,
          title: "The Magical Creatures",
          createdAt: "2023-08-10T10:15:00",
          metrics: {
            views: 120,
            likes: 34
          }
        },
        {
          id: 102,
          title: "The Hidden Treasure",
          createdAt: "2023-08-10T11:05:00",
          metrics: {
            views: 98,
            likes: 27
          }
        }
      ]
    },
    // Add more mock data as needed
  ];
  
  useEffect(() => {
    const fetchGeneratedStories = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from API with proper parameters
        // const response = await fetch(
        //   `/api/generated-stories?page=${currentPage}&limit=${itemsPerPage}&filter=${filter}&dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`
        // );
        // const data = await response.json();
        // setStories(data.stories);
        // setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
        
        // For demo, filter mock data based on parameters
        let filteredStories = [...mockStories];
        
        // Apply filter type
        if (filter === 'recent') {
          filteredStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filter === 'frequent') {
          filteredStories.sort((a, b) => b.creator.storiesCount - a.creator.storiesCount);
        } else if (filter === 'inactive') {
          // Sort by lastActive date ascending (oldest first)
          filteredStories.sort((a, b) => 
            new Date(a.creator.lastActive) - new Date(b.creator.lastActive)
          );
        }
        
        // Apply date filters
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59); // Include all entries on the end date
        
        filteredStories = filteredStories.filter(story => {
          const storyDate = new Date(story.createdAt);
          return storyDate >= start && storyDate <= end;
        });
        
        // Set total pages based on filtered results
        const totalFilteredItems = filteredStories.length;
        setTotalPages(Math.ceil(totalFilteredItems / itemsPerPage));
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedStories = filteredStories.slice(startIndex, startIndex + itemsPerPage);
        
        setTimeout(() => {
          setStories(paginatedStories);
          setLoading(false);
        }, 500); // Simulate API delay
        
      } catch (err) {
        console.error("Error fetching generated stories:", err);
        setError("Failed to load generated stories data");
        setLoading(false);
      }
    };
    
    fetchGeneratedStories();
  }, [currentPage, itemsPerPage, filter, dateRange, startDate, endDate, mockStories]);
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page
  };
  
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    setCurrentPage(1); // Reset to first page
    
    // Set appropriate date range
    const today = new Date();
    if (e.target.value === 'today') {
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (e.target.value === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      setStartDate(weekAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (e.target.value === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(today.getDate() - 30);
      setStartDate(monthAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };
  
  const handleCustomDateChange = () => {
    setCurrentPage(1); // Reset to first page
    // Date inputs already update state, so we just need to apply the filter
  };
  
  const toggleExpandStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-[#202031] p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-medium text-white mb-3 sm:mb-0">Generated Stories</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Filter buttons */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => handleFilterChange('recent')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${filter === 'recent' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Recent Creators
            </button>
            <button
              onClick={() => handleFilterChange('frequent')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'frequent' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Frequent Creators
            </button>
            <button
              onClick={() => handleFilterChange('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${filter === 'inactive' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Inactive Users
            </button>
          </div>
          
          {/* Date range selector */}
          <div className="flex items-center">
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {/* Custom date range */}
          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-2 py-1"
              />
              <button
                onClick={handleCustomDateChange}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded"
              >
                Apply
              </button>
            </div>
          )}
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
          {/* Stories Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Genre</th>
                  <th className="px-4 py-3">Age Group</th>
                  <th className="px-4 py-3 text-center">Views</th>
                  <th className="px-4 py-3 text-center">Likes</th>
                  <th className="px-4 py-3 text-center">Children</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stories.map((story) => (
                  <React.Fragment key={story.id}>
                    <tr className="text-gray-300 text-sm hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 font-medium">{story.title}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-blue-400">{story.creator.name}</div>
                          <div className="text-xs text-gray-500">{story.creator.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatDate(story.createdAt)}</td>
                      <td className="px-4 py-3">{story.genre}</td>
                      <td className="px-4 py-3">{story.ageGroup}</td>
                      <td className="px-4 py-3 text-center">{story.metrics.views}</td>
                      <td className="px-4 py-3 text-center">{story.metrics.likes}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleExpandStory(story.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center mx-auto"
                        >
                          {story.children.length}
                          <svg className={`w-4 h-4 ml-1 transform transition-transform ${expandedStoryId === story.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Child Stories */}
                    {expandedStoryId === story.id && story.children.map((child) => (
                      <tr key={child.id} className="bg-[#1a1a2e] text-gray-400 text-sm">
                        <td className="px-4 py-2 pl-10">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {child.title}
                          </div>
                        </td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2">{formatDate(child.createdAt)}</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2 text-center">{child.metrics.views}</td>
                        <td className="px-4 py-2 text-center">{child.metrics.likes}</td>
                        <td className="px-4 py-2"></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                
                {stories.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      No generated stories found for the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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