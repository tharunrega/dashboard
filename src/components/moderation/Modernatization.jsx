import React, { useState, useEffect } from 'react';

// Trigger words list for moderation
const triggerWords = [
  "violence", "weapon", "kill", "death", "gun", "suicide", "terrorist",
  "inappropriate", "explicit", "sexual", "adult", "nudity", "hate", "racism",
  "drugs", "alcohol", "abuse", "harassment"
];

// Sample data - Replace with actual API calls
const sampleData = {
  moderationItems: [
    { 
      id: 1, 
      userName: "John Doe", 
      userEmail: "johndoe@example.com", 
      type: "Story", 
      prompt: "A futuristic city where humans and AI coexist", 
      response: "In the gleaming metropolis of Neo-Aurora, holographic advertisements...", 
      priority: "Medium",
      status: "Pending",
      createdAt: "2025-08-11T15:30:00",
      childName: "Alex", // New fields
      childAge: 8
    },
    { 
      id: 2, 
      userName: "Jane Smith", 
      userEmail: "janesmith@example.com", 
      type: "Prompt", 
      prompt: "Tell me about the political situation in Europe with weapons and violence", // Added trigger words
      response: "The current political landscape in Europe is characterized by...", 
      priority: "Low",
      status: "Pending",
      createdAt: "2025-08-11T14:15:00",
      childName: "Sophia",
      childAge: 6
    },
    { 
      id: 3, 
      userName: "Alex Brown", 
      userEmail: "alexbrown@example.com", 
      type: "User Report", 
      prompt: "User reported inappropriate content in story #4582", 
      response: "Investigating reported content in story #4582...", 
      priority: "High",
      status: "Pending",
      createdAt: "2025-08-11T16:45:00",
      childName: "Ryan",
      childAge: 10
    },
    // Additional sample data...
  ],
  summaryStats: {
    totalItemsInQueue: 42,
    averageTimeToModerate: "1.5 hours",
    approvedToday: 24,
    rejectedToday: 8,
    approvedThisWeek: 156,
    rejectedThisWeek: 32,
    moderationVolumeByDay: [
      { day: 'Mon', count: 35 },
      { day: 'Tue', count: 42 },
      { day: 'Wed', count: 38 },
      { day: 'Thu', count: 30 },
      { day: 'Fri', count: 25 },
      { day: 'Sat', count: 18 },
      { day: 'Sun', count: 15 },
    ]
  }
};

