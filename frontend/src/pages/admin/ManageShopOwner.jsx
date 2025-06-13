
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS (You would import these from your central Icons.jsx file) ---
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiPlus = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiUploadCloud = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);


// --- Mock Data ---
const mockShopOwners = [
  { id: 1, name: 'Bello Sani', shopName: 'Sani\'s Grains', market: 'Kasuwar Rimi', status: 'Verified' },
  { id: 2, name: 'Aisha Lawan', shopName: 'Aisha General Store', market: 'Sabon Gari Market', status: 'Verified' },
  { id: 3, name: 'Fatima Bala', shopName: 'Fati\'s Fresh Produce', market: 'Yankura Market', status: 'Pending' },
  { id: 4, name: 'Musa Ibrahim', shopName: 'Ibrahim & Sons', market: 'Kantin Kwari', status: 'Verified' },
  { id: 5, name: 'Hauwa Abubakar', shopName: 'Hauwa\'s Spices', market: 'Sabon Gari Market', status: 'Suspended' },
];

// --- MODAL COMPONENTS ---

const AddShopOwnerModal = ({ isOpen, onClose, onAdd }) => {
  const [method, setMethod] = useState('manual');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', shopName: '', market: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now(), status: 'Pending' }); // Simulate adding
    onClose();
    setFormData({ name: '', shopName: '', market: '', email: '', password: '' });
  };

  const handleFileChange = (e) => setFile(e.target.files ? e.target.files[0] : null);

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) { alert('Please select a file.'); return; }
    alert(`File "${file.name}" uploaded for processing (simulated).`);
    onClose();
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Shop Owner(s)</h2>
        <div className="flex border-b mb-6"><button onClick={() => setMethod('manual')} className={`flex-1 py-2 text-sm font-medium ${method === 'manual' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Add Manually</button><button onClick={() => setMethod('file')} className={`flex-1 py-2 text-sm font-medium ${method === 'file' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Upload File</button></div>
        {method === 'manual' ? (<form onSubmit={handleManualSubmit} className="space-y-4"><input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required /><input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required /><input type="text" name="market" placeholder="Market Name" value={formData.market} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required /><input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required /><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required /><div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Add Owner</button></div></form>) : (<form onSubmit={handleFileSubmit} className="space-y-6"><p className="text-sm text-gray-600">Upload a file with columns: 'Name', 'ShopName', 'Market', 'Email', 'Password'.</p><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"><div className="space-y-1 text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm"><label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls, .csv" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">XLSX, XLS, CSV</p></div></div>{file && <p className="text-sm text-gray-600">Selected: <span className="font-medium">{file.name}</span></p>}<div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={!file}>Upload</button></div></form>)}
      </div>
    </div>
  );
};

const EditShopOwnerModal = ({ isOpen, onClose, owner, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (owner) {
      setFormData(owner);
    }
  }, [owner]);

  if (!isOpen || !formData) return null;

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Shop Owner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="market" placeholder="Market Name" value={formData.market} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
          <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md"><option>Verified</option><option>Pending</option><option>Suspended</option></select>
          <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save Changes</button></div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, ownerName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"><FiAlertTriangle className="h-6 w-6 text-red-600" /></div>
        <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Shop Owner</h3>
        <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete <span className="font-bold">{ownerName}</span>? This action cannot be undone.</p>
        <div className="mt-6 flex justify-center space-x-4"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button><button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button></div>
      </div>
    </div>
  );
};


/**
 * ManageShopOwnersPage Component
 * Provides an interface for admins to view and manage shop owners.
 */
const ManageShopOwnersPage = () => {
  const [shopOwners, setShopOwners] = useState(mockShopOwners);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ type: null, data: null }); // type can be 'add', 'edit', 'delete'

  const handleAction = (type, data = null) => setModal({ type, data });

  const handleAddOwner = (newOwner) => {
    setShopOwners(prev => [newOwner, ...prev]);
    alert(`Added "${newOwner.name}" successfully.`);
  };

  const handleUpdateOwner = (updatedOwner) => {
    setShopOwners(prev => prev.map(owner => owner.id === updatedOwner.id ? updatedOwner : owner));
    alert(`Updated "${updatedOwner.name}" successfully.`);
  };

  const handleConfirmDelete = () => {
    setShopOwners(prev => prev.filter(owner => owner.id !== modal.data.id));
    alert(`Deleted "${modal.data.name}" successfully.`);
    setModal({ type: null, data: null });
  };

  const filteredShopOwners = shopOwners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColorMap = { 'Verified': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800', 'Suspended': 'bg-red-100 text-red-800' };

  return (
    <>
      <AddShopOwnerModal isOpen={modal.type === 'add'} onClose={() => setModal({ type: null, data: null })} onAdd={handleAddOwner} />
      <EditShopOwnerModal isOpen={modal.type === 'edit'} onClose={() => setModal({ type: null, data: null })} owner={modal.data} onSave={handleUpdateOwner} />
      <DeleteConfirmationModal isOpen={modal.type === 'delete'} onClose={() => setModal({ type: null, data: null })} onConfirm={handleConfirmDelete} ownerName={modal.data?.name} />

      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div><h1 className="text-3xl font-bold text-gray-900">Manage Shop Owners</h1><p className="mt-1 text-md text-gray-600">View, edit, and verify shop owner accounts.</p></div>
            <div className="mt-4 sm:mt-0"><button onClick={() => handleAction('add')} className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 shadow-sm">
              <FiPlus className="h-5 w-5 mr-2" />Add New Owner</button></div>
          </div>
          <div className="mb-6"><div className="relative">
            {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <input type="text" placeholder="Search by name, shop, or market..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50"><tr><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShopOwners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{owner.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.shopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.market}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[owner.status]}`}>{owner.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {owner.status === 'Pending' && (<button onClick={() => handleUpdateOwner({ ...owner, status: 'Verified' })} className="text-green-600 hover:text-green-900">Verify</button>)}
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
