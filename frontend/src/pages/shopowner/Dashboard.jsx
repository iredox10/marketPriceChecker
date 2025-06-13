
import React, { useState } from 'react';

// --- ICONS (You would import these from your central Icons.jsx file) ---
const FiBox = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const FiTag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiPlus = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const FiUploadCloud = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);


// --- Mock Data ---
const mockOwnerProducts = [
  { id: 1, name: 'Tomatoes (Basket)', currentPrice: 15500, lastUpdated: '2024-06-12' },
  { id: 2, name: 'Rice (50kg Bag)', currentPrice: 78500, lastUpdated: '2024-06-12' },
  { id: 4, name: 'Onions (Bag)', currentPrice: 22500, lastUpdated: '2024-06-12' },
];

/**
 * UpdatePriceModal Component
 */
const UpdatePriceModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [price, setPrice] = useState('');
  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice <= 0) { alert('Please enter a valid price.'); return; }
    onUpdate(product.id, newPrice);
    setPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Price</h2>
        <p className="text-gray-600 mb-6">Enter the new price for <span className="font-semibold">{product.name}</span>.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">New Price (NGN)</label>
            <input type="number" id="product-price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., 16000" required />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Update Price</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * AddProductModal Component
 * Modal for adding new products manually or via file upload.
 */
const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [method, setMethod] = useState('manual');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  if (!isOpen) return null;

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const newPrice = parseFloat(formData.price);
    if (isNaN(newPrice) || newPrice <= 0) { alert('Please enter a valid price.'); return; }
    onAdd({ name: formData.name, currentPrice: newPrice });
    onClose();
    setFormData({ name: '', price: '' });
  };

  const handleFileChange = (e) => setFile(e.target.files ? e.target.files[0] : null);

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) { alert('Please select a file to upload.'); return; }
    alert(`File "${file.name}" uploaded for processing (simulated).`);
    onClose();
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product(s)</h2>
        <div className="flex border-b mb-6"><button onClick={() => setMethod('manual')} className={`flex-1 py-2 text-sm font-medium ${method === 'manual' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Add Manually</button><button onClick={() => setMethod('file')} className={`flex-1 py-2 text-sm font-medium ${method === 'file' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}>Upload File</button></div>
        {method === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Product Name (e.g., Beans, 1 Mudu)" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
            <input type="number" name="price" placeholder="Current Price (NGN)" value={formData.price} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md" required />
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Add Product</button></div>
          </form>
        ) : (
          <form onSubmit={handleFileSubmit} className="space-y-6">
            <p className="text-sm text-gray-600">Upload a file with columns: 'Name', 'Price'.</p>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"><div className="space-y-1 text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm"><label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500"><span>Upload a file</span><input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls, .csv" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">XLSX, XLS, CSV</p></div></div>
            {file && <p className="text-sm">Selected: <span className="font-medium">{file.name}</span></p>}
            <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={!file}>Upload</button></div>
          </form>
        )}
      </div>
    </div>
  );
};


/**
 * ShopOwnerDashboardPage Component
 */
const ShopOwnerDashboardPage = () => {
  const [myProducts, setMyProducts] = useState(mockOwnerProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const shopOwnerName = "Bello Sani";
  const shopName = "Sani's Grains";

  const handleUpdatePrice = (productId, newPrice) => {
    alert(`Updating product ID ${productId} to ₦${newPrice} (simulated).`);
    setMyProducts(myProducts.map(p => p.id === productId ? { ...p, currentPrice: newPrice, lastUpdated: new Date().toISOString().split('T')[0] } : p));
  };

  const handleAddProduct = (newProduct) => {
    alert(`Adding new product "${newProduct.name}" (simulated).`);
    setMyProducts(prev => [...prev, {
      ...newProduct,
      id: Date.now(), // simulate a new ID
      lastUpdated: new Date().toISOString().split('T')[0],
    }]);
  };

  const filteredProducts = myProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <UpdatePriceModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} onUpdate={handleUpdatePrice} />
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddProduct} />

      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shop Owner Dashboard</h1>
            <p className="mt-1 text-md text-gray-600">Welcome, {shopOwnerName} of {shopName}.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">My Products</p>
                <p className="text-2xl font-bold text-gray-900">{myProducts.length}</p>
              </div>
              <div className="text-green-600"><FiBox className="h-6 w-6" /></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Price Updates Today</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="text-green-600"><FiTag className="h-6 w-6" /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">My Product Listings</h2>
              <div className="relative w-full sm:w-auto">
                {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                <input
                  type="text"
                  placeholder="Search my products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 shadow-sm">
                <FiPlus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price (NGN)</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{product.currentPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button onClick={() => setSelectedProduct(product)} className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm">
                        Update Price
                      </button>
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

export default ShopOwnerDashboardPage;
