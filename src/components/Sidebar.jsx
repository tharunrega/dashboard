import React from 'react';
// Import icons
import homeIcon from '../assets/icons/home.svg';
import gridViewIcon from '../assets/icons/grid_view.svg';
import categorySearchIcon from '../assets/icons/category_search.svg';
import categoryIcon from '../assets/icons/category.svg';
import editCalendarIcon from '../assets/icons/edit_calendar.svg';
import assignmentTurnedInIcon from '../assets/icons/assignment_turned_in.svg';
import settingsIcon from '../assets/icons/settings.svg';

export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { name: 'Home', icon: homeIcon, section: 'home' },
    { name: 'User Dashboard', icon: gridViewIcon, section: 'user-dashboard' },
    { name: 'Story Imports', icon: categorySearchIcon, section: 'story-imports' },
    { name: 'User Story', icon: categoryIcon, section: 'user-story' },
    { name: 'Moderation', icon: editCalendarIcon, section: 'moderation' },
    { name: 'SQL Query', icon: assignmentTurnedInIcon, section: 'sql-query' },
    { name: 'Genre', icon: settingsIcon, section: 'genre' },
    { name: 'Quote', icon: settingsIcon, section: 'quote' }
  ];

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <aside className="w-[248px] h-screen fixed bg-[#0F0F1C] p-8 flex flex-col gap-12 text-white">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <div className="w-9 h-9 rounded-full bg-white"></div>
        <span className="text-xl font-medium">Kahani Kids</span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
              activeSection === item.section ? 'bg-[#23233F]' : 'hover:bg-[#23233F]/70'
            }`}
            onClick={() => handleMenuClick(item.section)}
          >
            <img src={item.icon} alt={item.name} className="w-5 h-5" />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}