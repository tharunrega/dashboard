import React, { useState } from 'react';

export default function UserTable({ onUserClick }) {
  // State for showing selected user profile
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Mock user data
  const users = [
    { 
      id: 1, 
      name: 'Alice', 
      email: 'alice@example.com', 
      username: 'alice123', 
      location: 'New York', 
      joinDate: '2023-05-22 10:40:26', 
      status: 'active',
      verified: true,
      totalCredit: 245,
      usedCredit: 182
    },
    { 
      id: 2, 
      name: 'Bob Peterson', 
      email: 'bob@example.com', 
      username: 'bobp', 
      location: 'Chicago', 
      joinDate: '2023-06-15 14:20:33', 
      status: 'inactive',
      verified: true,
      totalCredit: 120,
      usedCredit: 100
    },
    { 
      id: 3, 
      name: 'Carol Adams', 
      email: 'carol@example.com', 
      username: 'carol_a', 
      location: 'Austin', 
      joinDate: '2023-04-10 09:35:41', 
      status: 'active',
      verified: false,
      totalCredit: 180,
      usedCredit: 75
    },
    { 
      id: 4, 
      name: 'Dave Smith', 
      email: 'dave@example.com', 
      username: 'davesmith', 
      location: 'Boston', 
      joinDate: '2023-07-05 16:22:08', 
      status: 'active',
      verified: true,
      totalCredit: 200,
      usedCredit: 125
    },
    { 
      id: 5, 
      name: 'Eve Johnson', 
      email: 'eve@example.com', 
      username: 'evej', 
      location: 'Seattle', 
      joinDate: '2023-03-18 11:05:53', 
      status: 'active',
      verified: true,
      totalCredit: 300,
      usedCredit: 275
    },
  ];

  // User click handler
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    if (onUserClick) onUserClick(userId);
  };

  // User stories mock data
  const userStories = [
    { id: 1, title: 'My First Story', views: 245, likes: 42, claps: 78, bookmarks: 12, date: '2023-06-12' },
    { id: 2, title: 'Adventure in the Woods', views: 189, likes: 35, claps: 62, bookmarks: 8, date: '2023-06-28' },
    { id: 3, title: 'A Day at the Beach', views: 321, likes: 56, claps: 94, bookmarks: 18, date: '2023-07-15' },
  ];

  // Login history mock data
  const loginHistory = [
    { date: '2023-08-04 15:30:22', device: 'iPhone 13', browser: 'Safari', location: 'New York, US', ip: '192.168.1.1' },
    { date: '2023-08-02 09:15:43', device: 'MacBook Pro', browser: 'Chrome', location: 'New York, US', ip: '192.168.1.1' },
    { date: '2023-07-29 18:45:10', device: 'iPad', browser: 'Safari', location: 'Boston, US', ip: '192.168.2.5' },
  ];

  // Moderation actions mock data
  const moderationHistory = [
    { date: '2023-07-10', action: 'Content Warning', admin: 'Mod1', reason: 'Borderline inappropriate content' },
    { date: '2023-06-25', action: 'Temporary Ban', admin: 'Mod2', reason: 'Multiple violations of community guidelines' },
    { date: '2023-06-05', action: 'Content Removed', admin: 'Mod1', reason: 'Violated terms of service' },
  ];

  // Credit usage history mock data
  const creditHistory = [
    { date: '2023-08-01', amount: -20, balance: 180, description: 'Premium story creation' },
    { date: '2023-07-15', amount: -15, balance: 200, description: 'Image generation' },
    { date: '2023-07-01', amount: +50, balance: 215, description: 'Monthly bonus' },
    { date: '2023-06-20', amount: -25, balance: 165, description: 'Premium feature usage' },
  ];

  // User status badge component
  const UserStatusBadge = ({ status, verified }) => {
    let statusColor = status === 'active' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400';
    let verifiedColor = verified ? 'bg-blue-900 text-blue-400' : 'bg-gray-700 text-gray-400';
    
    return (
      <div className="flex gap-2">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${statusColor}`}>
          {status}
        </span>
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${verifiedColor}`}>
          {verified ? 'verified' : 'unverified'}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Users table */}
      <div className="bg-[#202031] p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
        <h2 className="text-xl font-medium text-white mb-6">Users</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="text-gray-300 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-blue-400">{user.name}</td>
                  <td className="px-4 py-3 text-blue-400">{user.email}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.location}</td>
                  <td className="px-4 py-3">{user.joinDate}</td>
                  <td className="px-4 py-3">
                    <UserStatusBadge status={user.status} verified={user.verified} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-green-400">{user.totalCredit - user.usedCredit}</div>
                    <div className="text-xs text-gray-400">{user.usedCredit}/{user.totalCredit} used</div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="bg-blue-700 hover:bg-blue-600 text-xs px-2 py-1 rounded text-white">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Section - Shows when a user is clicked */}
      {selectedUserId && (
        <div className="bg-[#202031] p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
          {/* Find selected user */}
          {(() => {
            const user = users.find(u => u.id === selectedUserId);
            if (!user) return null;
            
            return (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-white">{user.name}'s Profile</h2>
                    <p className="text-gray-400 text-sm">{user.email} • Joined {user.joinDate}</p>
                  </div>
                  <UserStatusBadge status={user.status} verified={user.verified} />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="text-lg text-white">{user.location}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400">Username</div>
                    <div className="text-lg text-white">{user.username}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400">Available Credits</div>
                    <div className="text-lg text-green-400">{user.totalCredit - user.usedCredit}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400">Total Credits Used</div>
                    <div className="text-lg text-white">{user.usedCredit}</div>
                  </div>
                </div>

                {/* Tabs for different sections */}
                <div className="mb-8">
                  <div className="border-b border-gray-700 mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                      <li className="mr-2">
                        <a href="#stories" className="inline-block p-4 rounded-t-lg border-b-2 border-blue-500 text-blue-400">
                          Stories
                        </a>
                      </li>
                      <li className="mr-2">
                        <a href="#login-history" className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:border-gray-600 text-gray-400 hover:text-gray-300">
                          Login History
                        </a>
                      </li>
                      <li className="mr-2">
                        <a href="#moderation" className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:border-gray-600 text-gray-400 hover:text-gray-300">
                          Moderation History
                        </a>
                      </li>
                      <li>
                        <a href="#credits" className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:border-gray-600 text-gray-400 hover:text-gray-300">
                          Credit History
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Stories tab content - default active */}
                  <div id="stories">
                    <h3 className="text-lg font-medium text-white mb-4">Stories Created</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Views</th>
                            <th className="px-4 py-3">Likes</th>
                            <th className="px-4 py-3">Claps</th>
                            <th className="px-4 py-3">Bookmarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {userStories.map((story) => (
                            <tr key={story.id} className="text-gray-300 text-sm">
                              <td className="px-4 py-3 font-medium text-blue-400">{story.title}</td>
                              <td className="px-4 py-3">{story.date}</td>
                              <td className="px-4 py-3">{story.views}</td>
                              <td className="px-4 py-3">{story.likes}</td>
                              <td className="px-4 py-3">{story.claps}</td>
                              <td className="px-4 py-3">{story.bookmarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Login History tab content - would be activated via JS in real implementation */}
                  <div id="login-history" className="hidden">
                    <h3 className="text-lg font-medium text-white mb-4">Login History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">Device</th>
                            <th className="px-4 py-3">Browser</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">IP Address</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {loginHistory.map((login, index) => (
                            <tr key={index} className="text-gray-300 text-sm">
                              <td className="px-4 py-3">{login.date}</td>
                              <td className="px-4 py-3">{login.device}</td>
                              <td className="px-4 py-3">{login.browser}</td>
                              <td className="px-4 py-3">{login.location}</td>
                              <td className="px-4 py-3">{login.ip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Moderation History tab content */}
                  <div id="moderation" className="hidden">
                    <h3 className="text-lg font-medium text-white mb-4">Moderation History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Admin</th>
                            <th className="px-4 py-3">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {moderationHistory.map((mod, index) => (
                            <tr key={index} className="text-gray-300 text-sm">
                              <td className="px-4 py-3">{mod.date}</td>
                              <td className="px-4 py-3">{mod.action}</td>
                              <td className="px-4 py-3">{mod.admin}</td>
                              <td className="px-4 py-3">{mod.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Credit History tab content */}
                  <div id="credits" className="hidden">
                    <h3 className="text-lg font-medium text-white mb-4">Credit Usage History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-[#161625] rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-800 text-gray-400 text-left text-xs">
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Change</th>
                            <th className="px-4 py-3">Balance</th>
                            <th className="px-4 py-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {creditHistory.map((credit, index) => (
                            <tr key={index} className="text-gray-300 text-sm">
                              <td className="px-4 py-3">{credit.date}</td>
                              <td className={`px-4 py-3 ${credit.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {credit.amount > 0 ? `+${credit.amount}` : credit.amount}
                              </td>
                              <td className="px-4 py-3">{credit.balance}</td>
                              <td className="px-4 py-3">{credit.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}