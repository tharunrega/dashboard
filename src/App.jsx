import React, { useState, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/home/Header';

// Lazy load components
const StatsCards = lazy(() => import('./components/home/StatsCards'));
const TotalUsers = lazy(() => import('./components/home/Totalusers'));
const ChatGPTUsage = lazy(() => import('./components/home/ChatGPTUsage'));
const LeonardoAIUsage = lazy(() => import('./components/home/LeonardoAIUsage'));
const CreditManagement = lazy(() => import('./components/usersDashboard/EditNewUser')); // Will update the import path once file is renamed
const UserTable = lazy(() => import('./components/usersDashboard/UserTable'));
const Top50userlike = lazy(() => import('./components/usersDashboard/Top50userlike'));
const Top50userStory = lazy(() => import('./components/usersDashboard/Top50userStory'));
const GeneratedStories = lazy(() => import('./components/usersDashboard/GeneratedStories'));
const StoryImports = lazy(() => import('./components/storyImports/StoryImports'));
const UserStory = lazy(() => import('./components/usersDashboard/UserStory'));
const Moderation = lazy(() => import('./components/moderation/Modernatization')); // Will update the import path once file is renamed
const Genre = lazy(() => import('./components/genre/Genre'));
const Quote = lazy(() => import('./components/quote/Quote'));
const SQLQuery = lazy(() => import('./components/sqlQuery/SQLQuery'));
const DailyActiveUsersChart = lazy(() => import('./components/home/DailyActiveUsersChart'));

// Loading component
const LoadingComponent = () => (
  <div className="flex justify-center items-center p-8 text-white">
    <svg className="animate-spin h-10 w-10 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
  </div>
);

// Component name to section mapping
const componentNameToSection = {
  "statscards": "home",
  "stats": "home",
  "statistics": "home",
  "totalusers": "home",
  "users": "home",
  "registered users": "home",
  "dailyactiveuserschart": "home",
  "active users": "home",
  "daily users": "home",
  "daily active users": "home",
  "chatgptusage": "home",
  "chatgpt": "home",
  "gpt": "home",
  "leonardoaiusage": "home",
  "leonardo": "home",
  "ai": "home",
  "editnewuser": "user-dashboard",
  "edit user": "user-dashboard",
  "new user": "user-dashboard",
  "usertable": "user-dashboard",
  "user table": "user-dashboard",
  "user list": "user-dashboard",
  "top50userlike": "user-dashboard",
  "top users": "user-dashboard",
  "user likes": "user-dashboard",
  "top50userstory": "user-dashboard",
  "user stories": "user-dashboard",
  "storyimports": "story-imports",
  "stories": "story-imports",
  "imports": "story-imports",
  "story import": "story-imports",
  "userstory": "user-story",
  "user story": "user-story",
  "modernatization": "moderation",
  "moderation": "moderation",
  "moderate": "moderation",
  "genre": "genre",
  "genres": "genre",
  "quote": "quote",
  "quotes": "quote",
  "sqlquery": "sql-query",
  "sql": "sql-query",
  "query": "sql-query",
  "database": "sql-query",
  "credit management": "user-dashboard", // Add this for the renamed component
  "generated stories": "user-dashboard", // Add this for clarity
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [searchFilters, setSearchFilters] = useState({
    term: '',
    date: selectedDate,
    historical: false
  });

  // Search handler for all components
  const handleSearch = ({ term, date, historical }) => {
    setSearchFilters({
      term,
      date: date || selectedDate,
      historical
    });
    
    // Optionally update the selected date when searching
    if (date) {
      setSelectedDate(date);
    }
  };

  // Date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Reset search
  const handleClearSearch = () => {
    setSearchFilters({
      term: '',
      date: selectedDate,
      historical: false
    });
  };

  // Navigate to a section when a search result is clicked
  const handleSearchResultClick = (section) => {
    setActiveSection(section);
    handleClearSearch();
  };

  // Render search results
  const renderSearchResults = () => {
    const { term, historical } = searchFilters;
    const isSearching = term.trim() !== '';

    if (!isSearching) {
      return null;
    }

    // Search through component names
    const results = Object.keys(componentNameToSection).filter(componentName => 
      componentName.includes(term.toLowerCase().trim())
    ).map(componentName => ({
      name: componentName,
      section: componentNameToSection[componentName]
    }));

    return (
      <div className="bg-[#150D23] rounded-xl p-5 mb-5">
        <h2 className="text-lg font-medium text-white mb-4">Search Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-400">No results found for "{term}"</p>
        ) : (
          <ul className="divide-y divide-gray-800">
            {results.map((result, index) => (
              <li 
                key={index} 
                className="py-2 cursor-pointer hover:bg-[#371D41] px-3 rounded-md transition"
                onClick={() => handleSearchResultClick(result.section)}
              >
                <span className="text-purple-400 capitalize">{result.name}</span>
                <span className="text-gray-400 text-sm ml-2">in {result.section}</span>
              </li>
            ))}
          </ul>
        )}
        <button 
          onClick={handleClearSearch}
          className="mt-4 text-sm text-gray-400 hover:text-white"
        >
          Clear Search
        </button>
      </div>
    );
  };

  // Render content based on active section
  const renderContent = () => {
    // If searching, show search results first
    if (searchFilters.term) {
      return (
        <>
          {renderSearchResults()}
          {renderSectionContent()}
        </>
      );
    }
    
    return renderSectionContent();
  };

  // Render the actual section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <StatsCards selectedDate={selectedDate} />
            <TotalUsers selectedDate={selectedDate} />
            <DailyActiveUsersChart selectedDate={selectedDate} />
            <ChatGPTUsage selectedDate={selectedDate} />
            <LeonardoAIUsage selectedDate={selectedDate} />
          </Suspense>
        );
      case 'user-dashboard':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <div className="space-y-6">
              <UserTable onUserClick={(userId) => console.log(`User clicked: ${userId}`)} selectedDate={selectedDate} searchFilters={searchFilters} />
              <CreditManagement selectedDate={selectedDate} searchFilters={searchFilters} />
              <Top50userStory selectedDate={selectedDate} searchFilters={searchFilters} />
              <GeneratedStories selectedDate={selectedDate} searchFilters={searchFilters} />
            </div>
          </Suspense>
        );
      case 'story-imports':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <StoryImports selectedDate={selectedDate} />
          </Suspense>
        );
      case 'user-story':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <UserStory selectedDate={selectedDate} />
          </Suspense>
        );
      case 'moderation':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <Moderation selectedDate={selectedDate} />
          </Suspense>
        );
      case 'sql-query':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <SQLQuery selectedDate={selectedDate} />
          </Suspense>
        );
      case 'genre':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <Genre selectedDate={selectedDate} />
          </Suspense>
        );
      case 'quote':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <Quote selectedDate={selectedDate} />
          </Suspense>
        );
      default:
        return (
          <div className="text-white text-2xl">
            Select a section from the sidebar
          </div>
        );
    }
  };

  return (
    <div className="flex bg-[#080813] min-h-screen text-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 ml-[248px] p-10">
        <Header 
          onSearch={handleSearch} 
          onDateChange={handleDateChange}
          defaultDate={selectedDate} 
        />
        {renderContent()}
      </main>
    </div>
  );
}
