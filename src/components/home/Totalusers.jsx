import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

// Sample data matching the trend from StatsCards component
const allUserData = [
  { name: "2023-07-10", users: 40, lastYearUsers: 35 },
  { name: "2023-07-11", users: 42, lastYearUsers: 37 },
  { name: "2023-07-12", users: 45, lastYearUsers: 38 },
  { name: "2023-07-13", users: 43, lastYearUsers: 40 },
  { name: "2023-07-14", users: 47, lastYearUsers: 39 },
  { name: "2023-07-15", users: 50, lastYearUsers: 42 },
  { name: "2023-07-16", users: 47, lastYearUsers: 44 },
  { name: "2023-07-17", users: 45, lastYearUsers: 45 },
  { name: "2023-07-18", users: 52, lastYearUsers: 46 },
  { name: "2023-07-19", users: 48, lastYearUsers: 47 },
  { name: "2023-07-20", users: 61, lastYearUsers: 48 },  // New feature launch
  { name: "2023-07-21", users: 55, lastYearUsers: 50 },
  { name: "2023-07-22", users: 48, lastYearUsers: 49 },
  { name: "2023-07-23", users: 38, lastYearUsers: 48 },
  { name: "2023-07-24", users: 32, lastYearUsers: 47 },
  { name: "2023-07-25", users: 35, lastYearUsers: 46 }, // Marketing campaign
  { name: "2023-07-26", users: 40, lastYearUsers: 45 },
  { name: "2023-07-27", users: 42, lastYearUsers: 44 },
];

