
import React, { useState, useEffect, useMemo } from 'react';
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
const FiChevronLeft = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>);
const FiChevronRight = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>);


// --- Reusable Components ---
const Notification = ({ message, type, onClose }) => { /* ... (no changes needed) ... */ };

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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
      >
        <FiChevronLeft className="h-4 w-4 mr-1" /> Previous
      </button>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
      >
        Next <FiChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};


// --- ManageShopOwnersPage Component ---
const ManageShopOwnersPage = () => {
  const [allShopOwners, setAllShopOwners] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set how many items to show per page

  const showNotification = (message, type = 'success') => setNotification({ show: true, message, type });

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, marketsRes] = await Promise.all([getUsers(), getMarkets()]);
      setAllShopOwners(usersRes.data.filter(user => user.role === 'ShopOwner'));
      setMarkets(marketsRes.data);
    } catch (error) { showNotification("Could not load page data.", "error"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPageData(); }, []);

  const handleAction = (type, owner = {}) => { /* ... (no changes needed) ... */ };
  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { /* ... (no changes needed) ... */ };

  // --- Pagination and Filtering Logic ---
  const filteredShopOwners = useMemo(() => {
    return allShopOwners.filter(owner =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (owner.shopName && owner.shopName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allShopOwners, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShopOwners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShopOwners.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  return (
    <>
      {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />}
      <ActionModal isOpen={!!modal.type} onClose={() => setModal({ type: null, data: null })} title={`${modal.type ? modal.type.charAt(0).toUpperCase() + modal.type.slice(1) : ''} Shop Owner`}>
        {/* ... Modal content remains the same ... */}
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
                ) : currentItems.map((owner) => (
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
            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageShopOwnersPage;
