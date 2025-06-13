
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS (You would import these from your central Icons.jsx file) ---
const FiHome = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const FiUsers = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const FiPlusCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);


// --- Mock Data ---
const stats = [
  { name: 'Total Markets', value: '12', icon: <FiHome className="h-8 w-8" /> },
  { name: 'Total Shop Owners', value: '150', icon: <FiUsers className="h-8 w-8" /> },
  { name: 'Total Products Tracked', value: '845', icon: <FiShoppingBag className="h-8 w-8" /> },
];

const recentActivity = [
  { user: 'Bello Sani', action: 'added a new price for "Tomatoes"', time: '2m ago' },
  { user: 'Admin', action: 'verified shop owner "Aisha General Store"', time: '1h ago' },
  { user: 'Fatima Bala', action: 'registered as a new shop owner', time: '3h ago' },
  { user: 'Admin', action: 'added a new market "Rimi Market"', time: 'Yesterday' },
];

/**
 * AddMarketModal Component
 * A pop-up modal for adding new markets, either manually or via file upload.
 */
const AddMarketModal = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState('manual'); // 'manual' or 'file'
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    console.log("Manual submission:", { name, location, description });
    alert(`Market "${name}" has been added (simulated).`);
    onClose();
    setName('');
    setLocation('');
    setDescription('');
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    // In a real app, you would parse the file and send data to your API.
    console.log("File submission:", file);
    alert(`File "${file.name}" has been uploaded for processing (simulated).`);
    onClose();
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Market(s)</h2>

        <div className="flex border-b mb-6">
          <button onClick={() => setMethod('manual')} className={`flex-1 py-2 text-sm font-medium ${method === 'manual' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Add Manually</button>
          <button onClick={() => setMethod('file')} className={`flex-1 py-2 text-sm font-medium ${method === 'file' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Upload File</button>
        </div>

        {method === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label htmlFor="market-name" className="block text-sm font-medium text-gray-700">Market Name</label>
              <input type="text" id="market-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label htmlFor="market-location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="market-location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label htmlFor="market-description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="market-description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">Add Market</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFileSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel or CSV file</label>
              <p className="text-xs text-gray-500 mb-2">Ensure your file has columns: 'Name', 'Location', 'Description'.</p>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls, .csv" /></label><p className="pl-1">or drag and drop</p></div>
                  <p className="text-xs text-gray-500">XLSX, XLS, CSV up to 10MB</p>
                </div>
              </div>
              {file && <p className="text-sm text-gray-600 mt-2">Selected file: <span className="font-medium">{file.name}</span></p>}
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-green-400" disabled={!file}>Upload & Add</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


/**
 * AdminDashboardPage Component
 * The main interface for administrators to manage the application.
 */
const AdminDashboardPage = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, this would come from the auth context
  const adminName = "Admin User";

  return (
    <>
      <AddMarketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-md text-gray-600">Welcome back, {adminName}. Here's what's happening.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-green-600">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-green-100 text-green-700 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold">{activity.user}</span> {activity.action}.
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions Column */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md transition-colors">
                  <FiPlusCircle className="h-5 w-5 mr-3 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">Add New Market</span>
                </button>
                <Link to={'/admin/manage-shop-owners'} className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md transition-colors">
                  <FiUsers className="h-5 w-5 mr-3 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">Manage Shop Owners</span>
                </Link>
                <Link to="/admin/view-products" className="flex items-center w-full text-left p-3 bg-gray-50 hover:bg-green-100 rounded-md transition-colors">
                  <FiShoppingBag className="h-5 w-5 mr-3 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">View All Products</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
