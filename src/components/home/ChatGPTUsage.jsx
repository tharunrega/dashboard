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
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data for ChatGPT API usage with model information
const allChatGPTData = [
  { name: "2023-07-10", cost: 12.40, tokens: 124000, budget: 50, models: {
    "gpt-3.5-turbo": 8.20, "gpt-4o": 4.20, "claude-3-sonnet": 0
  }},
  { name: "2023-07-11", cost: 14.30, tokens: 143000, budget: 50, models: {
    "gpt-3.5-turbo": 9.10, "gpt-4o": 5.20, "claude-3-sonnet": 0
  }},
  { name: "2023-07-12", cost: 11.90, tokens: 119000, budget: 50, models: {
    "gpt-3.5-turbo": 7.40, "gpt-4o": 4.50, "claude-3-sonnet": 0
  }},
  { name: "2023-07-13", cost: 15.60, tokens: 156000, budget: 50, models: {
    "gpt-3.5-turbo": 8.80, "gpt-4o": 6.80, "claude-3-sonnet": 0
  }},
  { name: "2023-07-14", cost: 17.20, tokens: 172000, budget: 50, models: {
    "gpt-3.5-turbo": 10.20, "gpt-4o": 7.00, "claude-3-sonnet": 0
  }},
  { name: "2023-07-15", cost: 20.50, tokens: 205000, budget: 50, models: {
    "gpt-3.5-turbo": 12.10, "gpt-4o": 8.40, "claude-3-sonnet": 0
  }},
  { name: "2023-07-16", cost: 18.90, tokens: 189000, budget: 50, models: {
    "gpt-3.5-turbo": 10.70, "gpt-4o": 8.20, "claude-3-sonnet": 0
  }},
  { name: "2023-07-17", cost: 22.40, tokens: 224000, budget: 50, models: {
    "gpt-3.5-turbo": 12.80, "gpt-4o": 9.60, "claude-3-sonnet": 0
  }},
  { name: "2023-07-18", cost: 25.10, tokens: 251000, budget: 50, models: {
    "gpt-3.5-turbo": 13.90, "gpt-4o": 11.20, "claude-3-sonnet": 0
  }},
  { name: "2023-07-19", cost: 23.80, tokens: 238000, budget: 50, models: {
    "gpt-3.5-turbo": 13.10, "gpt-4o": 10.70, "claude-3-sonnet": 0
  }},
  { name: "2023-07-20", cost: 30.60, tokens: 306000, budget: 50, models: {
    "gpt-3.5-turbo": 14.50, "gpt-4o": 13.20, "claude-3-sonnet": 2.90  // Claude-3 trial started
  }},
  { name: "2023-07-21", cost: 29.40, tokens: 294000, budget: 50, models: {
    "gpt-3.5-turbo": 13.80, "gpt-4o": 12.10, "claude-3-sonnet": 3.50
  }},
  { name: "2023-07-22", cost: 27.80, tokens: 278000, budget: 50, models: {
    "gpt-3.5-turbo": 12.90, "gpt-4o": 11.40, "claude-3-sonnet": 3.50
  }},
  { name: "2023-07-23", cost: 26.10, tokens: 261000, budget: 50, models: {
    "gpt-3.5-turbo": 11.70, "gpt-4o": 10.80, "claude-3-sonnet": 3.60
  }},
  { name: "2023-07-24", cost: 24.50, tokens: 245000, budget: 50, models: {
    "gpt-3.5-turbo": 10.30, "gpt-4o": 10.20, "claude-3-sonnet": 4.00
  }},
  { name: "2023-07-25", cost: 28.90, tokens: 289000, budget: 50, models: {
    "gpt-3.5-turbo": 11.40, "gpt-4o": 11.90, "claude-3-sonnet": 5.60  // Increased Claude usage
  }},
  { name: "2023-07-26", cost: 32.40, tokens: 324000, budget: 50, models: {
    "gpt-3.5-turbo": 12.10, "gpt-4o": 13.50, "claude-3-sonnet": 6.80
  }},
  { name: "2023-07-27", cost: 35.80, tokens: 358000, budget: 50, models: {
    "gpt-3.5-turbo": 12.80, "gpt-4o": 14.90, "claude-3-sonnet": 8.10
  }},
];

