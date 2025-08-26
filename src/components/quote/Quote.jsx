import React, { useState, useEffect } from 'react';

// Sample quote data - Replace with actual API calls in production
const sampleQuoteData = [
  {
    id: 1,
    title: "A good teacher is like a candle – it consumes itself to light the way for others.",
    author: "Mustafa Kemal Atatürk",
    category: "Education",
    lastUsed: "2025-08-01T10:30:00",
    active: true
  },
  {
    id: 2,
    title: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    category: "Learning",
    lastUsed: "2025-07-25T14:15:00",
    active: true
  },
  {
    id: 3,
    title: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: "Learning",
    lastUsed: "2025-08-05T09:45:00",
    active: true
  },
  {
    id: 4,
    title: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "Education",
    lastUsed: "2025-07-15T16:20:00",
    active: true
  },
  {
    id: 5,
    title: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity",
    lastUsed: "2025-08-10T11:05:00",
    active: true
  },
  {
    id: 6,
    title: "The mind is not a vessel to be filled but a fire to be ignited.",
    author: "Plutarch",
    category: "Inspiration",
    lastUsed: "2025-06-30T08:50:00",
    active: true
  },
  {
    id: 7,
    title: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    author: "Albert Einstein",
    category: "Creativity",
    lastUsed: "2025-07-20T13:25:00",
    active: true
  },
  {
    id: 8,
    title: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    category: "Learning",
    lastUsed: "2025-07-28T15:40:00",
    active: false
  },
  {
    id: 9,
    title: "The only source of knowledge is experience.",
    author: "Albert Einstein",
    category: "Learning",
    lastUsed: "2025-08-07T17:10:00",
    active: true
  },
  {
    id: 10,
    title: "If the universe is the answer, what is the question?",
    author: "Leon Lederman",
    category: "Philosophy",
    lastUsed: "2025-06-15T10:15:00",
    active: true
  }
];

// Available quote categories
const quoteCategories = [
  "Education",
  "Learning",
  "Creativity",
  "Inspiration",
  "Friendship",
  "Growth",
  "Philosophy",
  "Success",
  "Perseverance",
  "Kindness"
];

export default function Quote() {
  const [quotes, setQuotes] = useState(sampleQuoteData);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'lastUsed',
    direction: 'desc'
  });

  // New quote/edit form state
  const [quoteForm, setQuoteForm] = useState({
    id: null,
    title: '',
    author: '',
    category: '',
    active: true
  });

  // Effect for filtering and sorting quotes
  useEffect(() => {
    let filtered = [...quotes];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(quote => quote.category === categoryFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'lastUsed') {
        // Date sorting
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // String sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, categoryFilter, sortConfig]);

  // Handle sorting when column header is clicked
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorting indicator for column headers
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  // Handle opening the add/edit modal
  const openAddEditModal = (quote = null) => {
    if (quote) {
      // Edit mode
      setQuoteForm({
        id: quote.id,
        title: quote.title,
        author: quote.author,
        category: quote.category,
        active: quote.active
      });
      setSelectedQuote(quote);
    } else {
      // Add mode
      setQuoteForm({
        id: null,
        title: '',
        author: '',
        category: quoteCategories[0],
        active: true
      });
      setSelectedQuote(null);
    }
    setShowAddEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteForm({
      ...quoteForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (quoteForm.id) {
      // Update existing quote
      setQuotes(quotes.map(q => q.id === quoteForm.id ? {
        ...q,
        title: quoteForm.title,
        author: quoteForm.author,
        category: quoteForm.category,
        active: quoteForm.active
      } : q));
    } else {
      // Add new quote
      const newQuote = {
        ...quoteForm,
        id: Math.max(...quotes.map(q => q.id)) + 1,
        lastUsed: new Date().toISOString()
      };
      setQuotes([...quotes, newQuote]);
    }
    
    setShowAddEditModal(false);
  };

  // Handle delete quote
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(quotes.filter(quote => quote.id !== id));
    }
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quote Management</h1>
        <button 
          onClick={() => openAddEditModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Quote
        </button>
      </div>
      
      {/* Filters Section */}
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3">
            <label className="block text-sm mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title, author or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            />
          </div>
          <div className="md:w-1/3">
            <label className="block text-sm mb-1">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="all">All Categories</option>
              {quoteCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="md:w-1/3">
            <label className="block text-sm mb-1">Sort by</label>
            <div className="flex">
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
                className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
              >
                <option value="lastUsed-desc">Recently Used</option>
                <option value="lastUsed-asc">Oldest Used</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="category-desc">Category (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quotes Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0a0a18]">
            <thead className="bg-[#16162a]">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Quote{getSortIndicator('title')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    Author{getSortIndicator('author')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category{getSortIndicator('category')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort('lastUsed')}
                >
                  <div className="flex items-center">
                    Last Used{getSortIndicator('lastUsed')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((quote, index) => (
                <tr key={quote.id} className="border-b border-gray-800 hover:bg-[#16162a]">
                  <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-3 px-4 max-w-md">
                    <div className="truncate font-medium" title={quote.title}>
                      "{quote.title}"
                    </div>
                  </td>
                  <td className="py-3 px-4">{quote.author || "Unknown"}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200">
                      {quote.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(quote.lastUsed)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        quote.active 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {quote.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => openAddEditModal(quote)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                        title="Edit Quote"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(quote.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        title="Delete Quote"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No quotes found. Try adjusting your filters or add new quotes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-3 px-4 bg-[#16162a] flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredQuotes.length)} of {filteredQuotes.length} quotes
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
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
                      onClick={() => paginate(pageNum)}
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
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add/Edit Quote Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {selectedQuote ? 'Edit Quote' : 'Add New Quote'}
                </h3>
                <button 
                  onClick={() => setShowAddEditModal(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Quote Text</label>
                    <textarea
                      name="title"
                      value={quoteForm.title}
                      onChange={handleInputChange}
                      placeholder="Enter quote text"
                      className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white h-24"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={quoteForm.author}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <select
                      name="category"
                      value={quoteForm.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                      required
                    >
                      {quoteCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={quoteForm.active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-[#0a0a18] border-gray-700 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm">
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    {selectedQuote ? 'Update Quote' : 'Add Quote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
