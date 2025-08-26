import React from 'react';
// Import icons
import cloudAlertIcon from '../../assets/icons/cloud_alert.svg';
import lanIcon from '../../assets/icons/lan.svg';
import gppBadIcon from '../../assets/icons/gpp_bad.svg';
import desktopWindowsIcon from '../../assets/icons/desktop_windows.svg';
// Import trend icons
import trendingUpIcon from '../../assets/icons/trending_up.svg';
import trendingDownIcon from '../../assets/icons/trending_down.svg';

const cards = [
  { 
    label: 'Total Users', 
    number: 1013, 
    icon: cloudAlertIcon,
    trend: 'up',
    percentage: 1.2,
    period: 'MoM'
  },
  { 
    label: 'Deleted Users', 
    number: 503, 
    icon: lanIcon,
    trend: 'down',
    percentage: 0.8,
    period: 'MoM'
  },
  { 
    label: 'Story', 
    number: 11345, 
    icon: gppBadIcon,
    trend: 'up',
    percentage: 2.4,
    period: 'MoM'
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 my-10">
      {cards.map((card, i) => (
        <div key={i} className="bg-gradient-to-br from-[#23233F] to-[#371D41] p-6 rounded-3xl flex items-center gap-10 h-32">
          <div className="w-12 h-12 bg-[#0F0F1C]/50 rounded-full flex items-center justify-center">
            <img src={card.icon} alt={card.label} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-1">{card.label}</h3>
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold mr-2">{card.number}</span>
              <div className="flex items-center gap-1">
                <img 
                  src={card.trend === 'up' ? trendingUpIcon : trendingDownIcon} 
                  alt={card.trend} 
                  className="w-4 h-4" 
                />
                <span className={`text-xs ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {card.trend === 'up' ? '+' : '-'}{card.percentage}% {card.period}
                </span>
              </div>
            </div>
          </div>
        </div> 
      ))}
    </div>
  );
}