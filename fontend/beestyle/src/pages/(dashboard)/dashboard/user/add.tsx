import React from 'react'

type Props = {}

const addUser = (props: Props) => {
    return (
        <form action="/submit" method="POST" className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-6">
  <h2 className="text-2xl font-bold mb-6 text-center">Thêm mới Người Dùng</h2>

  <div className="mb-4">
    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
    <input type="text" name="name" id="name" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
  </div>

  <div className="mb-4">
    <label htmlFor="date_of_birth" className="block text-gray-700 font-bold mb-2">Date of Birth:</label>
    <input type="date" name="date_of_birth" id="date_of_birth" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
  </div>

  <div className="mb-4">
    <label htmlFor="sex" className="block text-gray-700 font-bold mb-2">Sex:</label>
    <select name="sex" id="sex" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div className="mb-4">
    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
    <input type="email" name="email" id="email" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
  </div>

  <div className="mb-4">
    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
    <input type="password" name="password" id="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
  </div>

  <div className="mb-4">
    <label htmlFor="provider_name" className="block text-gray-700 font-bold mb-2">Provider Name:</label>
    <input type="text" name="provider_name" id="provider_name" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
  </div>

  <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
    Submit
  </button>
</form>

    )
}

export default addUser