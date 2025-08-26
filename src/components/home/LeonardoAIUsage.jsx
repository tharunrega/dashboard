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
  Area,
  AreaChart,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Sample data for Leonardo AI API credit usage
const allLeonardoData = [
  { name: "2023-07-10", used: 120, remaining: 880, totalCredits: 1000, chatGPTCost: 12.40 },
  { name: "2023-07-11", used: 250, remaining: 750, totalCredits: 1000, chatGPTCost: 14.30 },
  { name: "2023-07-12", used: 320, remaining: 680, totalCredits: 1000, chatGPTCost: 11.90 },
  { name: "2023-07-13", used: 400, remaining: 600, totalCredits: 1000, chatGPTCost: 15.60 },
  { name: "2023-07-14", used: 480, remaining: 520, totalCredits: 1000, chatGPTCost: 17.20 },
  { name: "2023-07-15", used: 520, remaining: 480, totalCredits: 1000, chatGPTCost: 20.50 },
  { name: "2023-07-16", used: 570, remaining: 430, totalCredits: 1000, chatGPTCost: 18.90 },
  { name: "2023-07-17", used: 620, remaining: 380, totalCredits: 1000, chatGPTCost: 22.40 },
  { name: "2023-07-18", used: 680, remaining: 320, totalCredits: 1000, chatGPTCost: 25.10 },
  { name: "2023-07-19", used: 720, remaining: 280, totalCredits: 1000, chatGPTCost: 23.80 },
  { name: "2023-07-20", used: 780, remaining: 220, totalCredits: 1000, chatGPTCost: 30.60 },  // New feature launch
  { name: "2023-07-21", used: 800, remaining: 200, totalCredits: 1000, chatGPTCost: 29.40 },
  { name: "2023-07-22", used: 830, remaining: 170, totalCredits: 1000, chatGPTCost: 27.80 },
  { name: "2023-07-23", used: 850, remaining: 150, totalCredits: 1000, chatGPTCost: 26.10 },
  { name: "2023-07-24", used: 880, remaining: 120, totalCredits: 1000, chatGPTCost: 24.50 },
  { name: "2023-07-25", used: 900, remaining: 100, totalCredits: 1000, chatGPTCost: 28.90 }, // Credit refill warning
  { name: "2023-07-26", used: 930, remaining: 70, totalCredits: 1000, chatGPTCost: 32.40 },
  { name: "2023-07-27", used: 950, remaining: 50, totalCredits: 1000, chatGPTCost: 35.80 },
];

