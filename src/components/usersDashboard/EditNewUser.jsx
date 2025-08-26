import React, { useState } from 'react';

// Update component name and title
export default function CreditManagement() { // Renamed from EditNewUser
  const [newCredit, setNewCredit] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  // Mock data for current default credit
  const currentDefaultCredit = 100;
  
  // Mock data for credit change history
  const creditChangeHistory = [
    { date: '2023-08-05 14:32:10', admin: 'Admin1', oldValue: 50, newValue: 100, reason: 'Promotional offer' },
    { date: '2023-07-20 09:15:22', admin: 'Admin2', oldValue: 30, newValue: 50, reason: 'Standard increase' },
    { date: '2023-06-15 11:45:33', admin: 'Admin1', oldValue: 20, newValue: 30, reason: 'User retention strategy' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle credit update logic here
    alert(`Default credit updated to: ${newCredit}`);
    setNewCredit('');
  };

  return (
    <div className="bg-[#202031] p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
      <h2 className="text-xl font-medium text-white mb-6">User Credit Management</h2>
      
      {/* Current Default Credit Display */}
      <div className="mb-6 p-4 bg-[#161625] rounded-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Current Default Credit:</span>
          <span className="text-lg font-medium text-green-400">{currentDefaultCredit} credits</span>
        </div>
      </div>
      
      {/* Credit Update Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="creditAmount" className="block text-sm text-gray-400 mb-2">
              New Default Credit Amount
            </label>
            <input
              id="creditAmount"
              type="number"
              value={newCredit}
              onChange={(e) => setNewCredit(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
              placeholder="Enter credit amount"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
          </div>
        </div>
      </form>
      
      {/* Credit Change History Toggle */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <span>{showHistory ? 'Hide' : 'View'} Credit Change History</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ml-2 transform transition-transform ${showHistory ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Credit Change History Table */}
        {showHistory && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Old Value</th>
                  <th className="px-4 py-3">New Value</th>
                  <th className="px-4 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {creditChangeHistory.map((entry, index) => (
                  <tr key={index} className="text-gray-300 text-sm">
                    <td className="px-4 py-3">{entry.date}</td>
                    <td className="px-4 py-3">{entry.admin}</td>
                    <td className="px-4 py-3">{entry.oldValue}</td>
                    <td className="px-4 py-3">{entry.newValue}</td>
                    <td className="px-4 py-3">{entry.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}