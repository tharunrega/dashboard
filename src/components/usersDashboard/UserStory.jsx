import React from 'react';

export default function UserStory({ userId }) {
  return (
    <div className="bg-[#202031] p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-medium text-white mb-2">User Story</h2>
      <p className="text-gray-400 text-sm">
        {userId ? `Details for user ID: ${userId}` : 'Select a user to view stories.'}
      </p>
    </div>
  );
}