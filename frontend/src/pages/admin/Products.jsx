
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Import the necessary API service functions
import { getProducts } from '../../services/api';

// --- ICONS ---
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const FiMap = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>);
const FiDollarSign = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// --- Reusable Components ---
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-lg flex items-center">
    <div className="bg-green-100 p-3 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="font-bold text-2xl text-gray-800">{value}</p>
    </div>
  </div>
);

const PriceHistoryModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h3 className="text-xl font-bold text-gray-800 mb-1">Price History for {product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">Market: {product.market.name}</p>
        <div className="overflow-y-auto max-h-80 border-t mt-4 pt-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 font-medium">Date</th><th className="px-4 py-2 font-medium">Price (NGN)</th><th className="px-4 py-2 font-medium">Shop Owner</th></tr></thead>
            <tbody className="divide-y">
              {product.priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-mono">₦{entry.price.toLocaleString()}</td>
                  <td className="px-4 py-2">{entry.shopOwner?.shopName || 'N/A'}</td>
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
 */
const ViewAllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalMarkets: 0, avgProductPrice: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await getProducts();
        setProducts(data);

        // Calculate stats
        if (data.length > 0) {
          const totalProducts = data.length;
          const uniqueMarkets = [...new Set(data.map(p => p.market._id))].length;
          const avgProductPrice = data.reduce((sum, p) => sum + p.averagePrice, 0) / totalProducts;
          setStats({ totalProducts, totalMarkets: uniqueMarkets, avgProductPrice });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Could not load products. Please ensure you are logged in as an Admin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading Products...</div>;

  return (
    <>
      <PriceHistoryModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">All Products</h1>
            <p className="mt-1 text-lg text-gray-600">A complete directory of all items tracked across markets.</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Products Tracked" value={stats.totalProducts} icon={<FiShoppingBag className="h-6 w-6 text-green-600" />} />
            <StatCard title="Across Markets" value={stats.totalMarkets} icon={<FiMap className="h-6 w-6 text-green-600" />} />
            <StatCard title="Overall Average Price" value={Math.round(stats.avgProductPrice)} icon={<FiDollarSign className="h-6 w-6 text-green-600" />} />
          </div>

          {/* Main Content: Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-bold text-gray-800">Product List</h2>
              <div className="relative w-full sm:w-auto">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products, markets, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="text-left bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Market</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Average Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">History</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.market.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono text-right">₦{product.averagePrice.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => setSelectedProduct(product)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAllProductsPage;
