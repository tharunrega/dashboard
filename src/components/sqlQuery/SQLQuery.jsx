import React, { useState, useEffect } from 'react';

// Sample database schema for the Schema Browser
const sampleSchema = [
  {
    tableName: 'users',
    columns: [
      { name: 'id', type: 'integer', primary: true },
      { name: 'username', type: 'varchar' },
      { name: 'email', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'last_login', type: 'timestamp' },
      { name: 'story_count', type: 'integer' },
    ]
  },
  {
    tableName: 'stories',
    columns: [
      { name: 'id', type: 'integer', primary: true },
      { name: 'title', type: 'varchar' },
      { name: 'content', type: 'text' },
      { name: 'user_id', type: 'integer', foreign: 'users.id' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
      { name: 'likes_count', type: 'integer' },
      { name: 'ai_generated', type: 'boolean' },
      { name: 'age_group', type: 'varchar' },
    ]
  },
  {
    tableName: 'likes',
    columns: [
      { name: 'id', type: 'integer', primary: true },
      { name: 'user_id', type: 'integer', foreign: 'users.id' },
      { name: 'story_id', type: 'integer', foreign: 'stories.id' },
      { name: 'created_at', type: 'timestamp' },
    ]
  },
  {
    tableName: 'comments',
    columns: [
      { name: 'id', type: 'integer', primary: true },
      { name: 'content', type: 'text' },
      { name: 'user_id', type: 'integer', foreign: 'users.id' },
      { name: 'story_id', type: 'integer', foreign: 'stories.id' },
      { name: 'created_at', type: 'timestamp' },
    ]
  },
  {
    tableName: 'subscriptions',
    columns: [
      { name: 'id', type: 'integer', primary: true },
      { name: 'user_id', type: 'integer', foreign: 'users.id' },
      { name: 'plan_name', type: 'varchar' },
      { name: 'start_date', type: 'timestamp' },
      { name: 'end_date', type: 'timestamp' },
      { name: 'status', type: 'varchar' },
      { name: 'price', type: 'decimal' },
    ]
  },
];

// Improved and categorized predefined queries with descriptions
const predefinedQueries = [
  // User Analytics Category
  {
    category: 'User Analytics',
    name: 'Users registered today',
    description: 'Shows all users who registered in the last 24 hours',
    query: "SELECT username, email, created_at FROM users WHERE DATE(created_at) = CURRENT_DATE ORDER BY created_at DESC;"
  },
  {
    category: 'User Analytics',
    name: 'Users registered last week',
    description: 'Shows users who registered in the past 7 days',
    query: "SELECT username, email, created_at FROM users WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) ORDER BY created_at DESC;"
  },
  {
    category: 'User Analytics',
    name: 'Active users today',
    description: 'Shows users who logged in today',
    query: "SELECT username, email, last_login FROM users WHERE DATE(last_login) = CURRENT_DATE ORDER BY last_login DESC;"
  },
  {
    category: 'User Analytics',
    name: 'Inactive users (30+ days)',
    description: 'Shows users who haven\'t logged in for 30+ days',
    query: "SELECT username, email, last_login FROM users WHERE last_login < DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) OR last_login IS NULL ORDER BY last_login ASC;"
  },
  
  // Content Metrics Category
  {
    category: 'Content Metrics',
    name: 'Most liked stories',
    description: 'Lists stories with the highest number of likes',
    query: "SELECT s.title, s.content, COUNT(l.id) as like_count FROM stories s LEFT JOIN likes l ON s.id = l.story_id GROUP BY s.id ORDER BY like_count DESC LIMIT 20;"
  },
  {
    category: 'Content Metrics',
    name: 'Stories created by AI for toddlers',
    description: 'Shows AI-generated stories for toddler age group',
    query: "SELECT title, content, created_at FROM stories WHERE ai_generated = true AND age_group = 'toddler' ORDER BY created_at DESC LIMIT 50;"
  },
  {
    category: 'Content Metrics',
    name: 'Recent stories created today',
    description: 'Shows stories created today',
    query: "SELECT s.title, u.username AS author, s.created_at FROM stories s JOIN users u ON s.user_id = u.id WHERE DATE(s.created_at) = CURRENT_DATE ORDER BY s.created_at DESC;"
  },
  {
    category: 'Content Metrics',
    name: 'Stories with low completion rates',
    description: 'Identifies stories that users tend not to finish reading',
    query: "SELECT title, content, completion_rate FROM stories WHERE completion_rate < 50 ORDER BY completion_rate ASC LIMIT 50;"
  },
  
  // Engagement Category
  {
    category: 'Engagement',
    name: 'Users with most stories',
    description: 'Lists users who have created the most stories',
    query: "SELECT u.username, u.email, COUNT(s.id) as story_count FROM users u LEFT JOIN stories s ON u.id = s.user_id GROUP BY u.id ORDER BY story_count DESC LIMIT 20;"
  },
  {
    category: 'Engagement',
    name: 'Recent comments on popular stories',
    description: 'Shows latest comments on stories with high engagement',
    query: "SELECT s.title, c.content, u.username, c.created_at FROM comments c JOIN stories s ON c.story_id = s.id JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC LIMIT 50;"
  },
  {
    category: 'Engagement',
    name: 'High-engagement users today',
    description: 'Shows users with high activity today (likes, comments, etc.)',
    query: "SELECT u.username, COUNT(l.id) as likes, COUNT(c.id) as comments FROM users u LEFT JOIN likes l ON u.id = l.user_id AND DATE(l.created_at) = CURRENT_DATE LEFT JOIN comments c ON u.id = c.user_id AND DATE(c.created_at) = CURRENT_DATE GROUP BY u.id HAVING (COUNT(l.id) + COUNT(c.id)) > 5 ORDER BY (COUNT(l.id) + COUNT(c.id)) DESC;"
  },
  
  // System Performance Category
  {
    category: 'System Performance',
    name: 'Hourly story creation trend today',
    description: 'Shows story creation counts grouped by hour for today',
    query: "SELECT HOUR(created_at) as hour, COUNT(*) as count FROM stories WHERE DATE(created_at) = CURRENT_DATE GROUP BY HOUR(created_at) ORDER BY hour;"
  },
  {
    category: 'System Performance',
    name: 'Subscription statistics',
    description: 'Shows active subscriptions by plan type',
    query: "SELECT plan_name, COUNT(*) as count, AVG(price) as avg_price FROM subscriptions WHERE status = 'active' GROUP BY plan_name ORDER BY count DESC;"
  },
];

export default function SQLQuery({ selectedDate }) {
  const [query, setQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSchema, setShowSchema] = useState(false);
  const [expandedTable, setExpandedTable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPredefinedQueries, setShowPredefinedQueries] = useState(false);
  
  // Group predefined queries by category
  const groupedQueries = predefinedQueries.reduce((acc, query) => {
    if (!acc[query.category]) {
      acc[query.category] = [];
    }
    acc[query.category].push(query);
    return acc;
  }, {});
  
  // Get unique categories
  const queryCategories = Object.keys(groupedQueries);

  // Load query history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('sqlQueryHistory');
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }
    
    // If we have a selectedDate, update any queries with CURRENT_DATE
    if (selectedDate) {
      const formattedDate = formatDateForSQL(selectedDate);
      const updatedQuery = query.replace(/CURRENT_DATE/g, `'${formattedDate}'`);
      if (updatedQuery !== query && query) {
        setQuery(updatedQuery);
      }
    }
  }, [selectedDate, query]);

  // Format date for SQL
  const formatDateForSQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sqlQueryHistory', JSON.stringify(queryHistory));
  }, [queryHistory]);

  // Execute the query
  const executeQuery = () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Record start time for execution time calculation
    const startTime = performance.now();
    
    // Update query to use selectedDate if provided
    let executedQuery = query;
    if (selectedDate) {
      const formattedDate = formatDateForSQL(selectedDate);
      executedQuery = query.replace(/CURRENT_DATE/g, `'${formattedDate}'`);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real implementation, this would be an API call to execute the query
        // const response = await fetch('/api/sql', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ query: executedQuery })
        // });
        // const data = await response.json();
        // if (data.error) throw new Error(data.error);
        
        // Mock data for query results demonstration
        const sampleQueryResults = [
          {
            username: 'john_doe',
            email: 'john@example.com',
            created_at: '2025-08-05T14:30:22Z',
          },
          {
            username: 'alice_wonder',
            email: 'alice@example.com',
            created_at: '2025-08-06T09:15:47Z',
          },
          {
            username: 'bob_builder',
            email: 'bob@example.com',
            created_at: '2025-08-07T12:45:10Z',
          },
          {
            username: 'sarah_smith',
            email: 'sarah@example.com',
            created_at: '2025-08-08T17:23:05Z',
          },
          {
            username: 'mike_jones',
            email: 'mike@example.com',
            created_at: '2025-08-09T08:10:33Z',
          },
          {
            username: 'emma_wilson',
            email: 'emma@example.com',
            created_at: '2025-08-10T11:05:27Z',
          },
          {
            username: 'david_clark',
            email: 'david@example.com',
            created_at: '2025-08-11T16:42:18Z',
          },
        ];
        
        // Record end time and calculate duration
        const endTime = performance.now();
        setExecutionTime(((endTime - startTime) / 1000).toFixed(2));
        
        // Set total rows
        setTotalRows(sampleQueryResults.length);
        
        // Set results with pagination info
        setResults({
          columns: ['username', 'email', 'created_at'],
          rows: sampleQueryResults,
          totalRows: sampleQueryResults.length
        });
        
        // Add to query history if not already present
        if (!queryHistory.includes(executedQuery)) {
          setQueryHistory(prev => [executedQuery, ...prev.slice(0, 9)]); // Keep only 10 recent queries
        }
        
        // Reset to first page when new results come in
        setCurrentPage(1);
        
        setIsLoading(false);
      } catch (err) {
        setError('Error executing query: ' + (err.message || 'Unknown error'));
        setIsLoading(false);
      }
    }, 800);
  };

  // Handle predefined query selection
  const handlePredefinedQuery = (queryText) => {
    setQuery(queryText);
    setShowPredefinedQueries(false); // Close dropdown after selection
    
    // Optional: automatically execute the query
    setTimeout(() => {
      executeQuery();
    }, 100);
  };

  // Toggle schema browser visibility
  const toggleSchema = () => {
    setShowSchema(!showSchema);
  };

  // Toggle table expansion in schema browser
  const toggleTableExpand = (tableName) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  // Handle download of query results
  const handleDownloadResults = (format) => {
    if (!results) return;
    
    let content;
    const filename = `query_results_${new Date().toISOString().slice(0, 10)}`;
    
    if (format === 'csv') {
      content = results.columns.join(',') + '\n';
      results.rows.forEach(row => {
        content += results.columns.map(col => row[col]).join(',') + '\n';
      });
      
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      content = JSON.stringify(results.rows, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  // Calculate pagination
  const totalPages = results ? Math.ceil(results.totalRows / rowsPerPage) : 0;
  const paginatedRows = results ? results.rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ) : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">SQL Query Dashboard</h1>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Query Building Area */}
        <div className="lg:w-2/3">
          {/* Query Editor */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-blue-400">Query Editor</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSchema}
                  className={`text-sm px-3 py-1 rounded ${showSchema ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {showSchema ? 'Hide Schema' : 'Show Schema'}
                </button>
                
                {/* Quick Query Category Selection */}
                <div className="relative">
                  <button 
                    onClick={() => setShowPredefinedQueries(!showPredefinedQueries)}
                    className="text-sm px-3 py-1 rounded bg-purple-700 text-white hover:bg-purple-600 flex items-center"
                  >
                    <span>Predefined Queries</span>
                    <svg className={`ml-1 w-4 h-4 transform ${showPredefinedQueries ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Enhanced Predefined Queries Dropdown with Categories */}
                  {showPredefinedQueries && (
                    <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-md shadow-lg z-10">
                      <div className="p-2">
                        <div className="flex mb-2 gap-2">
                          <input
                            type="text"
                            placeholder="Search queries..."
                            className="flex-grow bg-gray-700 text-white p-2 rounded"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          />
                          <button 
                            onClick={() => setSelectedCategory('')}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-2 rounded"
                          >
                            Clear
                          </button>
                        </div>
                        
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {queryCategories.map(category => (
                            <button
                              key={category}
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                selectedCategory === category 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              }`}
                              onClick={() => setSelectedCategory(prev => prev === category ? '' : category)}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                          {queryCategories.map(category => {
                            // If a category is selected, only show that category
                            if (selectedCategory && selectedCategory !== category && 
                                !category.toLowerCase().includes(selectedCategory.toLowerCase())) {
                              return null;
                            }
                            
                            const categoryQueries = groupedQueries[category].filter(q => 
                              !selectedCategory || 
                              selectedCategory === category ||
                              q.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                              q.description.toLowerCase().includes(selectedCategory.toLowerCase())
                            );
                            
                            if (categoryQueries.length === 0) return null;
                            
                            return (
                              <div key={category} className="mb-3">
                                <div className="text-sm font-semibold text-blue-400 mb-1 px-2">{category}</div>
                                {categoryQueries.map((queryItem, index) => (
                                  <div 
                                    key={index}
                                    className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                    onClick={() => handlePredefinedQuery(queryItem.query)}
                                  >
                                    <div className="font-medium text-blue-400">{queryItem.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{queryItem.description}</div>
                                    <div className="text-xs font-mono bg-gray-900 p-1 mt-1 rounded overflow-x-auto">
                                      {queryItem.query.length > 50 ? queryItem.query.substring(0, 50) + '...' : queryItem.query}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* SQL Syntax Highlighting */}
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#0a0a18] text-white font-mono p-4 rounded-md h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your SQL query here..."
                spellCheck="false"
              ></textarea>
              
              {/* Date note if selected date is available */}
              {selectedDate && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-900 bg-opacity-70 text-xs text-blue-200 px-2 py-1 rounded">
                    Using date: {selectedDate}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div>
                {queryHistory.length > 0 && (
                  <div className="relative inline-block">
                    <select 
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-gray-700 text-white text-sm rounded px-3 py-1 appearance-none pr-8"
                      value=""
                    >
                      <option value="" disabled>Recent Queries</option>
                      {queryHistory.map((q, i) => (
                        <option key={i} value={q}>
                          {q.length > 40 ? q.substring(0, 40) + '...' : q}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuery('')}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={executeQuery}
                  disabled={isLoading || !query.trim()}
                  className={`px-4 py-2 rounded ${
                    isLoading || !query.trim() 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  } flex items-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executing...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Execute Query
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Query Results */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-blue-400">Query Results</h2>
              <div className="flex items-center gap-2">
                {results && results.rows.length > 0 && (
                  <>
                    <span className="text-sm text-gray-400">
                      {executionTime && `Execution time: ${executionTime}s`}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownloadResults('csv')}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        CSV
                      </button>
                      <button 
                        onClick={() => handleDownloadResults('json')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        JSON
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900 text-red-200 p-3 rounded-md mb-3">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex flex-col justify-center items-center p-10">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-blue-400">Executing your query...</p>
              </div>
            ) : results ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-[#0a0a18] rounded-lg overflow-hidden">
                    <thead className="bg-[#16162a]">
                      <tr>
                        {results.columns.map((column, index) => (
                          <th key={index} className="py-3 px-4 text-left">
                            <div className="flex items-center">
                              {column}
                              <button className="ml-1 text-gray-400 hover:text-white">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`border-b border-gray-800 hover:bg-[#16162a] ${rowIndex % 2 === 0 ? 'bg-[#0f0f1e]' : ''}`}>
                          {results.columns.map((column, colIndex) => (
                            <td key={colIndex} className="py-3 px-4">
                              {column.includes('date') || column.includes('time') || column.includes('_at') 
                                ? formatTimestamp(row[column])
                                : String(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Enhanced Result Summary & Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                  <div className="text-sm text-gray-400">
                    <span className="bg-blue-900 bg-opacity-30 text-blue-300 px-2 py-1 rounded">
                      {results.rows.length} {results.rows.length === 1 ? 'row' : 'rows'} in result set
                      {executionTime && ` • ${executionTime}s`}
                    </span>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                      >
                        &laquo;
                      </button>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                      >
                        &lt;
                      </button>
                      
                      <select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="bg-[#0a0a18] border border-gray-700 rounded px-2 py-1 text-sm appearance-none"
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Page {i + 1} of {totalPages}
                          </option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                      >
                        &gt;
                      </button>
                      <button 
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                      >
                        &raquo;
                      </button>
                      
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="bg-[#0a0a18] border border-gray-700 rounded px-2 py-1 text-sm"
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-[#0a0a18] p-6 rounded-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400">No query results to display.</p>
                <p className="text-gray-500 text-sm mt-1">Use the editor above to write and execute SQL queries.</p>
                <button 
                  onClick={() => setShowPredefinedQueries(true)}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  Browse pre-defined queries
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Helpers */}
        <div className="lg:w-1/3 space-y-4">
          {/* Quick Access Query Categories */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-400 mb-3">Quick Query Categories</h2>
            <div className="grid grid-cols-2 gap-2">
              {queryCategories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowPredefinedQueries(true);
                  }}
                  className="bg-[#2d2d4a] hover:bg-[#3a3a5e] p-2 rounded-md flex flex-col items-center"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-xs text-gray-400 mt-1">{groupedQueries[category].length} queries</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Top 5 Common Queries */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-400 mb-3">Common Queries</h2>
            <div className="space-y-2">
              {predefinedQueries.slice(0, 5).map((preQuery, index) => (
                <div 
                  key={index} 
                  onClick={() => handlePredefinedQuery(preQuery.query)}
                  className="bg-[#2d2d4a] hover:bg-[#3a3a5e] p-3 rounded-md cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{preQuery.name}</p>
                    <span className="text-xs bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">{preQuery.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{preQuery.description}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowPredefinedQueries(true)}
              className="mt-3 w-full bg-blue-800 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-sm flex items-center justify-center"
            >
              View All Queries
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          
          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-blue-400">Recent Queries</h2>
                <button 
                  onClick={() => {
                    if (confirm("Clear query history?")) {
                      setQueryHistory([]);
                      localStorage.removeItem('sqlQueryHistory');
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {queryHistory.map((historyItem, index) => (
                  <div 
                    key={index} 
                    onClick={() => setQuery(historyItem)}
                    className="bg-[#0a0a18] hover:bg-[#16162a] p-2 rounded-md cursor-pointer"
                  >
                    <p className="text-xs font-mono truncate">{historyItem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Database Schema Browser */}
          {showSchema && (
            <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-400 mb-3">Schema Browser</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {sampleSchema.map(table => (
                  <div key={table.tableName} className="border border-gray-700 rounded-md overflow-hidden">
                    <div 
                      onClick={() => toggleTableExpand(table.tableName)}
                      className="bg-[#2d2d4a] p-2 cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <svg className={`h-4 w-4 mr-1 ${expandedTable === table.tableName ? 'text-blue-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="font-medium">{table.tableName}</span>
                      </div>
                      <span>{expandedTable === table.tableName ? '−' : '+'}</span>
                    </div>
                    {expandedTable === table.tableName && (
                      <div className="bg-[#0a0a18] p-2">
                        {table.columns.map(column => (
                          <div key={column.name} className="py-1 border-b border-gray-800 last:border-b-0 flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              column.primary ? 'bg-yellow-500' : 
                              column.foreign ? 'bg-blue-500' : 
                              'bg-gray-500'
                            }`}></div>
                            <div className="flex items-center flex-1">
                              <span className="font-mono text-sm">{column.name}</span>
                              <span className="ml-2 text-xs text-gray-400">{column.type}</span>
                            </div>
                            <div className="flex">
                              {column.primary && <span className="text-xs bg-yellow-900 text-yellow-300 px-1 rounded mr-1">PK</span>}
                              {column.foreign && (
                                <span 
                                  className="text-xs bg-blue-900 text-blue-300 px-1 rounded cursor-help"
                                  title={`References ${column.foreign}`}
                                >
                                  FK
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 text-right">
                          <button
                            onClick={() => {
                              const columnsText = table.columns.map(c => c.name).join(', ');
                              const newQuery = `SELECT ${columnsText} FROM ${table.tableName} LIMIT 10;`;
                              setQuery(newQuery);
                              setShowSchema(false);
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Query All Columns
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-900 bg-opacity-20 p-3 rounded-md">
                <p className="text-sm text-blue-300">
                  <strong>Tip:</strong> Click on a table to see its columns. Click "Query All Columns" to generate a basic SELECT statement.
                </p>
              </div>
            </div>
          )}
          
          {/* Help & Documentation */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Help & Resources</h2>
            <div className="space-y-3">
              <p className="text-sm">
                This is a read-only SQL interface. You can query the database but cannot modify data.
              </p>
              <div>
                <h3 className="text-sm font-semibold">Quick SQL Reference:</h3>
                <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-gray-300">
                  <li>SELECT * FROM table_name</li>
                  <li>SELECT column1, column2 FROM table_name WHERE condition</li>
                  <li>SELECT * FROM table1 JOIN table2 ON table1.column = table2.column</li>
                  <li>SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count FROM table GROUP BY date</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <a 
                  href="#" 
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('SQL Documentation would open here');
                  }}
                >
                  Full Documentation
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Admin-only Notice */}
          <div className="bg-yellow-900 bg-opacity-20 p-3 rounded-md border border-yellow-800">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-300">
                <strong>Admin-only area:</strong> This SQL Query interface is restricted to admin users. All queries are logged for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
