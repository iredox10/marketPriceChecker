
import React, { useState, useEffect } from 'react';
// Import all necessary API services
import { getProducts, addProductPrice, createProduct, uploadProducts } from '../../services/api'; // --- ICONS ---

const FiBox = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const FiTag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiPlus = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const FiUploadCloud = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>);

// --- Reusable Components ---
const Notification = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const Icon = isSuccess ? FiCheckCircle : FiAlertTriangle;
  useEffect(() => { const timer = setTimeout(() => onClose(), 5000); return () => clearTimeout(timer); }, [onClose]);
  return (<div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}><Icon className="h-6 w-6 mr-3" /> <span className="text-sm font-medium">{message}</span> <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20"><FiX className="h-4 w-4" /></button></div>);
};

// --- Modal Components ---
const UpdatePriceModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [price, setPrice] = useState('');
  if (!isOpen || !product) return null;
  const handleSubmit = (e) => { e.preventDefault(); onUpdate(product._id, parseFloat(price)); setPrice(''); onClose(); };
  return (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}><button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><FiX className="h-6 w-6" /></button><h2 className="text-2xl font-bold mb-2">Update Price</h2><p className="text-gray-600 mb-6">For <span className="font-semibold">{product.name}</span></p><form onSubmit={handleSubmit} className="space-y-4"><input type="number" placeholder="New Price (NGN)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /><div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Update</button></div></form></div></div>);
};

