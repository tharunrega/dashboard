import React, { useState, useEffect } from 'react';

export default function StoryImport() {
  // State for filters
  const [filters, setFilters] = useState({
    genre: '',
    ageGroup: '',
    inspiredBy: '',
    status: '',
    minLikes: '',
    maxLikes: '',
    minCompletionRate: '',
    maxCompletionRate: '',
    minReadTime: '',
    maxReadTime: '',
    minViews: '',
    maxViews: ''
  });
  
  // State for stories and filtered stories
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  
  // State for expanded rows (mobile view)
  const [expandedRows, setExpandedRows] = useState({});
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  
  // Mock data for stories
  const mockStories = [
    {
      id: 1,
      title: "The Lost City of Atlantis",
      content: "Deep beneath the ocean's surface, a civilization thrives...",
      truncatedContent: "Deep beneath the ocean's surface...",
      ageGroup: "Young Adult",
      genre: "Fantasy",
      inspiredBy: "Greek mythology",
      status: "Published",
      createdAt: "2023-08-02 10:45:12",
      metrics: {
        views: 1245,
        avgReadTime: "4m 32s",
        completionRate: 78,
        likes: 342,
        claps: 573,
        bookmarks: 98
      }
    },
    {
      id: 2,
      title: "Echoes of the Past",
      content: "Sarah returned to her childhood home, memories flooding back...",
      truncatedContent: "Sarah returned to her childhood home...",
      ageGroup: "Adult",
      genre: "Drama",
      inspiredBy: "Personal experience",
      status: "Published",
      createdAt: "2023-07-28 14:22:08",
      metrics: {
        views: 876,
        avgReadTime: "6m 12s",
        completionRate: 65,
        likes: 203,
        claps: 418,
        bookmarks: 56
      }
    },
    {
      id: 3,
      title: "Beyond the Stars",
      content: "Captain Lora navigated the spaceship through asteroid fields...",
      truncatedContent: "Captain Lora navigated the spaceship...",
      ageGroup: "Teen",
      genre: "Science Fiction",
      inspiredBy: "Star Trek",
      status: "Published",
      createdAt: "2023-07-25 09:10:45",
      metrics: {
        views: 1532,
        avgReadTime: "5m 45s",
        completionRate: 82,
        likes: 472,
        claps: 890,
        bookmarks: 127
      }
    },
    {
      id: 4,
      title: "When Shadows Fall",
      content: "Detective Marcus knew this wasn't a typical case...",
      truncatedContent: "Detective Marcus knew this wasn't...",
      ageGroup: "Adult",
      genre: "Mystery",
      inspiredBy: "Noir Films",
      status: "Published",
      createdAt: "2023-07-18 17:35:22",
      metrics: {
        views: 987,
        avgReadTime: "8m 20s",
        completionRate: 73,
        likes: 245,
        claps: 402,
        bookmarks: 89
      }
    },
    {
      id: 5,
      title: "Castle by the Sea",
      content: "A gentle breeze carried the scent of salt and memories...",
      truncatedContent: "A gentle breeze carried the scent...",
      ageGroup: "Young Adult",
      genre: "Romance",
      inspiredBy: "Victorian novels",
      status: "Under review",
      createdAt: "2023-07-15 11:28:17",
      metrics: {
        views: 645,
        avgReadTime: "7m 10s",
        completionRate: 58,
        likes: 187,
        claps: 310,
        bookmarks: 62
      }
    },
    {
      id: 6,
      title: "Whispers in the Wind",
      content: "The old forest held secrets that spanned generations...",
      truncatedContent: "The old forest held secrets...",
      ageGroup: "Teen",
      genre: "Mystery",
      inspiredBy: "Folk tales",
      status: "Draft",
      createdAt: "2023-07-10 14:05:33",
      metrics: {
        views: 0,
        avgReadTime: "0m 0s",
        completionRate: 0,
        likes: 0,
        claps: 0,
        bookmarks: 0
      }
    },
    {
      id: 7,
      title: "Legacy of the Dragons",
      content: "When the ancient dragons returned to the valley...",
      truncatedContent: "When the ancient dragons returned...",
      ageGroup: "Young Adult",
      genre: "Fantasy",
      inspiredBy: "Medieval legends",
      status: "Published",
      createdAt: "2023-07-05 16:42:51",
      metrics: {
        views: 2145,
        avgReadTime: "9m 25s",
        completionRate: 86,
        likes: 578,
        claps: 1024,
        bookmarks: 201
      }
    },
    {
      id: 8,
      title: "First Steps on Mars",
      content: "The colony ship landed gently on the red planet's surface...",
      truncatedContent: "The colony ship landed gently...",
      ageGroup: "Teen",
      genre: "Science Fiction",
      inspiredBy: "NASA missions",
      status: "Published",
      createdAt: "2023-06-28 08:17:09",
      metrics: {
        views: 1876,
        avgReadTime: "6m 42s",
        completionRate: 71,
        likes: 412,
        claps: 756,
        bookmarks: 143
      }
    },
    {
      id: 9,
      title: "The Secret Garden Door",
      content: "Emily discovered the hidden door behind the ivy...",
      truncatedContent: "Emily discovered the hidden door...",
      ageGroup: "Children",
      genre: "Fantasy",
      inspiredBy: "Classic children's tales",
      status: "Published",
      createdAt: "2023-06-20 13:30:28",
      metrics: {
        views: 935,
        avgReadTime: "3m 15s",
        completionRate: 92,
        likes: 324,
        claps: 456,
        bookmarks: 87
      }
    },
    {
      id: 10,
      title: "Last Breath",
      content: "The detective examined the peculiar marks on the victim...",
      truncatedContent: "The detective examined the peculiar...",
      ageGroup: "Adult",
      genre: "Thriller",
      inspiredBy: "Crime novels",
      status: "Under review",
      createdAt: "2023-06-15 10:55:42",
      metrics: {
        views: 412,
        avgReadTime: "7m 38s",
        completionRate: 68,
        likes: 89,
        claps: 134,
        bookmarks: 45
      }
    }
  ];

  // Initialize stories state with mock data
  useEffect(() => {
    setStories(mockStories);
    setFilteredStories(mockStories);
  }, []);

  // Unique values for filter dropdowns
  const uniqueGenres = [...new Set(mockStories.map(story => story.genre))];
  const uniqueAgeGroups = [...new Set(mockStories.map(story => story.ageGroup))];
  const uniqueInspiredBy = [...new Set(mockStories.map(story => story.inspiredBy))];
  const uniqueStatuses = [...new Set(mockStories.map(story => story.status))];

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...stories];
    
    // Filter by genre
    if (filters.genre) {
      filtered = filtered.filter(story => story.genre === filters.genre);
    }
    
    // Filter by age group
    if (filters.ageGroup) {
      filtered = filtered.filter(story => story.ageGroup === filters.ageGroup);
    }
    
    // Filter by inspired by
    if (filters.inspiredBy) {
      filtered = filtered.filter(story => story.inspiredBy === filters.inspiredBy);
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(story => story.status === filters.status);
    }
    
    // Filter by likes
    if (filters.minLikes) {
      filtered = filtered.filter(story => story.metrics.likes >= parseInt(filters.minLikes));
    }
    if (filters.maxLikes) {
      filtered = filtered.filter(story => story.metrics.likes <= parseInt(filters.maxLikes));
    }
    
    // Filter by completion rate
    if (filters.minCompletionRate) {
      filtered = filtered.filter(story => story.metrics.completionRate >= parseInt(filters.minCompletionRate));
    }
    if (filters.maxCompletionRate) {
      filtered = filtered.filter(story => story.metrics.completionRate <= parseInt(filters.maxCompletionRate));
    }
    
    // Filter by read time (convert to seconds for comparison)
    if (filters.minReadTime) {
      filtered = filtered.filter(story => {
        const storyTime = story.metrics.avgReadTime;
        const minutes = parseInt(storyTime.split('m')[0]);
        const seconds = parseInt(storyTime.split(' ')[1].split('s')[0]);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds >= parseInt(filters.minReadTime) * 60;
      });
    }
    if (filters.maxReadTime) {
      filtered = filtered.filter(story => {
        const storyTime = story.metrics.avgReadTime;
        const minutes = parseInt(storyTime.split('m')[0]);
        const seconds = parseInt(storyTime.split(' ')[1].split('s')[0]);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds <= parseInt(filters.maxReadTime) * 60;
      });
    }
    
    // Filter by views
    if (filters.minViews) {
      filtered = filtered.filter(story => story.metrics.views >= parseInt(filters.minViews));
    }
    if (filters.maxViews) {
      filtered = filtered.filter(story => story.metrics.views <= parseInt(filters.maxViews));
    }
    
    setFilteredStories(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      genre: '',
      ageGroup: '',
      inspiredBy: '',
      status: '',
      minLikes: '',
      maxLikes: '',
      minCompletionRate: '',
      maxCompletionRate: '',
      minReadTime: '',
      maxReadTime: '',
      minViews: '',
      maxViews: ''
    });
    setFilteredStories(stories);
  };

  // Toggle row expansion (mobile view)
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedStories = [...filteredStories].sort((a, b) => {
      // Handle nested properties
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (direction === 'asc') {
          return a[parent][child] > b[parent][child] ? 1 : -1;
        } else {
          return a[parent][child] < b[parent][child] ? 1 : -1;
        }
      } else {
        if (direction === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      }
    });
    
    setFilteredStories(sortedStories);
  };
  
  // Generate sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };
  
  // Handle story action
  const handleStoryAction = (id, action) => {
    console.log(`Action ${action} on story ${id}`);
    // Implement actual actions here
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-900 text-green-300';
      case 'Under review':
        return 'bg-yellow-900 text-yellow-300';
      case 'Draft':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-[#202031] p-4 sm:p-6 rounded-xl shadow-lg border border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-medium text-white mb-4 sm:mb-0">Story Imports</h2>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Import Story
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-[#161625] p-4 mb-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-gray-200">Advanced Filters</h3>
          <div className="flex gap-2">
            <button 
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Apply Filters
            </button>
            <button 
              onClick={resetFilters}
              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Basic Filters */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Genre</label>
            <select 
              name="genre" 
              value={filters.genre} 
              onChange={handleFilterChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Age Group</label>
            <select 
              name="ageGroup" 
              value={filters.ageGroup} 
              onChange={handleFilterChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Age Groups</option>
              {uniqueAgeGroups.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Inspired By</label>
            <select 
              name="inspiredBy" 
              value={filters.inspiredBy} 
              onChange={handleFilterChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Inspirations</option>
              {uniqueInspiredBy.map(inspiration => (
                <option key={inspiration} value={inspiration}>{inspiration}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Collapsible Advanced Filters */}
        <details className="mt-4">
          <summary className="text-sm text-blue-400 cursor-pointer">Engagement Metrics Filters</summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Likes</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  name="minLikes" 
                  placeholder="Min" 
                  value={filters.minLikes}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
                <input 
                  type="number" 
                  name="maxLikes" 
                  placeholder="Max" 
                  value={filters.maxLikes}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Completion Rate (%)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  name="minCompletionRate" 
                  placeholder="Min" 
                  value={filters.minCompletionRate}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
                <input 
                  type="number" 
                  name="maxCompletionRate" 
                  placeholder="Max" 
                  value={filters.maxCompletionRate}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Read Time (minutes)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  name="minReadTime" 
                  placeholder="Min" 
                  value={filters.minReadTime}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
                <input 
                  type="number" 
                  name="maxReadTime" 
                  placeholder="Max" 
                  value={filters.maxReadTime}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Views</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  name="minViews" 
                  placeholder="Min" 
                  value={filters.minViews}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
                <input 
                  type="number" 
                  name="maxViews" 
                  placeholder="Max" 
                  value={filters.maxViews}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Stories Table - Desktop & Tablet - FIX OVERFLOW */}
      <div className="hidden sm:block overflow-x-auto max-w-full">
        <table className="w-full bg-[#161625] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-left text-xs whitespace-nowrap">
              <th className="px-3 py-3 w-8">#</th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {getSortIndicator('title')}
              </th>
              <th className="px-3 py-3 max-w-[150px]">Content Preview</th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('ageGroup')}
              >
                Age Group {getSortIndicator('ageGroup')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('genre')}
              >
                Genre {getSortIndicator('genre')}
              </th>
              <th className="px-3 py-3">Inspired By</th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIndicator('status')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('metrics.views')}
              >
                Views {getSortIndicator('metrics.views')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('metrics.avgReadTime')}
              >
                Read Time {getSortIndicator('metrics.avgReadTime')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('metrics.completionRate')}
              >
                Comp. {getSortIndicator('metrics.completionRate')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer"
                onClick={() => handleSort('metrics.likes')}
              >
                Engage {getSortIndicator('metrics.likes')}
              </th>
              <th 
                className="px-3 py-3 cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('createdAt')}
              >
                Created {getSortIndicator('createdAt')}
              </th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredStories.map((story, index) => (
              <tr key={story.id} className="text-gray-300 text-xs sm:text-sm hover:bg-gray-800 transition-colors whitespace-nowrap">
                <td className="px-3 py-3">{index + 1}</td>
                <td className="px-3 py-3 font-medium text-blue-400 max-w-[150px] truncate">{story.title}</td>
                <td className="px-3 py-3 max-w-[150px] truncate">{story.truncatedContent}</td>
                <td className="px-3 py-3">{story.ageGroup}</td>
                <td className="px-3 py-3">{story.genre}</td>
                <td className="px-3 py-3 max-w-[120px] truncate">{story.inspiredBy}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(story.status)}`}>
                    {story.status}
                  </span>
                </td>
                <td className="px-3 py-3">{story.metrics.views.toLocaleString()}</td>
                <td className="px-3 py-3">{story.metrics.avgReadTime}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center">
                    <span className="mr-1">{story.metrics.completionRate}%</span>
                    <div className="w-8 bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${story.metrics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center space-x-1">
                    <span title="Likes" className="flex items-center">
                      <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">{story.metrics.likes}</span>
                    </span>
                    <span title="Claps" className="flex items-center">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">{story.metrics.claps}</span>
                    </span>
                    <span title="Bookmarks" className="flex items-center">
                      <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                      </svg>
                      <span className="ml-1">{story.metrics.bookmarks}</span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs">{formatDate(story.createdAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleStoryAction(story.id, 'view')}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="View"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleStoryAction(story.id, 'edit')}
                      className="text-yellow-400 hover:text-yellow-300 p-1"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleStoryAction(story.id, 'delete')}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stories Cards - Mobile */}
      <div className="sm:hidden space-y-4">
        {filteredStories.map((story, index) => (
          <div key={story.id} className="bg-[#161625] rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-blue-400 font-medium">{story.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(story.status)}`}>
                  {story.status}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mt-2 mb-3">{story.truncatedContent}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                <div>Genre: <span className="text-gray-300">{story.genre}</span></div>
                <div>Age: <span className="text-gray-300">{story.ageGroup}</span></div>
              </div>
              
              <button
                onClick={() => toggleRowExpansion(story.id)}
                className="text-blue-400 text-xs flex items-center mt-1"
              >
                {expandedRows[story.id] ? 'Hide details' : 'Show details'}
                <svg 
                  className={`w-4 h-4 ml-1 transform ${expandedRows[story.id] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {expandedRows[story.id] && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-gray-400">Views</div>
                      <div className="text-gray-200 text-sm">{story.metrics.views.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg Read Time</div>
                      <div className="text-gray-200 text-sm">{story.metrics.avgReadTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Completion</div>
                      <div className="flex items-center">
                        <span className="text-gray-200 text-sm mr-2">{story.metrics.completionRate}%</span>
                        <div className="w-12 bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${story.metrics.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Created</div>
                      <div className="text-gray-200 text-sm">{formatDate(story.createdAt)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-400 mb-1">Inspired By</div>
                      <div className="text-gray-200 text-sm">{story.inspiredBy}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-400 mb-1">Engagement</div>
                      <div className="flex items-center gap-4">
                        <span title="Likes" className="flex items-center">
                          <svg className="w-4 h-4 text-red-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          {story.metrics.likes}
                        </span>
                        <span title="Claps" className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path>
                          </svg>
                          {story.metrics.claps}
                        </span>
                        <span title="Bookmarks" className="flex items-center">
                          <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                          </svg>
                          {story.metrics.bookmarks}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex border-t border-gray-700 divide-x divide-gray-700">
              <button 
                onClick={() => handleStoryAction(story.id, 'view')}
                className="flex-1 py-2 text-blue-400 hover:bg-gray-800 text-xs flex justify-center items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View
              </button>
              <button 
                onClick={() => handleStoryAction(story.id, 'edit')}
                className="flex-1 py-2 text-yellow-400 hover:bg-gray-800 text-xs flex justify-center items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit
              </button>
              <button 
                onClick={() => handleStoryAction(story.id, 'delete')}
                className="flex-1 py-2 text-red-400 hover:bg-gray-800 text-xs flex justify-center items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination - can be added for larger datasets */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <div>Showing {filteredStories.length} of {stories.length} stories</div>
        {filteredStories.length === 0 && (
          <div className="text-center text-gray-400">No stories match the selected filters</div>
        )}
      </div>
    </div>
  );
}