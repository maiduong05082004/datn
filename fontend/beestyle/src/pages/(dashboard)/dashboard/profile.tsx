import React from 'react';

const MyProfile = () => {
  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+123456789',
    address: '123 Street, City, Country',
    avatar:
      'https://via.placeholder.com/150',
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start p-6 md:p-10">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg">
            <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 mt-6 md:mt-0 md:ml-8">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="mt-2 text-gray-500">
              <span className="font-medium">Phone:</span> {user.phone}
            </p>
            <p className="text-gray-500">
              <span className="font-medium">Address:</span> {user.address}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
