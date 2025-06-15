
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import all necessary API services
import { getUsers, getMarkets, register, updateUser, deleteUser, uploadShopOwners } from '../../services/api';

// --- ICONS ---
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiPlus = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiUploadCloud = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>);


// --- Reusable Components ---

const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const baseStyle = "fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300";
  const typeStyle = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? FiCheckCircle : FiAlertTriangle;

  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <Icon className="h-6 w-6 mr-3" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20"><FiX className="h-4 w-4" /></button>
    </div>
  );
};

const ActionModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};


// --- ManageShopOwnersPage Component ---
const ManageShopOwnersPage = () => {
  const [shopOwners, setShopOwners] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [addMethod, setAddMethod] = useState('manual');
  const [uploadFile, setUploadFile] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, marketsRes] = await Promise.all([getUsers(), getMarkets()]);
      setShopOwners(usersRes.data.filter(user => user.role === 'ShopOwner'));
      setMarkets(marketsRes.data);
    } catch (error) {
      console.error("Failed to fetch page data:", error);
      showNotification("Could not load page data. Please log in as an Admin.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleAction = (type, owner = {}) => {
    const ownerData = { ...owner, market: owner.market?._id || owner.market || '' };
    setFormData(ownerData);
    setAddMethod('manual');
    setUploadFile(null);
    setModal({ type, data: owner });
  };

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => setUploadFile(e.target.files ? e.target.files[0] : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, data } = modal;

    try {
      let successMessage = '';
      if (type === 'add') {
        if (addMethod === 'manual') {
          await register({ ...formData, role: 'ShopOwner' });
          successMessage = "Shop owner added successfully!";
        } else {
          const fileFormData = new FormData();
          fileFormData.append('file', uploadFile);
          await uploadShopOwners(fileFormData);
          successMessage = "File uploaded. Shop owners are being processed.";
        }
      } else if (type === 'edit') {
        await updateUser(data._id, formData);
        successMessage = "Shop owner updated successfully!";
      } else if (type === 'delete') {
        await deleteUser(data._id);
        successMessage = "Shop owner deleted successfully!";
      }
      showNotification(successMessage, 'success');
      fetchPageData();
      setModal({ type: null, data: null });
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Could not complete the action.`;
      console.error(`Failed to ${type} owner:`, error);
      showNotification(errorMessage, "error");
    }
  };

  const filteredShopOwners = shopOwners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (owner.shopName && owner.shopName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />}
      <ActionModal isOpen={!!modal.type} onClose={() => setModal({ type: null, data: null })} title={`${modal.type ? modal.type.charAt(0).toUpperCase() + modal.type.slice(1) : ''} Shop Owner`}>
        {modal.type === 'delete' ? (
          <form onSubmit={handleSubmit}>
            <p>Are you sure you want to delete <span className="font-bold">{modal.data?.name}</span>?</p>
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={() => setModal({ type: null, data: null })} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button></div>
          </form>
        ) : modal.type === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
            <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
            <select name="market" value={formData.market || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required><option value="" disabled>Select a Market</option>{markets.map(market => (<option key={market._id} value={market._id}>{market.name}</option>))}</select>
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={() => setModal({ type: null, data: null })} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save Changes</button></div>
          </form>
        ) : ( // Add modal
          <form onSubmit={handleSubmit}>
            <div className="flex border-b mb-6"><button type="button" onClick={() => setAddMethod('manual')} className={`flex-1 py-2 text-sm font-medium ${addMethod === 'manual' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Add Manually</button><button type="button" onClick={() => setAddMethod('file')} className={`flex-1 py-2 text-sm font-medium ${addMethod === 'file' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Upload File</button></div>
            {addMethod === 'manual' ? (
              <div className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
                <input type="email" name="email" placeholder="Email Address" value={formData.email || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
                <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
                <select name="market" value={formData.market || ''} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required><option value="" disabled>Select a Market</option>{markets.map(market => (<option key={market._id} value={market._id}>{market.name}</option>))}</select>
                <input type="password" name="password" placeholder="Password" onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-gray-600">Upload an Excel or CSV file with columns: 'name', 'email', 'password', 'shopName', 'marketId'.</p>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"><div className="space-y-1 text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm"><label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls, .csv" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">XLSX, XLS, CSV</p></div></div>
                {uploadFile && <p className="text-sm">Selected: <span className="font-medium">{uploadFile.name}</span></p>}
              </div>
            )}
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={() => setModal({ type: null, data: null })} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Submit</button></div>
          </form>
        )}
      </ActionModal>
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div><h1 className="text-3xl font-bold text-gray-900">Manage Shop Owners</h1><p className="mt-1 text-md text-gray-600">View, edit, and manage all shop owner accounts.</p></div>
            <div className="mt-4 sm:mt-0"><button onClick={() => handleAction('add')} className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md"><FiPlus className="h-5 w-5 mr-2" />Add New Owner</button></div>
          </div>
          <div className="mb-6"><div className="relative"><input type="text" placeholder="Search by name or shop..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md" /></div></div>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50"><tr><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Shop Name</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Market</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                ) : filteredShopOwners.map((owner) => (
                  <tr key={owner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{owner.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.shopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.market?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleAction('edit', owner)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleAction('delete', owner)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageShopOwnersPage;
