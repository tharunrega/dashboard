import React, { useState, useEffect } from 'react';

export default function UserStory() {
  // State for filters
  const [filters, setFilters] = useState({
    genre: '',
    ageGroup: '',
    status: '',
    userId: '',
    minLikes: '',
    maxLikes: '',
    dateRange: 'all',
    customStartDate: '',
    customEndDate: ''
  });
  
  // State for stories and filtered stories
  const [userStories, setUserStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(10);
  
  // State for expanded view
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  
  // State for the user search
  const [userSearch, setUserSearch] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sample user data
  const sampleUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", avatar: "/avatars/user1.jpg", storiesCount: 14 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", avatar: "/avatars/user2.jpg", storiesCount: 8 },
    { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", avatar: "/avatars/user3.jpg", storiesCount: 22 },
    { id: 4, name: "Emily Wilson", email: "emily.wilson@example.com", avatar: "/avatars/user4.jpg", storiesCount: 5 }
  ];
  
  // Sample user stories data
  const sampleUserStories = [
    {
      id: 1,
      title: "The Adventures of Space Cat",
      excerpt: "Follow Space Cat on an interstellar journey to save the galaxy from evil space mice.",
      content: "Once upon a time, in a galaxy far, far away, there lived a brave cat named Cosmo. Cosmo wasn't your ordinary house cat. With his specially designed space suit and unquenchable curiosity, he had become the most renowned explorer in the feline space program...",
      genre: "Science Fiction",
      ageGroup: "Children 5-8",
      status: "Published",
      createdAt: "2025-07-15T14:30:00",
      updatedAt: "2025-07-16T09:45:00",
      userId: 1,
      isAIGenerated: false,
      metrics: {
        likes: 254,
        views: 1873,
        completionRate: 82,
        avgReadTime: "4m 23s",
        comments: 37
      }
    },
    {
      id: 2,
      title: "The Mysterious Forest",
      excerpt: "Two friends discover a hidden forest with magical creatures and ancient secrets.",
      content: "Maya and Lucas were best friends who loved exploring. One sunny afternoon, while hiking near their grandparents' countryside home, they noticed something strange. A path they had never seen before appeared between two ancient oak trees...",
      genre: "Fantasy",
      ageGroup: "Children 9-12",
      status: "Published",
      createdAt: "2025-08-01T10:15:00",
      updatedAt: "2025-08-02T16:20:00",
      userId: 1,
      isAIGenerated: true,
      metrics: {
        likes: 187,
        views: 1245,
        completionRate: 74,
        avgReadTime: "5m 12s",
        comments: 25
      }
    },
    {
      id: 3,
      title: "The Little Submarine",
      excerpt: "A tiny yellow submarine explores the ocean depths and makes friends with sea creatures.",
      content: "Deep in the harbor of Portside Town, there was a little yellow submarine named Sunny. While all the big submarines went on important missions, Sunny was often left behind because of his small size. But Sunny had big dreams...",
      genre: "Adventure",
      ageGroup: "Toddler",
      status: "Draft",
      createdAt: "2025-07-28T09:30:00",
      updatedAt: "2025-07-28T09:30:00",
      userId: 1,
      isAIGenerated: false,
      metrics: {
        likes: 0,
        views: 0,
        completionRate: 0,
        avgReadTime: "0m 0s",
        comments: 0
      }
    }
  ];
  
  // Effect for initial data loading
  useEffect(() => {
    // In a real application, you would fetch data from your API here
    // setIsLoading(true);
    // fetch('/api/users')
    //   .then(response => response.json())
    //   .then(data => {
    //     setUsers(data);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     setError(error.message);
    //     setIsLoading(false);
    //   });
    
    // Using sample data for now
    setUserStories(sampleUserStories);
    setFilteredStories(sampleUserStories);
  }, []);
  
  // Effect for filtering stories
  useEffect(() => {
    if (!userStories.length) return;
    
    let filtered = [...userStories];
    
    // Filter by user ID if a user is selected
    if (selectedUser) {
      filtered = filtered.filter(story => story.userId === selectedUser.id);
    }
    
    // Apply other filters
    if (filters.genre) {
      filtered = filtered.filter(story => story.genre === filters.genre);
    }
    
    if (filters.ageGroup) {
      filtered = filtered.filter(story => story.ageGroup === filters.ageGroup);
    }
    
    if (filters.status) {
      filtered = filtered.filter(story => story.status === filters.status);
    }
    
    if (filters.minLikes) {
      filtered = filtered.filter(story => story.metrics.likes >= Number(filters.minLikes));
    }
    
    if (filters.maxLikes) {
      filtered = filtered.filter(story => story.metrics.likes <= Number(filters.maxLikes));
    }
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'custom':
          if (filters.customStartDate && filters.customEndDate) {
            startDate = new Date(filters.customStartDate);
            const endDate = new Date(filters.customEndDate);
            filtered = filtered.filter(story => {
              const storyDate = new Date(story.createdAt);
              return storyDate >= startDate && storyDate <= endDate;
            });
          }
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(story => new Date(story.createdAt) >= startDate);
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      if (sortConfig.key === 'likes') {
        valueA = a.metrics.likes;
        valueB = b.metrics.likes;
      } else if (sortConfig.key === 'views') {
        valueA = a.metrics.views;
        valueB = b.metrics.views;
      } else if (sortConfig.key === 'completionRate') {
        valueA = a.metrics.completionRate;
        valueB = b.metrics.completionRate;
      } else {
        valueA = a[sortConfig.key];
        valueB = b[sortConfig.key];
      }
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [userStories, filters, sortConfig, selectedUser]);
  
  // Handle search for users
  const handleUserSearch = (searchTerm) => {
    setUserSearch(searchTerm);
    
    if (!searchTerm.trim()) {
      setUserSearchResults([]);
      return;
    }
    
    // In a real app, this would be an API call
    const results = sampleUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setUserSearchResults(results);
  };
  
  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearch('');
    setUserSearchResults([]);
  };
  
  // Handle clearing the selected user
  const handleClearUser = () => {
    setSelectedUser(null);
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle story expansion toggle
  const handleStoryExpand = (id) => {
    setExpandedStoryId(expandedStoryId === id ? null : id);
  };
  
  // Pagination logic
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      genre: '',
      ageGroup: '',
      status: '',
      userId: '',
      minLikes: '',
      maxLikes: '',
      dateRange: 'all',
      customStartDate: '',
      customEndDate: ''
    });
    setSelectedUser(null);
  };
  
  // Get unique values for dropdown filters
  const genres = [...new Set(userStories.map(story => story.genre))];
  const ageGroups = [...new Set(userStories.map(story => story.ageGroup))];
  const statuses = [...new Set(userStories.map(story => story.status))];
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Stories</h1>
      
      {/* User Search Section */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-blue-400 mb-2">Find User Stories</h2>
        <div className="relative">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => handleUserSearch(e.target.value)}
            placeholder="Search for a user by name or email..."
            className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
          />
          {userSearchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-[#0a0a18] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {userSearchResults.map(user => (
                <div 
                  key={user.id} 
                  className="p-2 hover:bg-[#16162a] cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedUser && (
          <div className="mt-4 p-3 bg-[#0a0a18] rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{selectedUser.name}</div>
                  <div className="text-sm text-gray-400">{selectedUser.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{selectedUser.storiesCount} stories</span>
                <button
                  onClick={handleClearUser}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters Section */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-blue-400">Filters</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm mb-1">Genre</label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Age Group</label>
            <select
              name="ageGroup"
              value={filters.ageGroup}
              onChange={handleFilterChange}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="">All Age Groups</option>
              {ageGroups.map(ageGroup => (
                <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  name="customStartDate"
                  value={filters.customStartDate}
                  onChange={handleFilterChange}
                  className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  name="customEndDate"
                  value={filters.customEndDate}
                  onChange={handleFilterChange}
                  className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm mb-1">Min Likes</label>
            <input
              type="number"
              name="minLikes"
              value={filters.minLikes}
              onChange={handleFilterChange}
              placeholder="Min"
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Max Likes</label>
            <input
              type="number"
              name="maxLikes"
              value={filters.maxLikes}
              onChange={handleFilterChange}
              placeholder="Max"
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Stories Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0a0a18]">
            <thead className="bg-[#16162a]">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('genre')}
                >
                  Genre {sortConfig.key === 'genre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left">Age Group</th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer"
                  onClick={() => handleSort('likes')}
                >
                  Likes {sortConfig.key === 'likes' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer"
                  onClick={() => handleSort('views')}
                >
                  Views {sortConfig.key === 'views' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStories.length > 0 ? (
                currentStories.map(story => (
                  <React.Fragment key={story.id}>
                    <tr className="border-b border-gray-800 hover:bg-[#16162a]">
                      <td className="py-3 px-4">
                        <div className="font-medium">{story.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{story.excerpt}</div>
                      </td>
                      <td className="py-3 px-4">{story.genre}</td>
                      <td className="py-3 px-4">{story.ageGroup}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          story.status === 'Published' ? 'bg-green-900 text-green-200' :
                          story.status === 'Draft' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-gray-900 text-gray-200'
                        }`}>
                          {story.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {story.metrics.likes}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {story.metrics.views}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleStoryExpand(story.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded mr-2"
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                          title="Edit Story"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded story details */}
                    {expandedStoryId === story.id && (
                      <tr className="bg-[#0a0a18]">
                        <td colSpan="8" className="py-4 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                              <p className="text-gray-300 mb-4">{story.content.substring(0, 300)}...</p>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-sm text-gray-400">Created</p>
                                  <p>{new Date(story.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">Updated</p>
                                  <p>{new Date(story.updatedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">Source</p>
                                  <p>{story.isAIGenerated ? 'AI Generated' : 'User Created'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400">Comments</p>
                                  <p>{story.metrics.comments}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-gray-400">PERFORMANCE METRICS</h4>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Views</span>
                                    <span className="text-sm font-medium">{story.metrics.views}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(story.metrics.views / 20, 100)}%` }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Likes</span>
                                    <span className="text-sm font-medium">{story.metrics.likes}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(story.metrics.likes / 5, 100)}%` }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Completion Rate</span>
                                    <span className="text-sm font-medium">{story.metrics.completionRate}%</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${story.metrics.completionRate}%` }}></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Avg. Read Time</span>
                                    <span className="text-sm font-medium">{story.metrics.avgReadTime}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <button 
                                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                                  onClick={() => alert(`View full story: ${story.title}`)}
                                >
                                  View Full Story
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading stories...
                      </div>
                    ) : error ? (
                      <div>
                        <p>Error loading stories: {error}</p>
                        <button 
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => window.location.reload()}
                        >
                          Retry
                        </button>
                      </div>
                    ) : selectedUser ? (
                      <div>
                        <p>No stories found for this user.</p>
                      </div>
                    ) : (
                      <div>
                        <p>No stories match your filters.</p>
                        <button 
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                          onClick={resetFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredStories.length > 0 && totalPages > 1 && (
          <div className="py-3 px-4 bg-[#16162a] flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstStory + 1}-{Math.min(indexOfLastStory, filteredStories.length)} of {filteredStories.length} stories
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                &laquo;
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                // Show limited page buttons with ellipsis for large page counts
                const pageNum = index + 1;
                
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) ||
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNum} className="px-1">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
