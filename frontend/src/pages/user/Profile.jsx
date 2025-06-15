
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const FiUser = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const FiHeart = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiEdit = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const FiSend = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const FiBell = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);


// --- Mock Data ---
const mockUserData = {
  name: 'Amina Yusuf',
  email: 'amina.yusuf@example.com',
  memberSince: '2024-05-20',
  favoriteProducts: [
    { id: 1, name: 'Tomatoes (Basket)', lastPrice: 15500 },
    { id: 2, name: 'Rice (50kg Bag)', lastPrice: 78500 },
    { id: 3, name: 'Palm Oil (25L)', lastPrice: 42000 },
  ],
  trackedMarkets: [
    { id: 'kasuwar-rimi', name: 'Kasuwar Rimi' },
    { id: 'sabon-gari', name: 'Sabon Gari Market' },
  ],
  priceReports: [
    { id: 1, product: 'Onions (Bag)', market: 'Kasuwar Rimi', price: 23000, date: '2024-06-12', status: 'Verified' },
    { id: 2, product: 'Yam (Tuber)', market: 'Sabon Gari Market', price: 1500, date: '2024-06-11', status: 'Pending' },
    { id: 3, product: 'Beans (Mudu)', market: 'Yankura Market', price: 1800, date: '2024-06-10', status: 'Verified' },
  ],
  notifications: [
    { id: 1, message: "Price for Tomatoes (Basket) has dropped to ₦15,200!", timestamp: "5 mins ago", read: false },
    { id: 2, message: "A new price was added for Rice (50kg Bag) in Kasuwar Rimi.", timestamp: "1 hour ago", read: false },
    { id: 3, message: "Price for Palm Oil (25L) has been updated.", timestamp: "Yesterday", read: true },
  ]
};

/**
 * EditProfileModal Component
 * Modal for editing user's name and email.
 */
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};


/**
 * UserProfilePage Component
 * Displays user information, favorites, tracked markets, and contributions.
 */
const UserProfilePage = () => {
  const [user, setUser] = useState(mockUserData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const statusColorMap = { 'Verified': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800' };

  const handleSaveProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    alert("Profile updated successfully (simulated).");
  };

  return (
    <>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="w-12 h-12 text-gray-500" />
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-md text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since: {user.memberSince}</p>
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium text-sm rounded-md hover:bg-gray-300">
              <FiEdit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-8">
              {/* Notifications */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiBell className="h-5 w-5 mr-3 text-yellow-500" />Notifications</h2>
                <ul className="space-y-4">
                  {user.notifications.map(notification => (
                    <li key={notification.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${notification.read ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                      <div>
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.timestamp}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Favorite Products */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiHeart className="h-5 w-5 mr-3 text-red-500" />Favorite Products</h2>
                <ul className="space-y-3">
                  {user.favoriteProducts.map(product => (
                    <li key={product.id} className="flex justify-between items-center text-sm">
                      <Link to={`/search?q=${product.name.toLowerCase()}`} className="text-green-600 hover:underline">{product.name}</Link>
                      <span className="font-mono text-gray-600">₦{product.lastPrice.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tracked Markets */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiMapPin className="h-5 w-5 mr-3 text-blue-500" />Tracked Markets</h2>
                <ul className="space-y-3">
                  {user.trackedMarkets.map(market => (
                    <li key={market.id}>
                      <Link to={`/markets/${market.id}`} className="text-sm text-green-600 hover:underline">{market.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column for Contributions */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiSend className="h-5 w-5 mr-3 text-purple-500" />My Price Reports</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reported Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user.priceReports.map(report => (
                        <tr key={report.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{report.product}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{report.market}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-mono">₦{report.price.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[report.status]}`}>
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
