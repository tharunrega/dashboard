import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data - Replace with actual API calls in production
const sampleGenreData = [
  {
    id: 1,
    name: 'Adventure',
    ageGroup: 'Children 5-8 years',
    title: 'Wild Adventures',
    category: 'Everyday Life',
    image: '/adventures-cover.jpg',
    totalStories: 428,
    totalReads: 25840,
    avgEngagement: 34.2,
    completionRate: 0.72,
    aiRatio: 0.35,
    subGenres: ['Fantasy Adventure', 'Survival Adventure', 'Historical Adventure'],
    trend: 'up', // 'up', 'down', or 'stable'
    trendPercentage: 12, // percentage increase/decrease
  },
  {
    id: 2,
    name: 'Fantasy',
    ageGroup: 'Children 5-8 years',
    title: 'Magical Realms',
    category: 'Imagination',
    image: '/fantasy-cover.jpg',
    totalStories: 356,
    totalReads: 21450,
    avgEngagement: 38.7,
    completionRate: 0.76,
    aiRatio: 0.42,
    subGenres: ['High Fantasy', 'Urban Fantasy', 'Dark Fantasy'],
    trend: 'up',
    trendPercentage: 8,
  },
  {
    id: 3,
    name: 'Science',
    ageGroup: 'Children 5-8 years',
    title: 'Curious & Discovery',
    category: 'Educational',
    image: '/science-cover.jpg',
    totalStories: 287,
    totalReads: 15620,
    avgEngagement: 29.5,
    completionRate: 0.68,
    aiRatio: 0.51,
    subGenres: ['Biology', 'Space Science', 'Earth Science'],
    trend: 'stable',
    trendPercentage: 2,
  },
  {
    id: 4,
    name: 'Fables',
    ageGroup: 'Toddler',
    title: 'Tales & Morals',
    category: 'Values & Socialization',
    image: '/fables-cover.jpg',
    totalStories: 185,
    totalReads: 10250,
    avgEngagement: 26.8,
    completionRate: 0.81,
    aiRatio: 0.28,
    subGenres: ['Animal Fables', 'Moral Stories'],
    trend: 'down',
    trendPercentage: 5,
  },
  {
    id: 5,
    name: 'Drama',
    ageGroup: 'Children 9-12 years',
    title: 'Growing & Emotions',
    category: 'Inspiration',
    image: '/drama-cover.jpg',
    totalStories: 176,
    totalReads: 8650,
    avgEngagement: 31.2,
    completionRate: 0.65,
    aiRatio: 0.38,
    subGenres: ['School Drama', 'Family Drama'],
    trend: 'up',
    trendPercentage: 15,
  },
  {
    id: 6,
    name: 'Bedtime Stories',
    ageGroup: 'All ages',
    title: 'Relaxing',
    category: 'Nature & Environment',
    image: '/bedtime-cover.jpg',
    totalStories: 312,
    totalReads: 22480,
    avgEngagement: 28.9,
    completionRate: 0.79,
    aiRatio: 0.45,
    subGenres: ['Dream Stories', 'Lullaby Stories'],
    trend: 'stable',
    trendPercentage: 1,
  },
  {
    id: 7,
    name: 'Folklore',
    ageGroup: 'Children 5-8 years',
    title: 'Cultural Tales',
    category: 'Global POV & Values',
    image: '/folklore-cover.jpg',
    totalStories: 231,
    totalReads: 14280,
    avgEngagement: 33.4,
    completionRate: 0.71,
    aiRatio: 0.32,
    subGenres: ['Asian Folklore', 'European Folklore', 'African Folklore'],
    trend: 'up',
    trendPercentage: 18,
  },
  {
    id: 8,
    name: 'Nature',
    ageGroup: 'Toddler',
    title: 'World & Ecology',
    category: 'Science & Ecology',
    image: '/nature-cover.jpg',
    totalStories: 197,
    totalReads: 12340,
    avgEngagement: 25.6,
    completionRate: 0.74,
    aiRatio: 0.56,
    subGenres: ['Animal Stories', 'Plant Life', 'Ocean Stories'],
    trend: 'down',
    trendPercentage: 3,
  },
  {
    id: 9,
    name: 'Historical',
    ageGroup: 'Children 9-12 years',
    title: 'Times Past',
    category: 'Cultural History',
    image: '/historical-cover.jpg',
    totalStories: 165,
    totalReads: 9870,
    avgEngagement: 32.1,
    completionRate: 0.69,
    aiRatio: 0.48,
    subGenres: ['Ancient Civilizations', 'World History'],
    trend: 'stable',
    trendPercentage: 0,
  },
  {
    id: 10,
    name: 'Mysteries',
    ageGroup: 'Children 9-12 years',
    title: 'Curious Cases',
    category: 'Problem Solving',
    image: '/mystery-cover.jpg',
    totalStories: 248,
    totalReads: 17650,
    avgEngagement: 36.8,
    completionRate: 0.77,
    aiRatio: 0.41,
    subGenres: ['Detective Stories', 'Enigmas', 'Treasure Hunts'],
    trend: 'up',
    trendPercentage: 9,
  },
];

