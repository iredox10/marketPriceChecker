
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import API services
import { getMarkets, getUsers, getProducts, createMarket } from '../../services/api.js';

// --- ICONS (You would import these from your central Icons.jsx file) ---
const FiHome = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const FiUsers = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const FiPlusCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiCheckSquare = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>);

/**
 * AddMarketModal Component
 */
const AddMarketModal = ({ isOpen, onClose, onAddMarket }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onAddMarket({ name, location, description });
    setIsLoading(false);
    onClose();
    setName(''); setLocation(''); setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Market</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Market Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <textarea placeholder="Description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md"></textarea>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Market'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * AdminDashboardPage Component
 */
const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ markets: 0, users: 0, products: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data concurrently for efficiency
        const [marketsRes, usersRes, productsRes] = await Promise.all([
          getMarkets(),
          getUsers(),
          getProducts()
        ]);

        setStats({
          markets: marketsRes.data.length,
          users: usersRes.data.length,
          products: productsRes.data.length
        });

        // Get last 5 registered users for "Recent Activity"
        setRecentUsers(usersRes.data.slice(-5).reverse());

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        alert("Could not load dashboard data. Please ensure the backend server is running and you are logged in as an Admin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddMarket = async (marketData) => {
    try {
      const { data } = await createMarket(marketData);
      alert(`Market "${data.name}" added successfully!`);
      // Refresh stats
      setStats(prev => ({ ...prev, markets: prev.markets + 1 }));
    } catch (error) {
      console.error("Error adding market:", error);
      alert("Failed to add market. You may not be authorized.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Dashboard...</div>;
  }

  return (
    <>
      <AddMarketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddMarket={handleAddMarket} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Total Markets</p><p className="text-3xl font-bold text-gray-900">{stats.markets}</p></div><div className="text-green-600"><FiHome className="h-8 w-8" /></div></div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Total Users</p><p className="text-3xl font-bold text-gray-900">{stats.users}</p></div><div className="text-green-600"><FiUsers className="h-8 w-8" /></div></div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Products Tracked</p><p className="text-3xl font-bold text-gray-900">{stats.products}</p></div><div className="text-green-600"><FiShoppingBag className="h-8 w-8" /></div></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Registrations</h2>
              <ul className="space-y-4">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <li key={user._id} className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-700 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div>
                    <div className="flex-1"><p className="text-sm text-gray-700"><span className="font-bold">{user.name}</span> registered as a {user.role}.</p><p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p></div>
                  </li>
                )) : <p className="text-sm text-gray-500">No recent user registrations.</p>}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md"><FiPlusCircle className="h-5 w-5 mr-3 text-green-600" />Add New Market</button>
                <Link to="/admin/manage-shop-owners" className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md"><FiUsers className="h-5 w-5 mr-3 text-green-600" />Manage Shop Owners</Link>
                <Link to="/admin/view-all-products" className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md"><FiShoppingBag className="h-5 w-5 mr-3 text-green-600" />View All Products</Link>
                <Link to="/admin/price-reports" className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md"><FiCheckSquare className="h-5 w-5 mr-3 text-green-600" />Verify Price Reports</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
