
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import new API services
import { getMyProfile, getMyReports, updateUser } from '../../services/api';

// --- ICONS ---
const FiUser = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const FiHeart = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiEdit = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const FiSend = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const FiBell = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);

// --- Mock Data for features not yet built ---
const mockFavorites = [{ id: 1, name: 'Tomatoes (Basket)', lastPrice: 15500 }, { id: 2, name: 'Rice (50kg Bag)', lastPrice: 78500 }];
const mockTrackedMarkets = [{ id: 'kasuwar-rimi', name: 'Kasuwar Rimi' }, { id: 'sabon-gari', name: 'Sabon Gari Market' }];
const mockNotifications = [{ id: 1, message: "Price for Tomatoes (Basket) has dropped!", timestamp: "5 mins ago", read: false }, { id: 2, message: "Price for Rice (50kg Bag) was updated.", timestamp: "1 hour ago", read: false }];

// Reusable Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(() => onClose(), 5000); return () => clearTimeout(timer); }, [onClose]);
  const isSuccess = type === 'success';
  return (<div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}><span className="text-sm font-medium">{message}</span><button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20"><FiX className="h-4 w-4" /></button></div>);
};

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, password: '', confirmPassword: '' });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Prepare data to send, only include password if it's not empty
    const dataToSave = { name: formData.name };
    if (formData.password) {
      dataToSave.password = formData.password;
    }
    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (Cannot be changed)</label>
            <input type="email" id="email" name="email" value={user.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" readOnly />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * UserProfilePage Component
 */
const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => setNotification({ show: true, message, type });
  const statusColorMap = { 'Verified': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800' };

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, reportsRes] = await Promise.all([getMyProfile(), getMyReports()]);
      setUser(profileRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      showNotification("Could not load your profile. Please log in again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedData) => {
    try {
      const { data } = await updateUser(user._id, updatedData);
      setUser(data);
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (storedUserInfo) {
        storedUserInfo.name = data.name;
        localStorage.setItem('userInfo', JSON.stringify(storedUserInfo));
      }
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      showNotification("Could not update profile.", "error");
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading Profile...</div>;
  if (!user) return <div className="text-center py-20">Could not load user data. <Link to="/login" className="text-green-600">Please log in.</Link></div>;

  return (
    <>
      {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} onSave={handleSaveProfile} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center"><FiUser className="w-12 h-12 text-gray-500" /></div>
            <div className="text-center sm:text-left flex-grow"><h1 className="text-2xl font-bold">{user.name}</h1><p className="text-md text-gray-600">{user.email}</p><p className="text-sm text-gray-500">Member since: {new Date(user.createdAt).toLocaleDateString()}</p></div>
            <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-gray-200 font-medium text-sm rounded-md"><FiEdit className="h-4 w-4 mr-2" />Edit Profile</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold mb-4 flex items-center"><FiBell className="h-5 w-5 mr-3 text-yellow-500" />Notifications</h2><ul className="space-y-4">{mockNotifications.map(n => (<li key={n.id} className="flex items-start space-x-3"><div className={`w-2 h-2 rounded-full mt-1.5 ${n.read ? 'bg-gray-300' : 'bg-green-500'}`}></div><div><p className="text-sm">{n.message}</p><p className="text-xs text-gray-400">{n.timestamp}</p></div></li>))}</ul></div>
              <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold mb-4 flex items-center"><FiHeart className="h-5 w-5 mr-3 text-red-500" />Favorite Products</h2><ul className="space-y-3">{mockFavorites.map(p => (<li key={p.id} className="flex justify-between items-center text-sm"><Link to={`/search?q=${p.name.toLowerCase()}`} className="text-green-600">{p.name}</Link><span className="font-mono">₦{p.lastPrice.toLocaleString()}</span></li>))}</ul></div>
            </div>
            <div className="md:col-span-2"><div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold mb-4 flex items-center"><FiSend className="h-5 w-5 mr-3 text-purple-500" />My Price Reports</h2><div className="overflow-x-auto"><table className="w-full table-auto"><thead className="bg-gray-50"><tr><th>Product</th><th>Market</th><th>Price</th><th>Date</th><th>Status</th></tr></thead><tbody className="divide-y">{reports.map(r => (<tr key={r._id}><td className="px-4 py-3">{r.productName}</td><td className="px-4 py-3">{r.marketName}</td><td className="px-4 py-3 font-mono">₦{r.reportedPrice.toLocaleString()}</td><td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[r.status]}`}>{r.status}</span></td></tr>))}</tbody></table></div></div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
