
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopDetails } from '../../services/api';

// --- ICONS ---
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiTag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>);
const FiUser = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);


const ShopDetailPage = () => {
  const { id: shopId } = useParams();
  const [shopData, setShopData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShopData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getShopDetails(shopId);
        setShopData(data);
      } catch (error) {
        console.error("Failed to fetch shop details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShopData();
  }, [shopId]);

  const filteredProducts = useMemo(() => {
    if (!shopData) return [];
    return shopData.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shopData, searchTerm]);

  if (isLoading) return <div className="text-center py-20">Loading Shop Details...</div>;
  if (!shopData) return <div className="text-center py-20 bg-white m-8 rounded-lg shadow-md"><FiAlertTriangle className="mx-auto h-12 w-12 text-red-400" /><h2 className="mt-4 text-xl font-semibold text-red-600">Shop Not Found</h2><p className="mt-2 text-gray-600">We couldn't find details for this shop.</p><Link to="/markets" className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded-md">Back to Markets</Link></div>;

  const { shopDetails, products } = shopData;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.latestPrice, 0) / products.length : 0;

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center space-x-6">
          <div className="bg-green-100 p-4 rounded-full"><FiShoppingBag className="h-10 w-10 text-green-600" /></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{shopDetails.shopName}</h1>
            <p className="text-md text-gray-500">Proprietor: {shopDetails.name}</p>
            <Link to={`/markets/${shopDetails.market._id}`} className="text-sm text-green-600 hover:underline flex items-center"><FiMapPin className="h-4 w-4 mr-1" />{shopDetails.market.name}</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Products Listed</p><p className="text-2xl font-bold">{products.length}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Average Item Price</p><p className="text-2xl font-bold font-mono">₦{Math.round(avgPrice).toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">Product Price List</h2>
            <div className="relative w-full sm:w-auto"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search this shop's products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-full" /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2 uppercase text-xs font-medium">Product</th><th className="px-4 py-2 uppercase text-xs font-medium">Category</th><th className="px-4 py-2 uppercase text-xs font-medium">Last Updated</th><th className="px-4 py-2 uppercase text-xs font-medium text-right">Price</th></tr></thead>
              <tbody className="divide-y">
                {filteredProducts.map(p => (
                  <tr key={p._id}>
                    <td className="px-4 py-3"><Link to={`/search?q=${p.name}`} className="text-sm font-medium text-green-600 hover:underline">{p.name}</Link></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right font-mono">₦{p.latestPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
