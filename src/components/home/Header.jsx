import React, { useState, useEffect } from 'react';
// Import icons
import nestTagIcon from '../../assets/icons/nest_tag.svg';
// Note: If search_icon.svg is missing, you'll need to create or import a different icon

const GlobalSearch = ({ onSearch, defaultDate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchDate, setSearchDate] = useState(defaultDate || new Date().toISOString().split('T')[0]); // Today's date by default
  const [searchHistorical, setSearchHistorical] = useState(false);

  // Update search date if default date changes
  useEffect(() => {
    if (defaultDate) {
      setSearchDate(defaultDate);
    }
  }, [defaultDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    // Call the search function passed from parent
    onSearch({
      term: searchTerm,
      date: searchDate,
      historical: searchHistorical
    });
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search dashboard..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Select date to filter data"
      />
      <div className="flex items-center">
        <input
          id="historical-search"
          type="checkbox"
          checked={searchHistorical}
          onChange={(e) => setSearchHistorical(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="historical-search" className="ml-2 text-sm font-medium text-white">
          Search all history
        </label>
      </div>
      <button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </>
        ) : 'Search'}
      </button>
    </form>
  );
};

// Update Header component to include the search
export default function Header({ onSearch, defaultDate, onDateChange }) {
  const handleGlobalSearch = ({ term, date, historical }) => {
    // Call the parent component's search handler
    if (onSearch) {
      onSearch({
        term,
        date,
        historical
      });
    }
    
    // Update the app-wide selected date if needed
    if (onDateChange && date) {
      onDateChange(date);
    }
    
    // Log for debugging
    console.log(`Searching for "${term}" on date ${date}${historical ? ' (including historical data)' : ''}`);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-10 mt-4 gap-4">
      <div>
        <h1 className="text-white text-2xl mb-2">Dashboard</h1>
        <p className="text-white/80 text-sm">Current view / Assets Status</p>
      </div>
      <div className="flex gap-4 items-center w-full md:w-auto">
        <GlobalSearch onSearch={handleGlobalSearch} defaultDate={defaultDate} />
        <div className="bg-[#371D41] w-8 h-8 rounded-full flex items-center justify-center">
          <img src={nestTagIcon} alt="Notifications" className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}