const AddProductModal = ({ isOpen, onClose, onAdd, onUpdatePrice, userInfo }) => {
  const [method, setMethod] = useState('create'); // 'create', 'search', 'file'
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProductData, setNewProductData] = useState({ name: '', category: 'Groceries' });
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const { data } = await getProducts({ keyword: searchTerm });
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPriceToExisting = (e) => { e.preventDefault(); onUpdatePrice(selectedProduct._id, parseFloat(price)); resetStateAndClose(); };
  const handleCreateNewProduct = (e) => { e.preventDefault(); onAdd({ ...newProductData, price: parseFloat(price) }, userInfo); resetStateAndClose(); };
  const handleFileUpload = async (e) => { e.preventDefault(); if (!file) return; const formData = new FormData(); formData.append('file', file); const res = await uploadProducts(formData); resetStateAndClose(); console.log(res) };
  const resetStateAndClose = () => { setSearchTerm(''); setSearchResults([]); setSelectedProduct(null); setNewProductData({ name: '', category: 'Groceries' }); setPrice(''); setFile(null); onClose(); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={resetStateAndClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={resetStateAndClose} className="absolute top-4 right-4 text-gray-400"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold mb-4">Add Product Listing</h2>
        <div className="flex border-b mb-6"><button onClick={() => setMethod('create')} className={`flex-1 py-2 text-sm font-medium ${method === 'create' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Create New</button><button onClick={() => setMethod('search')} className={`flex-1 py-2 text-sm font-medium ${method === 'search' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Search Existing</button><button onClick={() => setMethod('file')} className={`flex-1 py-2 text-sm font-medium ${method === 'file' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Upload File</button></div>

        {method === 'create' && (
          <form onSubmit={handleCreateNewProduct} className="space-y-4">
            <h3 className="font-semibold">Create a new product listing:</h3>
            <input type="text" placeholder="Product Name (e.g., Beans, 1 Mudu)" value={newProductData.name} onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
            <input type="text" placeholder="Category (e.g., Grains)" value={newProductData.category} onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })} className="w-full px-3 py-2 border rounded-md" required />
            {price}
            <input type="number" placeholder="Your Initial Price (NGN)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
            <div className="flex justify-end space-x-2"><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Create & Add Price</button></div>
          </form>
        )}

        {method === 'search' && (
          <div>
            {!selectedProduct ? (
              <>
                <form onSubmit={handleSearch} className="flex gap-2 mb-4"><input type="text" placeholder="Search for existing product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border rounded-md" /><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={isSearching}>{isSearching ? '...' : 'Search'}</button></form>
                <div className="h-48 overflow-y-auto border rounded-md">
                  {isSearching ? <div className="p-4 text-center text-gray-500">Searching...</div> : searchResults.length > 0 ? searchResults.map(p => (<div key={p._id} onClick={() => setSelectedProduct(p)} className="p-3 hover:bg-gray-100 cursor-pointer">{p.name}</div>)) : <div className="p-4 text-center text-gray-500">No results found for "{searchTerm}".</div>}
                </div>
              </>
            ) : (
              <form onSubmit={handleAddPriceToExisting} className="space-y-4">
                <p>Set your price for: <span className="font-bold">{selectedProduct.name}</span></p>
                <input type="number" placeholder="Your Price (NGN)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                <div className="flex justify-end space-x-2"><button type="button" onClick={() => setSelectedProduct(null)} className="px-4 py-2 bg-gray-200 rounded-md">Back</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Add Price</button></div>
              </form>
            )}
          </div>
        )}
        {method === 'file' && (
          <form onSubmit={handleFileUpload} className="space-y-6">
            <p className="text-sm text-gray-600">Upload a file with columns: 'name', 'category', 'price'.</p>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"><div className="space-y-1 text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm"><label htmlFor="file-upload" className="cursor-pointer font-medium text-green-600"><span>Upload a file</span><input id="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} /></label><p className="pl-1">or drag and drop</p></div></div></div>
            {file && <p className="text-sm">Selected: <span className="font-medium">{file.name}</span></p>}
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={!file}>Upload</button></div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- ShopOwnerDashboardPage Component ---
const ShopOwnerDashboardPage = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState({ type: null, data: null });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => setNotification({ show: true, message, type });

  const fetchMyProducts = async (userId) => { setIsLoading(true); try { const { data } = await getProducts(); const ownerProducts = data.filter(p => p.priceHistory.some(h => h.shopOwner?._id === userId)); setMyProducts(ownerProducts); } catch (error) { showNotification("Could not load your products.", "error"); } finally { setIsLoading(false); } };

  useEffect(() => { const storedUserInfo = JSON.parse(localStorage.getItem('userInfo')); if (storedUserInfo) { setUserInfo(storedUserInfo); fetchMyProducts(storedUserInfo._id); } else { showNotification("Please log in again.", "error"); setIsLoading(false); } }, []);

  const handleUpdatePrice = async (productId, price) => { try { await addProductPrice(productId, { price }); showNotification("Price updated successfully!", "success"); fetchMyProducts(userInfo._id); } catch (error) { showNotification("Failed to update price.", "error"); } };

  const handleAddProduct = async (newProductData, ownerInfo) => { try { const productToCreate = { name: newProductData.name, category: newProductData.category, market: ownerInfo.market, }; const { data: createdProduct } = await createProduct(productToCreate); await addProductPrice(createdProduct._id, { price: newProductData.price }); showNotification(`Product "${createdProduct.name}" added successfully!`, "success"); fetchMyProducts(userInfo._id); } catch (error) { console.log(error); showNotification("Failed to add new product.", error); } };

  return (
    <>
      {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, show: false })} />}
      <UpdatePriceModal isOpen={modal.type === 'update'} onClose={() => setModal({ type: null, data: null })} product={modal.data} onUpdate={handleUpdatePrice} />
      <AddProductModal isOpen={modal.type === 'add'} onClose={() => setModal({ type: null, data: null })} onAdd={handleAddProduct} onUpdatePrice={handleUpdatePrice} userInfo={userInfo} />

      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Shop Owner Dashboard</h1><p className="mt-1 text-md text-gray-600">Welcome, {userInfo.name}.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"><div className="bg-white p-6 rounded-lg shadow-md"><p className="text-sm font-medium text-gray-500">My Listed Products</p><p className="text-2xl font-bold">{myProducts.length}</p></div><div className="bg-white p-6 rounded-lg shadow-md"><p className="text-sm font-medium text-gray-500">Price Updates Today</p><p className="text-2xl font-bold">5</p></div></div>
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-gray-800">My Product Listings</h2><button onClick={() => setModal({ type: 'add' })} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md"><FiPlus className="h-5 w-5 mr-2" />Add Product</button></div>
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50"><tr><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">My Price (NGN)</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Last Updated</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (<tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>) : myProducts.length > 0 ? myProducts.map((product) => {
                  const myLastPrice = product.priceHistory.filter(h => h.shopOwner?._id === userInfo._id).pop();
                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold">{myLastPrice?.price.toLocaleString() || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{myLastPrice ? new Date(myLastPrice.date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center"><button onClick={() => setModal({ type: 'update', data: product })} className="px-4 py-1.5 bg-green-600 text-white rounded-md">Update Price</button></td>
                    </tr>
                  );
                }) : (<tr><td colSpan="4" className="text-center py-12 text-gray-500">You have no products listed. Click "Add Product" to get started.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopOwnerDashboardPage;
