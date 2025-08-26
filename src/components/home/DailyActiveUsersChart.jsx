import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DailyActiveUsersChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data
    const fetchDailyActiveUsers = async () => {
      try {
        setLoading(true);
        
        // Replace this with your actual API call
        // const response = await fetch('your-api-endpoint/daily-active-users');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = {
          dates: ['Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20'],
          activeUsers: [1250, 1380, 1105, 1490, 1350, 1270, 1420]
        };
        
        setChartData({
          labels: mockData.dates,
          datasets: [
            {
              label: 'Daily Active Users',
              data: mockData.activeUsers,
              fill: true,
              backgroundColor: 'rgba(92, 60, 146, 0.2)',
              borderColor: '#8344FF',
              tension: 0.4,
              pointBackgroundColor: '#8344FF',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#8344FF'
            }
          ]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching daily active users data:', err);
        setError('Failed to load daily active users data');
        setLoading(false);
      }
    };

    fetchDailyActiveUsers();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            if (value >= 1000) {
              return (value / 1000) + 'k';
            }
            return value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(55, 29, 65, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#8344FF',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `  ${context.parsed.y.toLocaleString()} users`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#150D23] p-5 rounded-xl mb-5 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-purple-300">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#150D23] p-5 rounded-xl mb-5 h-[400px] flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#150D23] p-5 rounded-xl mb-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-white">Daily Active Users</h2>
        <div className="flex gap-2">
          <button className="bg-[#371D41] text-white px-3 py-1 text-xs rounded-md hover:bg-[#4A2854] transition">
            Last 7 days
          </button>
          <button className="text-gray-400 px-3 py-1 text-xs rounded-md hover:bg-[#371D41] transition">
            Last 30 days
          </button>
          <button className="text-gray-400 px-3 py-1 text-xs rounded-md hover:bg-[#371D41] transition">
            Last 90 days
          </button>
        </div>
      </div>
      <div className="h-[350px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}