// Key events/milestones to plot on the chart
const keyEvents = [
  { date: "2023-07-20", name: "New Feature Launch", description: "Added story sharing feature" },
  { date: "2023-07-25", name: "Marketing Campaign", description: "Summer promo campaign started" }
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Find if there's an event on this date
    const event = keyEvents.find(e => e.date === label);
    
    return (
      <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
        <p className="text-sm font-medium text-gray-200">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className={`text-sm ${entry.name === 'users' ? 'text-blue-400' : 'text-gray-400'} font-semibold`}>
            {`${entry.name === 'users' ? 'Current' : 'Last Year'}: ${entry.value}`}
          </p>
        ))}
        {event && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-sm font-bold text-purple-400">{event.name}</p>
            <p className="text-xs text-gray-400">{event.description}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Date range options
const dateRanges = [
  { label: "Last 7 days", startIndex: 11, endIndex: 17 },
  { label: "Last 14 days", startIndex: 4, endIndex: 17 },
  { label: "All data", startIndex: 0, endIndex: 17 },
  { label: "Custom Range", startIndex: 0, endIndex: 17, isCustom: true },
];

// Time comparison options
const comparisonOptions = [
  { label: "None", value: "none" },
  { label: "Last Year", value: "lastYear" },
];

export default function TotalUsers() {
  const [selectedRange, setSelectedRange] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [comparison, setComparison] = useState("none");
  const [showComparisonDropdown, setShowComparisonDropdown] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // For custom date range
  const [startDateInput, setStartDateInput] = useState(allUserData[0].name);
  const [endDateInput, setEndDateInput] = useState(allUserData[allUserData.length-1].name);
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(allUserData.length-1);
  const [customFilteredData, setCustomFilteredData] = useState(allUserData);
  const [isCustomRange, setIsCustomRange] = useState(false);
  
  // Get selected range data
  let filteredData;
  let startDate;
  let endDate;
  
  if (isCustomRange) {
    filteredData = customFilteredData;
    startDate = filteredData.length > 0 ? filteredData[0].name : startDateInput;
    endDate = filteredData.length > 0 ? filteredData[filteredData.length-1].name : endDateInput;
  } else {
    const currentRange = dateRanges[selectedRange];
    filteredData = allUserData.slice(currentRange.startIndex, currentRange.endIndex + 1);
    startDate = filteredData[0].name;
    endDate = filteredData[filteredData.length - 1].name;
  }
  
  // Update custom filtered data when date inputs change
  useEffect(() => {
    if (isCustomRange) {
      const filteredData = allUserData.filter(item => 
        item.name >= startDateInput && item.name <= endDateInput
      );
      setCustomFilteredData(filteredData);
    }
  }, [startDateInput, endDateInput, isCustomRange]);
  
  // Update date inputs when slider changes
  useEffect(() => {
    setStartDateInput(allUserData[sliderStart].name);
    setEndDateInput(allUserData[sliderEnd].name);
  }, [sliderStart, sliderEnd]);

  // Calculate growth rate for the selected period
  const firstValue = filteredData.length > 0 ? filteredData[0].users : 0;
  const lastValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].users : 0;
  const growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100).toFixed(1) : 0;
  
  // Filter events that fall within the selected date range
  const visibleEvents = keyEvents.filter(event => 
    filteredData.some(data => data.name === event.date)
  );

  // Select custom date range
  const selectCustomRange = () => {
    setIsCustomRange(true);
    setSelectedRange(3); // Custom range option
    setShowDropdown(false);
    setShowCustomDateRange(true);
  };
  
  // Apply custom date range
  const applyCustomDateRange = () => {
    setShowCustomDateRange(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full mt-8 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-100">Registered Users</h2>
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
            growthRate > 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
          }`}>
            {growthRate > 0 ? '+' : ''}{growthRate}% growth
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Comparison selector */}
          <div className="relative">
            <div 
              className="text-xs text-gray-300 flex items-center gap-1 cursor-pointer border border-gray-700 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700"
              onClick={() => setShowComparisonDropdown(!showComparisonDropdown)}
            >
              <span>Compare: {comparisonOptions.find(o => o.value === comparison).label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showComparisonDropdown && (
              <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-md z-10 w-36">
                {comparisonOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer text-gray-200"   
                    onClick={() => {
                      setComparison(option.value);
                      setShowComparisonDropdown(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggle events display */}
          <div 
            className={`text-xs cursor-pointer border px-3 py-1 rounded-md ${
              showEventMarkers ? 'bg-purple-900 border-purple-700 text-purple-300' : 'border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setShowEventMarkers(!showEventMarkers)}
          >
            Show Events
          </div>

          {/* Date range selector */}
          <div className="relative">
            <div 
              className="text-xs text-gray-300 flex items-center gap-1 cursor-pointer border border-gray-700 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{startDate} to {endDate}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-md z-10 w-48">
                {dateRanges.map((range, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer text-gray-200"   
                    onClick={() => {
                      if (range.isCustom) {
                        selectCustomRange();
                      } else {
                        setIsCustomRange(false);
                        setSelectedRange(index);
                        setShowDropdown(false);
                      }
                    }}
                  >
                    {range.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {showCustomDateRange && (
        <div className="mb-6 p-4 border border-gray-700 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-200">Custom Date Range</h3>
            <button 
              className="text-xs bg-blue-700 hover:bg-blue-600 text-blue-100 px-3 py-1 rounded-md"
              onClick={applyCustomDateRange}
            >
              Apply
            </button>
          </div>
          
          <div className="flex justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-200"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                min={allUserData[0].name}
                max={endDateInput}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-200"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                min={startDateInput}
                max={allUserData[allUserData.length-1].name}
              />
            </div>
          </div>

          {/* Simplified slider implementation */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{allUserData[0].name}</span>
              <span>{allUserData[allUserData.length-1].name}</span>
            </div>
            
            {/* Start slider */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Start Position</label>
              <input
                type="range"
                min={0}
                max={allUserData.length - 1}
                value={sliderStart}
                onChange={(e) => {
                  const newStart = Math.min(parseInt(e.target.value), sliderEnd);
                  setSliderStart(newStart);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-blue-400 mt-1">{allUserData[sliderStart].name}</div>
            </div>
            
            {/* End slider */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">End Position</label>
              <input
                type="range"
                min={0}
                max={allUserData.length - 1}
                value={sliderEnd}
                onChange={(e) => {
                  const newEnd = Math.max(parseInt(e.target.value), sliderStart);
                  setSliderEnd(newEnd);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-blue-400 mt-1">{allUserData[sliderEnd].name}</div>
            </div>
            
            {/* Selected range visual */}
            <div className="mt-4 px-2 py-1 bg-blue-900 border border-blue-700 rounded text-xs text-blue-300 text-center">
              Selected range: {allUserData[sliderStart].name} to {allUserData[sliderEnd].name}
            </div>
          </div>
        </div>
      )}

      {/* Today's snapshot */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Today</div>
          <div className="text-xl font-semibold text-gray-100">
            {filteredData.length > 0 ? filteredData[filteredData.length-1].users : 0}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Average</div>
          <div className="text-xl font-semibold text-gray-100">
            {filteredData.length > 0 
              ? Math.round(filteredData.reduce((sum, item) => sum + item.users, 0) / filteredData.length)
              : 0
            }
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Highest</div>
          <div className="text-xl font-semibold text-gray-100">
            {filteredData.length > 0 ? Math.max(...filteredData.map(item => item.users)) : 0}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Total</div>
          <div className="text-xl font-semibold text-gray-100">
            {filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + item.users, 0) : 0}
          </div>
        </div>
      </div>

      {/* Key events listing */}
      {showEventMarkers && visibleEvents.length > 0 && (
        <div className="mb-4 bg-purple-900 bg-opacity-30 p-3 rounded-lg border border-purple-800">
          <div className="text-xs font-medium text-purple-300 mb-1">Key Events in Selected Period:</div>
          <div className="flex flex-wrap gap-2">
            {visibleEvents.map((event, i) => (
              <div key={i} className="text-xs bg-gray-800 px-2 py-1 rounded border border-purple-700 text-purple-300">
                {event.date}: {event.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {comparison === "lastYear" && (
              <Line 
                type="monotone" 
                dataKey="lastYearUsers" 
                stroke="#6B7280" 
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1 }}
                name="lastYearUsers"
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#60A5FA" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: "#1E3A8A" }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
              name="users"
            />

            {/* Reference lines for events */}
            {showEventMarkers && visibleEvents.map((event, i) => (
              <ReferenceLine
                key={i}
                x={event.date}
                stroke="#A78BFA"
                strokeDasharray="3 3"
                label={{
                  value: event.name,
                  position: 'insideTopRight',
                  fill: '#C4B5FD',
                  fontSize: 10
                }}
              />
            ))}

            {comparison === "lastYear" && (
              <Legend 
                verticalAlign="top" 
                height={36}
                payload={[
                  { value: 'Current', type: 'line', color: '#60A5FA' },
                  { value: 'Last Year', type: 'line', color: '#6B7280' }
                ]}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}