export default function Genre() {
  const [genres, setGenres] = useState(sampleGenreData);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubGenreModal, setShowSubGenreModal] = useState(false);
  const [newSubGenre, setNewSubGenre] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'totalReads',
    direction: 'desc'
  });
  
  // Sort genres based on current sort configuration
  const sortedGenres = [...genres].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  // Request sort change
  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Data for Top Genres Bar Chart
  const barChartData = {
    labels: genres.slice(0, 5).map(genre => genre.name),
    datasets: [
      {
        label: 'Total Reads',
        data: genres.slice(0, 5).map(genre => genre.totalReads),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Avg. Engagement',
        data: genres.slice(0, 5).map(genre => genre.avgEngagement * 100), // Multiplied for better visualization
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Data for Genre Distribution Pie Chart
  const pieChartData = {
    labels: genres.map(genre => genre.name),
    datasets: [
      {
        label: 'Total Stories',
        data: genres.map(genre => genre.totalStories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(40, 159, 64, 0.6)',
          'rgba(210, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
        }
      },
      title: {
        display: true,
        text: 'Top 5 Genres by Engagement',
        color: '#fff',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Engagement')) {
                // Divide by 100 to get back to the original value
                label += (context.parsed.y / 100).toFixed(1);
              } else {
                label += new Intl.NumberFormat().format(context.parsed.y);
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
    },
  };
  
  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          font: {
            size: 12,
          }
        }
      },
      title: {
        display: true,
        text: 'Distribution of Stories Across Genres',
        color: '#fff',
        font: {
          size: 16,
        }
      }
    }
  };
  
  // Handle adding a new sub-genre
  const handleAddSubGenre = () => {
    if (selectedGenre && newSubGenre.trim()) {
      const updatedGenres = genres.map(genre => {
        if (genre.id === selectedGenre.id) {
          return {
            ...genre,
            subGenres: [...genre.subGenres, newSubGenre.trim()]
          };
        }
        return genre;
      });
      
      setGenres(updatedGenres);
      setNewSubGenre('');
      setShowSubGenreModal(false);
    }
  };
  
  // Get trend icon and color
  const getTrendIcon = (trend, percentage) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          <span>{percentage}%</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 20.293 5.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 9.414l-3.293 3.293A1 1 0 019 12.586V10H7a1 1 0 010-2h5a1 1 0 011 1v2.586l-1-1z" clipRule="evenodd" />
          </svg>
          <span>{percentage}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span>{percentage}%</span>
        </div>
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Genre Management</h1>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-md">
          <div className="h-64">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Genre List</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Genre
        </button>
      </div>
      
      {/* Genres Table */}
      <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0a0a18] rounded-lg">
            <thead className="bg-[#16162a]">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Age Group</th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#1c1c34]"
                  onClick={() => requestSort('totalStories')}
                >
                  <div className="flex items-center">
                    Total Stories
                    {sortConfig.key === 'totalStories' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#1c1c34]"
                  onClick={() => requestSort('totalReads')}
                >
                  <div className="flex items-center">
                    Total Reads
                    {sortConfig.key === 'totalReads' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#1c1c34]"
                  onClick={() => requestSort('avgEngagement')}
                >
                  <div className="flex items-center">
                    Avg. Engagement
                    {sortConfig.key === 'avgEngagement' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-[#1c1c34]"
                  onClick={() => requestSort('completionRate')}
                >
                  <div className="flex items-center">
                    Completion Rate
                    {sortConfig.key === 'completionRate' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-left">AI vs User Ratio</th>
                <th className="py-3 px-4 text-left">Trend</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGenres.map((genre) => (
                <tr key={genre.id} className="border-b border-gray-800 hover:bg-[#16162a]">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center">
                      {/* Replace with actual image in production */}
                      <div className="text-2xl">{genre.name.charAt(0)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{genre.name}</div>
                      <div className="text-xs text-gray-400">{genre.title}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{genre.ageGroup}</td>
                  <td className="py-3 px-4">{genre.totalStories.toLocaleString()}</td>
                  <td className="py-3 px-4">{genre.totalReads.toLocaleString()}</td>
                  <td className="py-3 px-4">{genre.avgEngagement.toFixed(1)}</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${genre.completionRate * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-gray-300">{Math.round(genre.completionRate * 100)}%</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-500" 
                            style={{ width: `${genre.aiRatio * 100}%` }}
                          ></div>
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${(1 - genre.aiRatio) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs whitespace-nowrap">{Math.round(genre.aiRatio * 100)}% AI</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getTrendIcon(genre.trend, genre.trendPercentage)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedGenre(genre);
                          setShowSubGenreModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                        title="Manage Sub-genres"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => alert(`Edit genre: ${genre.name}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                        title="Edit Genre"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => alert(`Delete genre: ${genre.name}`)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        title="Delete Genre"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add New Genre Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Genre</h3>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Genre Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                    placeholder="Enter genre name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Age Group</label>
                  <select className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white">
                    <option value="">Select age group</option>
                    <option>Toddler</option>
                    <option>Children 5-8 years</option>
                    <option>Children 9-12 years</option>
                    <option>All ages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select className="w-full bg-[#0a0a18] border border-gray-700 rounded-md p-2 text-white">
                    <option value="">Select category</option>
                    <option>Everyday Life</option>
                    <option>Imagination</option>
                    <option>Educational</option>
                    <option>Values & Socialization</option>
                    <option>Inspiration</option>
                    <option>Nature & Environment</option>
                    <option>Cultural History</option>
                    <option>Problem Solving</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Genre Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0h-4m-12-4h.01M20 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-400">
                        <label className="relative cursor-pointer bg-[#2d2d4a] rounded-md font-medium text-blue-300 hover:text-blue-200 px-3 py-2">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" />
                        </label>
                        <p className="pl-1 pt-2">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Genre added successfully!');
                    setShowAddModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Add Genre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Manage Sub-genres Modal */}
      {showSubGenreModal && selectedGenre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Manage Sub-genres for {selectedGenre.name}</h3>
                <button 
                  onClick={() => setShowSubGenreModal(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Add New Sub-genre</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={newSubGenre}
                    onChange={(e) => setNewSubGenre(e.target.value)}
                    className="flex-1 bg-[#0a0a18] border border-gray-700 rounded-l-md p-2 text-white"
                    placeholder="Enter sub-genre name"
                  />
                  <button 
                    onClick={handleAddSubGenre}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Current Sub-genres</h4>
                <div className="space-y-2">
                  {selectedGenre.subGenres.map((subGenre, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-[#0a0a18] border border-gray-700 rounded-md p-2"
                    >
                      <span>{subGenre}</span>
                      <button 
                        onClick={() => {
                          const updatedGenres = genres.map(genre => {
                            if (genre.id === selectedGenre.id) {
                              return {
                                ...genre,
                                subGenres: genre.subGenres.filter((_, i) => i !== index)
                              };
                            }
                            return genre;
                          });
                          
                          setGenres(updatedGenres);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {selectedGenre.subGenres.length === 0 && (
                    <div className="text-gray-400 text-sm py-2">
                      No sub-genres added yet
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowSubGenreModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
