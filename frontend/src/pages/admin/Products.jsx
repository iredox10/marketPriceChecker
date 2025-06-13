
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- ICONS (You would import these from your central Icons.jsx file) ---
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// --- Mock Data ---
const mockProducts = [
  {
    id: 1,
    name: 'Tomatoes (Basket)',
    market: 'Kasuwar Rimi',
    averagePrice: 15000,
    priceHistory: [
      { price: 15500, date: '2024-06-12', shopOwner: 'Sani\'s Grains' },
      { price: 14800, date: '2024-06-11', shopOwner: 'Fati\'s Fresh Produce' },
      { price: 14700, date: '2024-06-10', shopOwner: 'Aisha General Store' },
    ],
  },
  {
    id: 2,
    name: 'Rice (50kg Bag)',
    market: 'Sabon Gari Market',
    averagePrice: 78000,
    priceHistory: [
      { price: 78500, date: '2024-06-12', shopOwner: 'Aisha General Store' },
      { price: 77500, date: '2024-06-11', shopOwner: 'Ibrahim & Sons' },
    ],
  },
  {
    id: 3,
    name: 'Palm Oil (25L)',
    market: 'Yankura Market',
    averagePrice: 42000,
    priceHistory: [
      { price: 42000, date: '2024-06-12', shopOwner: 'Hauwa\'s Spices' },
      { price: 42500, date: '2024-06-11', shopOwner: 'Fati\'s Fresh Produce' },
    ],
  },
  {
    id: 4,
    name: 'Onions (Bag)',
    market: 'Kasuwar Rimi',
    averagePrice: 22000,
    priceHistory: [
      { price: 22500, date: '2024-06-12', shopOwner: 'Sani\'s Grains' },
      { price: 21800, date: '2024-06-11', shopOwner: 'Aisha General Store' },
    ],
  },
];

/**
 * PriceHistoryModal Component
 * Displays the price history for a selected product.
 */
const PriceHistoryModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Price History for {product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">Market: {product.market}</p>
        <div className="overflow-y-auto max-h-80">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 font-medium text-gray-600">Price (NGN)</th>
                <th className="px-4 py-2 font-medium text-gray-600">Shop Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {product.priceHistory.map((entry, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-gray-600">{entry.date}</td>
                  <td className="px-4 py-2 font-mono text-gray-800">{entry.price.toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-600">{entry.shopOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


/**
 * ViewAllProductsPage Component
 * Displays a searchable and filterable table of all products.
 */
const ViewAllProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PriceHistoryModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="mt-1 text-md text-gray-600">Browse and manage all products tracked in the system.</p>
          </div>

          {/* Search and Filter bar */}
          <div className="mb-6">
            <div className="relative">
              {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Search by product name or market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price (NGN)</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.market}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">
                      {product.averagePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View History
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

export default ViewAllProductsPage;