// Model details - colors and display names
const modelDetails = {
  "gpt-3.5-turbo": { color: "#10b981", displayName: "GPT-3.5 Turbo" },
  "gpt-4o": { color: "#6366f1", displayName: "GPT-4o" },
  "claude-3-sonnet": { color: "#8b5cf6", displayName: "Claude 3 Sonnet" }
};

// Key events/milestones to plot on the chart
const keyEvents = [
  { date: "2023-07-20", name: "Claude Integration", description: "Added Claude 3 Sonnet to model mix" },
  { date: "2023-07-25", name: "Cost Optimization", description: "Implemented token usage optimization" }
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Find if there's an event on this date
    const event = keyEvents.find(e => e.date === label);
    
    // Extract model data if available in the payload
    const modelData = payload.find(p => p.dataKey.includes('models'));
    
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
        <p className="text-sm font-medium text-gray-800">{`Date: ${label}`}</p>
        
        {/* Show main metrics */}
        {payload.filter(p => !p.dataKey.includes('models')).map((entry, index) => (
          <p key={index} className={`text-sm font-semibold ${
            entry.name === 'cost' ? 'text-green-600' : 
            entry.name === 'tokens' ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {`${entry.name === 'cost' ? 'Cost: $' : entry.name === 'tokens' ? 'Tokens: ' : ''}${
              entry.name === 'cost' ? entry.value.toFixed(2) : 
              entry.name === 'tokens' ? (entry.value).toLocaleString() : entry.value
            }`}
          </p>
        ))}

        {/* Show model breakdown if we have it */}
        {modelData && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Model Usage:</p>
            {Object.entries(payload[0].payload.models).map(([model, cost]) => (
              cost > 0 ? (
                <div key={model} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: modelDetails[model].color }}></span>
                    <span className="text-xs">{modelDetails[model].displayName}:</span>
                  </div>
                  <span className="text-xs font-semibold">${cost.toFixed(2)}</span>
                </div>
              ) : null
            ))}
          </div>
        )}
        
        {/* Show event information */}
        {event && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-bold text-purple-600">{event.name}</p>
            <p className="text-xs text-gray-500">{event.description}</p>
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

// Data visualization options
const visualizationOptions = [
  { label: "Cost", value: "cost" },
  { label: "Tokens", value: "tokens" },
  { label: "Models", value: "models" },
];

export default function ChatGPTUsage() {
  const [selectedRange, setSelectedRange] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [visualization, setVisualization] = useState("cost");
  const [showVisualizationDropdown, setShowVisualizationDropdown] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  // For custom date range
  const [startDateInput, setStartDateInput] = useState(allChatGPTData[0].name);
  const [endDateInput, setEndDateInput] = useState(allChatGPTData[allChatGPTData.length-1].name);
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(allChatGPTData.length-1);
  const [customFilteredData, setCustomFilteredData] = useState(allChatGPTData);
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
    filteredData = allChatGPTData.slice(currentRange.startIndex, currentRange.endIndex + 1);
    startDate = filteredData[0].name;
    endDate = filteredData[filteredData.length - 1].name;
  }
  
  // Update custom filtered data when date inputs change
  useEffect(() => {
    if (isCustomRange) {
      const filteredData = allChatGPTData.filter(item => 
        item.name >= startDateInput && item.name <= endDateInput
      );
      setCustomFilteredData(filteredData);
    }
  }, [startDateInput, endDateInput, isCustomRange]);
  
  // Update date inputs when slider changes
  useEffect(() => {
    setStartDateInput(allChatGPTData[sliderStart].name);
    setEndDateInput(allChatGPTData[sliderEnd].name);
  }, [sliderStart, sliderEnd]);

  // Calculate metrics for the selected period
  const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
  const totalTokens = filteredData.reduce((sum, item) => sum + item.tokens, 0);
  const dailyAvgCost = totalCost / filteredData.length;
  const costPerToken = totalCost / totalTokens;
  
  // Calculate monthly budget and usage
  const monthlyBudget = 500; // Example monthly budget
  const monthProgress = (new Date().getDate() / 30) * 100; // Simplified month progress
  const budgetPercentUsed = (totalCost / monthlyBudget) * 100;
  const budgetStatus = budgetPercentUsed > monthProgress 
    ? 'over-budget' 
    : budgetPercentUsed < monthProgress * 0.8 
      ? 'under-budget' 
      : 'on-track';
  
  // Calculate tokens per dollar
  const tokensPerDollar = totalTokens / totalCost;
  
  // Calculate model usage totals
  const modelUsage = {
    "gpt-3.5-turbo": 0,
    "gpt-4o": 0,
    "claude-3-sonnet": 0
  };
  
  filteredData.forEach(day => {
    Object.entries(day.models).forEach(([model, cost]) => {
      modelUsage[model] += cost;
    });
  });
  
  // Convert model usage to array for pie chart
  const modelUsagePieData = Object.entries(modelUsage)
    .filter(([_, cost]) => cost > 0)
    .map(([model, cost]) => ({
      name: modelDetails[model].displayName,
      value: cost,
      color: modelDetails[model].color
    }));
  
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
    <div className="bg-[#202031] p-6 rounded-xl shadow-sm w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-white">ChatGPT API Usage Cost</h2>
          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
            budgetStatus === 'under-budget' ? 'bg-green-100 text-green-600' : 
            budgetStatus === 'over-budget' ? 'bg-red-100 text-red-600' : 
            'bg-yellow-100 text-yellow-600'
          }`}>
            {budgetStatus === 'under-budget' ? 'Under Budget' : 
             budgetStatus === 'over-budget' ? 'Over Budget' : 'On Track'}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Visualization selector */}
          <div className="relative">
            <div 
              className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer border border-gray-200 px-3 py-1 rounded-md"
              onClick={() => setShowVisualizationDropdown(!showVisualizationDropdown)}
            >
              <span>Show: {visualizationOptions.find(o => o.value === visualization).label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showVisualizationDropdown && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-36">
                {visualizationOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer text-black"   
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
              showEventMarkers ? 'bg-purple-100 border-purple-300 text-purple-600' : 'border-gray-200 text-gray-500'
            }`}
            onClick={() => setShowEventMarkers(!showEventMarkers)}
          >
            Show Events
          </div>

          {/* Date range selector */}
          <div className="relative">
            <div 
              className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer border border-gray-200 px-3 py-1 rounded-md"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{startDate} to {endDate}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-48">
                {dateRanges.map((range, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer text-black"   
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
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Custom Date Range</h3>
            <button 
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md"
              onClick={applyCustomDateRange}
            >
              Apply
            </button>
          </div>
          
          <div className="flex justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                min={allChatGPTData[0].name}
                max={endDateInput}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                min={startDateInput}
                max={allChatGPTData[allChatGPTData.length-1].name}
              />
            </div>
          </div>

          {/* Simplified slider implementation */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{allChatGPTData[0].name}</span>
              <span>{allChatGPTData[allChatGPTData.length-1].name}</span>
            </div>
            
            {/* Start slider */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">Start Position</label>
              <input
                type="range"
                min={0}
                max={allChatGPTData.length - 1}
                value={sliderStart}
                onChange={(e) => {
                  const newStart = Math.min(parseInt(e.target.value), sliderEnd);
                  setSliderStart(newStart);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="text-xs text-green-600 mt-1">{allChatGPTData[sliderStart].name}</div>
            </div>
            
            {/* End slider */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">End Position</label>
              <input
                type="range"
                min={0}
                max={allChatGPTData.length - 1}
                value={sliderEnd}
                onChange={(e) => {
                  const newEnd = Math.max(parseInt(e.target.value), sliderStart);
                  setSliderEnd(newEnd);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="text-xs text-green-600 mt-1">{allChatGPTData[sliderEnd].name}</div>
            </div>
            
            {/* Selected range visual */}
            <div className="mt-4 px-2 py-1 bg-green-50 border border-green-100 rounded text-xs text-green-600 text-center">
              Selected range: {allChatGPTData[sliderStart].name} to {allChatGPTData[sliderEnd].name}
            </div>
          </div>
        </div>
      )}

      {/* Cost summary and budget tracking */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-black-700">Total Cost for Period</h3>
          <div className="text-xl font-bold text-green-600">${totalCost.toFixed(2)}</div>
        </div>
        
        {/* Budget progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Monthly Budget: ${monthlyBudget.toFixed(2)}</span>
            <span>Used: {budgetPercentUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                budgetPercentUsed > 100 ? 'bg-red-500' : 
                budgetPercentUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetPercentUsed, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 flex">
            <div className="border-r border-gray-300 h-2"></div>
            <div 
              className="border-r border-gray-300 h-2"
              style={{ marginLeft: `${monthProgress}%` }}
            ></div>
            <div className="text-xs text-gray-500 ml-1" style={{ marginLeft: `${monthProgress}%` }}>
              Month progress: {monthProgress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Model usage breakdown */}
      {visualization === "models" && (
        <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Model Usage Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex justify-center">
              <div className="w-[140px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelUsagePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {modelUsagePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-2">
                {modelUsagePieData.map((model, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }}></div>
                      <span className="text-sm font-medium text-gray-200">{model.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-green-400">${model.value.toFixed(2)}</span>
                      <span className="text-xs text-gray-400">{(model.value / totalCost * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-gray-600 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">Total</span>
                  <span className="text-sm font-bold text-green-400">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Daily Average Cost</div>
          <div className="text-xl font-semibold text-green-400">
            ${dailyAvgCost.toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Total Tokens</div>
          <div className="text-xl font-semibold text-gray-200">
            {totalTokens.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Cost per 1K Tokens</div>
          <div className="text-xl font-semibold text-green-400">
            ${(costPerToken * 1000).toFixed(3)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Tokens per $1</div>
          <div className="text-xl font-semibold text-gray-200">
            {Math.round(tokensPerDollar).toLocaleString()}
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
          {visualization === "models" ? (
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="models.gpt-3.5-turbo" 
                stackId="a" 
                name={modelDetails["gpt-3.5-turbo"].displayName} 
                fill={modelDetails["gpt-3.5-turbo"].color} 
              />
              <Bar 
                dataKey="models.gpt-4o" 
                stackId="a" 
                name={modelDetails["gpt-4o"].displayName} 
                fill={modelDetails["gpt-4o"].color} 
              />
              <Bar 
                dataKey="models.claude-3-sonnet" 
                stackId="a" 
                name={modelDetails["claude-3-sonnet"].displayName} 
                fill={modelDetails["claude-3-sonnet"].color} 
              />
              {/* Reference lines for events */}
              {showEventMarkers && visibleEvents.map((event, i) => (
                <ReferenceLine
                  key={i}
                  x={event.date}
                  stroke="#8b5cf6"
                  strokeDasharray="3 3"
                  label={{
                    value: event.name,
                    position: 'insideTopRight',
                    fill: '#8b5cf6',
                    fontSize: 10
                  }}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {visualization === "cost" ? (
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  name="cost"
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#4338ca" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  name="tokens"
                />
              )}

              {/* Reference lines for events */}
              {showEventMarkers && visibleEvents.map((event, i) => (
                <ReferenceLine
                  key={i}
                  x={event.date}
                  stroke="#8b5cf6"
                  strokeDasharray="3 3"
                  label={{
                    value: event.name,
                    position: 'insideTopRight',
                    fill: '#8b5cf6',
                    fontSize: 10
                  }}
                />
              ))}

              {/* Budget reference line */}
              {visualization === "cost" && (
                <ReferenceLine 
                  y={50} 
                  label={{ 
                    value: 'Daily Budget', 
                    position: 'right', 
                    fill: '#ef4444',
                    fontSize: 10
                  }} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}