// Key events/milestones to plot on the chart
const keyEvents = [
  { date: "2023-07-20", name: "High-Res Images", description: "Started using high-resolution image generation" },
  { date: "2023-07-25", name: "Credit Alert", description: "Low credit warning triggered" }
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
          <p key={index} className={`text-sm font-semibold ${
            entry.name === 'used' ? 'text-orange-400' : 
            entry.name === 'remaining' ? 'text-blue-400' : 
            entry.name === 'chatGPTCost' ? 'text-green-400' : 'text-gray-400'
          }`}>
            {`${
              entry.name === 'used' ? 'Used Credits: ' : 
              entry.name === 'remaining' ? 'Remaining Credits: ' :
              entry.name === 'chatGPTCost' ? 'ChatGPT Cost: $' : ''
            }${
              entry.name === 'chatGPTCost' ? entry.value.toFixed(2) : entry.value
            }`}
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

// Visualization options
const visualizationOptions = [
  { label: "Stacked Area", value: "area" },
  { label: "Line Chart", value: "line" },
];

// Credit threshold for alerts
const LOW_CREDIT_THRESHOLD = 100;

export default function LeonardoAIUsage() {
  const [selectedRange, setSelectedRange] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [visualization, setVisualization] = useState("area");
  const [showVisualizationDropdown, setShowVisualizationDropdown] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // For custom date range
  const [startDateInput, setStartDateInput] = useState(allLeonardoData[0].name);
  const [endDateInput, setEndDateInput] = useState(allLeonardoData[allLeonardoData.length-1].name);
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(allLeonardoData.length-1);
  const [customFilteredData, setCustomFilteredData] = useState(allLeonardoData);
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
    filteredData = allLeonardoData.slice(currentRange.startIndex, currentRange.endIndex + 1);
    startDate = filteredData[0].name;
    endDate = filteredData[filteredData.length - 1].name;
  }
  
  // Update custom filtered data when date inputs change
  useEffect(() => {
    if (isCustomRange) {
      const filteredData = allLeonardoData.filter(item => 
        item.name >= startDateInput && item.name <= endDateInput
      );
      setCustomFilteredData(filteredData);
    }
  }, [startDateInput, endDateInput, isCustomRange]);
  
  // Update date inputs when slider changes
  useEffect(() => {
    setStartDateInput(allLeonardoData[sliderStart].name);
    setEndDateInput(allLeonardoData[sliderEnd].name);
  }, [sliderStart, sliderEnd]);

  // Calculate metrics for the selected period
  const currentRemaining = filteredData.length > 0 ? filteredData[filteredData.length - 1].remaining : 0;
  const totalCredits = filteredData.length > 0 ? filteredData[filteredData.length - 1].totalCredits : 0;
  const usedCredits = totalCredits - currentRemaining;
  const usedPercentage = (usedCredits / totalCredits) * 100;
  const isLowCredit = currentRemaining <= LOW_CREDIT_THRESHOLD;
  
  // Calculate average daily usage
  const firstDayUsed = filteredData.length > 0 ? filteredData[0].used : 0;
  const lastDayUsed = filteredData.length > 0 ? filteredData[filteredData.length - 1].used : 0;
  const usageInPeriod = lastDayUsed - firstDayUsed;
  const averageDailyUsage = filteredData.length > 0 ? usageInPeriod / filteredData.length : 0;
  
  // Calculate days until depletion at current usage rate
  const daysUntilDepletion = averageDailyUsage > 0 ? Math.round(currentRemaining / averageDailyUsage) : 999;
  
  // Total ChatGPT cost in the same period for comparison
  const totalChatGPTCost = filteredData.reduce((sum, item) => sum + item.chatGPTCost, 0);
  
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

  // Format for credit gauge
  const creditGaugeData = [
    {
      name: 'Remaining',
      value: currentRemaining,
      fill: isLowCredit ? '#ef4444' : '#3b82f6',
    },
  ];

  return (
    <div className="bg-[#202031] p-6 rounded-xl shadow-lg w-full mt-8 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-white">Leonardo AI API Credits</h2>
          {isLowCredit && (
            <div className="text-xs px-2 py-1 rounded-full font-medium bg-red-900 text-red-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Low Credits Alert
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Visualization selector */}
          <div className="relative">
            <div 
              className="text-xs text-gray-300 flex items-center gap-1 cursor-pointer border border-gray-700 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700"
              onClick={() => setShowVisualizationDropdown(!showVisualizationDropdown)}
            >
              <span>View: {visualizationOptions.find(o => o.value === visualization).label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showVisualizationDropdown && (
              <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-md z-10 w-36">
                {visualizationOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="px-4 py-2 text-xs hover:bg-gray-700 cursor-pointer text-gray-200"   
                    onClick={() => {
                      setVisualization(option.value);
                      setShowVisualizationDropdown(false);
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
                min={allLeonardoData[0].name}
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
                max={allLeonardoData[allLeonardoData.length-1].name}
              />
            </div>
          </div>

          {/* Simplified slider implementation */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{allLeonardoData[0].name}</span>
              <span>{allLeonardoData[allLeonardoData.length-1].name}</span>
            </div>
            
            {/* Start slider */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 block mb-1">Start Position</label>
              <input
                type="range"
                min={0}
                max={allLeonardoData.length - 1}
                value={sliderStart}
                onChange={(e) => {
                  const newStart = Math.min(parseInt(e.target.value), sliderEnd);
                  setSliderStart(newStart);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-blue-400 mt-1">{allLeonardoData[sliderStart].name}</div>
            </div>
            
            {/* End slider */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">End Position</label>
              <input
                type="range"
                min={0}
                max={allLeonardoData.length - 1}
                value={sliderEnd}
                onChange={(e) => {
                  const newEnd = Math.max(parseInt(e.target.value), sliderStart);
                  setSliderEnd(newEnd);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-blue-400 mt-1">{allLeonardoData[sliderEnd].name}</div>
            </div>
            
            {/* Selected range visual */}
            <div className="mt-4 px-2 py-1 bg-blue-900 border border-blue-700 rounded text-xs text-blue-300 text-center">
              Selected range: {allLeonardoData[sliderStart].name} to {allLeonardoData[sliderEnd].name}
            </div>
          </div>
        </div>
      )}

      {/* Credit summary and gauge */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-2">
          <div className="relative h-full flex flex-col justify-center items-center bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1 text-center">Remaining Credits</div>
            <div className={`text-3xl font-bold ${
              isLowCredit ? 'text-red-400' : 'text-blue-400'
            }`}>
              {currentRemaining}
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0</span>
                <span>{totalCredits}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    currentRemaining < 100 ? 'bg-red-500' : 
                    currentRemaining < 300 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(currentRemaining / totalCredits) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-center mt-2 text-gray-400">
                {usedPercentage.toFixed(1)}% used
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Daily Usage</div>
              <div className="text-xl font-semibold text-orange-400">
                {Math.round(averageDailyUsage)}
              </div>
              <div className="text-xs text-gray-400 mt-1">credits/day</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Days Left</div>
              <div className={`text-xl font-semibold ${
                daysUntilDepletion < 7 ? 'text-red-400' :
                daysUntilDepletion < 14 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {daysUntilDepletion > 365 ? '365+' : daysUntilDepletion}
              </div>
              <div className="text-xs text-gray-400 mt-1">at current rate</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">ChatGPT Cost</div>
              <div className="text-xl font-semibold text-green-400">
                ${totalChatGPTCost.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">same period</div>
            </div>
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
          {visualization === "area" ? (
            <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Area 
                type="monotone" 
                dataKey="used" 
                stackId="1"
                stroke="#f97316" 
                fill="#9a3412" 
                name="used"
              />
              <Area 
                type="monotone" 
                dataKey="remaining" 
                stackId="1"
                stroke="#60a5fa" 
                fill="#1e40af" 
                name="remaining"
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

              {/* Low credit warning threshold */}
              <ReferenceLine 
                y={LOW_CREDIT_THRESHOLD} 
                label={{ 
                  value: 'Low Credit Alert', 
                  position: 'left', 
                  fill: '#ef4444',
                  fontSize: 10
                }} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
              />
            </AreaChart>
          ) : (
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
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="used" 
                stroke="#f97316" 
                strokeWidth={3} 
                dot={{ r: 3, strokeWidth: 2, fill: "#9a3412" }}
                activeDot={{ r: 5, strokeWidth: 2 }}
                name="used"
              />
              <Line 
                type="monotone" 
                dataKey="remaining" 
                stroke="#60a5fa" 
                strokeWidth={3} 
                dot={{ r: 3, strokeWidth: 2, fill: "#1e40af" }}
                activeDot={{ r: 5, strokeWidth: 2 }}
                name="remaining"
              />
              <Line 
                type="monotone" 
                dataKey="chatGPTCost" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ r: 2, strokeWidth: 2, fill: "#065f46" }}
                name="chatGPTCost"
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

              {/* Low credit warning threshold */}
              <ReferenceLine 
                y={LOW_CREDIT_THRESHOLD} 
                label={{ 
                  value: 'Low Credit Alert', 
                  position: 'left', 
                  fill: '#ef4444',
                  fontSize: 10
                }} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}