export default function Moderation() { // Renamed from Modernatization
  const [moderationData, setModerationData] = useState(sampleData.moderationItems);
  const [summaryData, setSummaryData] = useState(sampleData.summaryStats);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    moderator: 'all',
    hasTriggerWords: false // Default to false
  });
  const [assignedModerator, setAssignedModerator] = useState('');
  const [highlightTriggerWords, setHighlightTriggerWords] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Last 7 days by default
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  
  // Simulating API fetch
  useEffect(() => {
    // In a real implementation, you would fetch data from your API here
    // fetchModerationData(dateRange.startDate, dateRange.endDate).then(data => {
    //   setModerationData(data.items);
    //   setSummaryData(data.stats);
    // });
  }, [dateRange]);

  // Function to detect if text contains trigger words and return them
  const detectTriggerWords = (text) => {
    if (!text) return [];
    
    const foundTriggers = [];
    triggerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (text.match(regex)) {
        foundTriggers.push(word);
      }
    });
    
    return foundTriggers;
  };

  // Function to highlight trigger words in text
  const highlightText = (text) => {
    if (!highlightTriggerWords || !text) return text;
    
    let highlighted = text;
    triggerWords.forEach(word => {
      const regex = new RegExp(`(\\b${word}\\b)`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="bg-red-700 text-white px-1 rounded">$1</span>');
    });
    
    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };
  
  // Function to compose an email with improved content
  const composeEmail = (user) => {
    if (!selectedItem) return;
    
    // Get detected trigger words to include in email
    const contentTriggerWords = [
      ...detectTriggerWords(selectedItem.prompt),
      ...detectTriggerWords(selectedItem.response)
    ];
    
    const uniqueTriggerWords = [...new Set(contentTriggerWords)];
    
    const subject = `Moderation Notice - ${selectedItem.type}`;
    let body = `Dear ${user.userName},

We're writing regarding content that has been flagged for moderation.`;

    // Add info about trigger words if any were found
    if (uniqueTriggerWords.length > 0) {
      body += `\n\nThe following potentially problematic terms were detected: ${uniqueTriggerWords.join(', ')}`;
    }
    
    // Add custom reason if provided
    if (actionReason) {
      body += `\n\nReason for moderation: ${actionReason}`;
    }
    
    body += `\n\nPlease review our community guidelines at https://example.com/guidelines.

Regards,
Moderation Team`;
    
    // Encode for mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Open default email client
    window.location.href = `mailto:${user.userEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  };
  
  // Apply filters to data, now with improved trigger word detection
  const filteredData = moderationData.filter(item => {
    const matchesFilters = (
      (filters.status === 'all' || item.status === filters.status) &&
      (filters.type === 'all' || item.type === filters.type) &&
      (filters.priority === 'all' || item.priority === filters.priority) &&
      (filters.moderator === 'all' || item.moderator === filters.moderator)
    );
    
    // Additional filter for trigger words if selected
    if (filters.hasTriggerWords) {
      const promptTriggers = detectTriggerWords(item.prompt);
      const responseTriggers = detectTriggerWords(item.response);
      return matchesFilters && (promptTriggers.length > 0 || responseTriggers.length > 0);
    }
    
    return matchesFilters;
  });

  // Handle moderation action
  const handleAction = (action) => {
    if (selectedItem) {
      // In a real implementation, you would call your API here
      // updateModerationStatus(selectedItem.id, action, actionReason, assignedModerator)
      
      // Update local state for demonstration
      const updatedData = moderationData.map(item => 
        item.id === selectedItem.id 
          ? { ...item, status: action === 'approve' ? 'Approved' : 'Rejected' } 
          : item
      );
      setModerationData(updatedData);
      
      // Update summary stats for demonstration
      if (action === 'approve') {
        setSummaryData(prev => ({
          ...prev,
          approvedToday: prev.approvedToday + 1,
          approvedThisWeek: prev.approvedThisWeek + 1,
          totalItemsInQueue: prev.totalItemsInQueue - 1
        }));
      } else {
        setSummaryData(prev => ({
          ...prev,
          rejectedToday: prev.rejectedToday + 1,
          rejectedThisWeek: prev.rejectedThisWeek + 1,
          totalItemsInQueue: prev.totalItemsInQueue - 1
        }));
      }
      
      // Close modal
      setModalOpen(false);
      setSelectedItem(null);
      setActionReason('');
      setAssignedModerator('');
    }
  };

  // Handle viewing item details
  const viewItemDetails = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle date range changes
  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Calculate trigger word counts for the badge
  const getTriggerWordCounts = (item) => {
    if (!item.prompt && !item.response) return 0;
    
    const promptTriggers = detectTriggerWords(item.prompt);
    const responseTriggers = detectTriggerWords(item.response);
    return promptTriggers.length + responseTriggers.length;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Content Moderation Dashboard</h1>
      
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-400">Items in Queue</h3>
          <p className="text-3xl font-bold">{summaryData.totalItemsInQueue}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-400">Avg. Time to Moderate</h3>
          <p className="text-3xl font-bold">{summaryData.averageTimeToModerate}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-400">Approved vs. Rejected</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Today:</p>
              <p className="text-xl font-bold text-green-500">{summaryData.approvedToday}</p>
              <p className="text-xl font-bold text-red-500">{summaryData.rejectedToday}</p>
            </div>
            <div>
              <p className="text-sm">This Week:</p>
              <p className="text-xl font-bold text-green-500">{summaryData.approvedThisWeek}</p>
              <p className="text-xl font-bold text-red-500">{summaryData.rejectedThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Volume Trend Chart */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Moderation Volume Trend</h3>
        <div className="h-40 flex items-end space-x-2">
          {summaryData.moderationVolumeByDay.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-blue-500 w-full rounded-t-sm" 
                style={{ height: `${(day.count / 50) * 100}px` }}
              ></div>
              <span className="text-xs mt-1">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Filtering */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select 
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select 
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Story">Story</option>
              <option value="Prompt">Prompt</option>
              <option value="Response">Response</option>
              <option value="User Report">User Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select 
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Moderator</label>
            <select 
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
              value={filters.moderator}
              onChange={(e) => handleFilterChange('moderator', e.target.value)}
            >
              <option value="all">All Moderators</option>
              <option value="john">John Smith</option>
              <option value="sarah">Sarah Johnson</option>
              <option value="michael">Michael Brown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input 
              type="date" 
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input 
              type="date" 
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
        </div>
        
        {/* Additional filter options */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Trigger Words Filter */}
          <div>
            <label className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={filters.hasTriggerWords}
                onChange={(e) => handleFilterChange('hasTriggerWords', e.target.checked)}
                className="mr-2 form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              Has Trigger Words
            </label>
            <div className="text-xs text-gray-500">
              Filter content with problematic terms
            </div>
          </div>
          
          {/* Highlight Trigger Words Toggle */}
          <div>
            <label className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={highlightTriggerWords}
                onChange={(e) => setHighlightTriggerWords(e.target.checked)}
                className="mr-2 form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              Highlight Trigger Words
            </label>
            <div className="text-xs text-gray-500">
              Visually highlight problematic terms
            </div>
          </div>
          
          {/* Quick date filters */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setDateRange({ startDate: today, endDate: today });
              }}
              className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Today
            </button>
            <button 
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                setDateRange({ 
                  startDate: weekAgo.toISOString().split('T')[0], 
                  endDate: today.toISOString().split('T')[0] 
                });
              }}
              className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setDate(today.getDate() - 30);
                setDateRange({ 
                  startDate: monthAgo.toISOString().split('T')[0], 
                  endDate: today.toISOString().split('T')[0] 
                });
              }}
              className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>
      
      {/* Moderation Items Table */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Moderation Items</h3>
        <table className="min-w-full bg-[#0a0a18] rounded-lg overflow-hidden">
          <thead className="bg-[#16162a]">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Child</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Prompt</th>
              <th className="py-3 px-4 text-left">Trigger Words</th>
              <th className="py-3 px-4 text-left">Priority</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const triggerCount = getTriggerWordCounts(item);
              return (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-[#16162a]">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => alert(`View user profile for ${item.userName}`)}
                      className="text-blue-400 hover:underline"
                    >
                      {item.userName}
                      <div className="text-xs text-gray-400">{item.userEmail}</div>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {item.childName && (
                      <div>
                        <div>{item.childName}</div>
                        <div className="text-xs text-gray-400">Age: {item.childAge}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate" title={item.prompt}>
                      {highlightTriggerWords ? highlightText(item.prompt) : item.prompt}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {triggerCount > 0 && (
                      <span className="px-2 py-1 rounded-full bg-red-900 text-white text-xs font-semibold">
                        {triggerCount}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.priority === "High" ? "bg-red-900 text-red-300" :
                      item.priority === "Medium" ? "bg-yellow-900 text-yellow-300" :
                      "bg-green-900 text-green-300"
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Pending" ? "bg-yellow-900 text-yellow-300" :
                      item.status === "Approved" ? "bg-green-900 text-green-300" :
                      "bg-red-900 text-red-300"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => viewItemDetails(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No items match your filter criteria
          </div>
        )}
      </div>

      {/* Modal for Content Preview & Action */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Review Content</h3>
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="font-semibold">{selectedItem.userName}</p>
                  <p className="text-sm text-blue-400">{selectedItem.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="font-semibold">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Child Information</p>
                  <p className="font-semibold">
                    {selectedItem.childName ? `${selectedItem.childName}, Age ${selectedItem.childAge}` : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Trigger word summary */}
              <div className="mt-4">
                <p className="text-sm text-gray-400">Detected Trigger Words</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[...new Set([
                    ...detectTriggerWords(selectedItem.prompt),
                    ...detectTriggerWords(selectedItem.response)
                  ])].map((word, index) => (
                    <span key={index} className="bg-red-900 text-white px-2 py-1 rounded-full text-xs">
                      {word}
                    </span>
                  ))}
                  {[...detectTriggerWords(selectedItem.prompt), ...detectTriggerWords(selectedItem.response)].length === 0 && (
                    <span className="text-gray-400">No trigger words detected</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400">Prompt</p>
                <div className="bg-[#0a0a18] p-3 rounded-lg mt-1">
                  {highlightTriggerWords ? highlightText(selectedItem.prompt) : selectedItem.prompt}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400">Response</p>
                <div className="bg-[#0a0a18] p-3 rounded-lg mt-1 max-h-60 overflow-y-auto">
                  {highlightTriggerWords ? highlightText(selectedItem.response) : selectedItem.response}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-400">Moderation Action</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm mb-1">Action Reason</label>
                    <textarea 
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                      rows="3"
                      placeholder="Enter reason for moderation action..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Assign To</label>
                    <select 
                      value={assignedModerator}
                      onChange={(e) => setAssignedModerator(e.target.value)}
                      className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                    >
                      <option value="">Select Moderator</option>
                      <option value="john">John Smith</option>
                      <option value="sarah">Sarah Johnson</option>
                      <option value="michael">Michael Brown</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => composeEmail(selectedItem)}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact User
                  </div>
                </button>
                <button 
                  onClick={() => handleAction('reject')}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAction('approve')}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
