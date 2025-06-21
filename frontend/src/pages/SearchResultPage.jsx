
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
// Import the necessary API service functions
import { getProducts, createPriceReport, getPublicReports } from '../services/api';
// Import date-fns for formatting chart labels
import { format, startOfWeek, startOfMonth, startOfYear, parseISO, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- ICONS ---
const FiAlertCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiSend = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const FiTrendingDown = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>);
const FiTrendingUp = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>);
const FiDollarSign = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const FiChevronUp = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" {...props}><polyline points="18 15 12 9 6 15"></polyline></svg>);
const FiChevronDown = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const FiChevronLeft = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>);
const FiChevronRight = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>);

// --- Reusable Components ---
const Notification = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(() => onClose(), 5000); return () => clearTimeout(timer); }, [onClose]);
  const isSuccess = type === 'success';
  return (<div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}><span className="text-sm font-medium">{message}</span><button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20"><FiX className="h-4 w-4" /></button></div>);
};

const StatCard = ({ title, value, date, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className="bg-green-100 text-green-600 rounded-lg p-3 mr-4">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-xl font-bold text-gray-800">
        {value ? `₦${value.toLocaleString()}` : 'N/A'}
      </p>
      {date && <p className="text-xs text-gray-400">on {new Date(date).toLocaleDateString()}</p>}
    </div>
  </div>
);

const PriceChart = ({ productName, priceEntries }) => {
  const [timeframe, setTimeframe] = useState('daily');

  const chartData = useMemo(() => {
    if (priceEntries.length === 0) {
      return { labels: [], data: [] };
    }

    const avgPricePerDay = new Map();
    priceEntries.forEach(entry => {
      const dayKey = format(parseISO(entry.date), 'yyyy-MM-dd');
      if (!avgPricePerDay.has(dayKey)) {
        avgPricePerDay.set(dayKey, { prices: [] });
      }
      avgPricePerDay.get(dayKey).prices.push(entry.price);
    });

    avgPricePerDay.forEach((value, key) => {
      const avg = value.prices.reduce((a, b) => a + b, 0) / value.prices.length;
      avgPricePerDay.set(key, avg);
    });

    const labels = [];
    const data = [];

    if (timeframe === 'daily') {
      const today = new Date();
      const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
      last7Days.forEach(day => {
        labels.push(format(day, 'EEE')); // Mon, Tue, etc.
        const dayKey = format(day, 'yyyy-MM-dd');
        data.push(avgPricePerDay.get(dayKey) || null); // Use null for gaps
      });
    } else {
      const timeGroupedData = new Map();
      priceEntries.forEach(entry => {
        const date = parseISO(entry.date);
        let key;
        if (timeframe === 'weekly') key = format(startOfWeek(date), 'yyyy-MM-dd');
        else if (timeframe === 'monthly') key = format(startOfMonth(date), 'yyyy-MMM');
        else if (timeframe === 'yearly') key = format(startOfYear(date), 'yyyy');

        if (!timeGroupedData.has(key)) timeGroupedData.set(key, { prices: [] });
        timeGroupedData.get(key).prices.push(entry.price);
      });
      const sortedMap = new Map([...timeGroupedData.entries()].sort());
      sortedMap.forEach((value, key) => {
        let label;
        if (timeframe === 'weekly') label = `Wk ${format(parseISO(key), 'w')}`;
        else label = key;
        labels.push(label);
        const avgPrice = value.prices.reduce((a, b) => a + b, 0) / value.prices.length;
        data.push(avgPrice);
      });
    }
    return { labels, data };
  }, [priceEntries, timeframe]);

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (value) => '₦' + value / 1000 + 'k' } } }, spanGaps: true };
  const dataConfig = { labels: chartData.labels, datasets: [{ label: 'Average Price', data: chartData.data, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.3 }], };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Price History Trend</h3>
      <div className="flex justify-center space-x-1 mb-4 bg-gray-100 p-1 rounded-full">
        {['daily', 'weekly', 'monthly', 'yearly'].map(t => (
          <button key={t} onClick={() => setTimeframe(t)} className={`flex-1 px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 ${timeframe === t ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="h-64 relative">
        <Line options={options} data={dataConfig} />
      </div>
    </div>
  );
};

const ReportPriceModal = ({ isOpen, onClose, productName, onReportSubmit }) => {
  const [formData, setFormData] = useState({ shopName: '', marketName: '', reportedPrice: '' });
  if (!isOpen) return null;
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onReportSubmit({ productName, ...formData }); onClose(); };
  return (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX /></button><h2 className="text-2xl font-bold mb-2">Report a Price</h2><p className="text-gray-600 mb-6">Help the community by reporting a price for <span className="font-semibold capitalize">{productName}</span>.</p><form onSubmit={handleSubmit} className="space-y-4"><input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required /><input type="text" name="marketName" placeholder="Market Name" value={formData.marketName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required /><input type="number" name="reportedPrice" placeholder="Price (NGN)" value={formData.reportedPrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required /><div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose}>Cancel</button><button type="submit">Submit Report</button></div></form></div></div>);
};

const ShopInfoModal = ({ isOpen, onClose, shopData }) => {
  if (!isOpen || !shopData) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"><FiShoppingBag className="h-8 w-8 text-green-600" /></div>
          <h3 className="text-xl font-bold text-gray-800">{shopData.shopName}</h3>
          <p className="text-sm text-gray-500">Market: {shopData.marketName}</p>
        </div>
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-600">Their price for this item:</p>
          <p className="text-3xl font-bold text-green-600 font-mono">₦{shopData.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
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

/**
 * SearchResultsPage Component
 */
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();

  const [allPriceEntries, setAllPriceEntries] = useState([]);
  const [stats, setStats] = useState({ low: null, high: null, avg: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [listSearchTerm, setListSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const showNotification = (message, type = 'success') => setNotification({ show: true, message, type });

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) { setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const [productsRes, reportsRes] = await Promise.all([
          getProducts({ keyword: query }),
          getPublicReports({ productName: query })
        ]);
        processFetchedData(productsRes.data, reportsRes.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        showNotification("Could not load search results.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const processFetchedData = (productsData, reportsData) => {
      const verifiedEntries = productsData.flatMap(p => p.priceHistory.map(h => ({ id: `v-${p._id}-${h._id}`, productName: p.name, price: h.price, date: h.date, marketName: p.market.name, marketId: p.market._id, shopName: h.shopOwner?.shopName || 'N/A', type: 'Verified' })));
      const communityEntries = (reportsData || []).map(r => ({ id: `c-${r._id}`, productName: r.productName, price: r.reportedPrice, date: r.createdAt, marketName: r.marketName, shopName: r.shopName, type: 'Community Report' }));
      const combined = [...verifiedEntries, ...communityEntries];
      setAllPriceEntries(combined);

      if (combined.length > 0) {
        const low = combined.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
        const high = combined.reduce((prev, curr) => prev.price > curr.price ? prev : curr);
        const avg = combined.reduce((sum, entry) => sum + entry.price, 0) / combined.length;
        setStats({ low, high, avg });
      } else {
        setStats({ low: null, high: null, avg: 0 });
      }
    };

    fetchResults();
  }, [query]);

  const handleReportButtonClick = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      setIsReportModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleReportSubmit = async (reportData) => {
    try {
      const { data } = await createPriceReport(reportData);
      showNotification("Thank you! Your report has been submitted.", "success");
      const newReportEntry = { id: `c-${data.report._id}`, productName: data.report.productName, price: data.report.reportedPrice, date: data.report.createdAt, marketName: data.report.marketName, shopName: data.report.shopName, type: 'Community Report' };
      setAllPriceEntries(prevEntries => [newReportEntry, ...prevEntries]);
    } catch (error) {
      console.error("Failed to submit report:", error);
      showNotification(error.response?.data?.message || "Could not submit report.", "error");
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedResults = useMemo(() => {
    let sortableItems = [...allPriceEntries];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'date') { valA = new Date(valA); valB = new Date(valB); }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems.filter(item => {
      const term = listSearchTerm.toLowerCase();
      return item.shopName.toLowerCase().includes(term) || item.marketName.toLowerCase().includes(term) || item.price.toString().includes(term);
    });
  }, [allPriceEntries, listSearchTerm, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  if (isLoading) return <div className="text-center py-20">Searching for prices...</div>;

  return (
    <>
      <ReportPriceModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} productName={query} onReportSubmit={handleReportSubmit} />
      <ShopInfoModal isOpen={!!selectedShop} onClose={() => setSelectedShop(null)} shopData={selectedShop} />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Results for "<span className="text-green-600 capitalize">{query}</span>"</h1>
            <button onClick={handleReportButtonClick} className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-md"><FiSend className="h-5 w-5 mr-2" />Report a Price</button>
          </div>
          {allPriceEntries.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><StatCard title="Lowest Price" value={stats.low?.price} date={stats.low?.date} icon={<FiTrendingDown />} /><StatCard title="Highest Price" value={stats.high?.price} date={stats.high?.date} icon={<FiTrendingUp />} /><StatCard title="Average Price" value={stats.avg} icon={<FiDollarSign />} /></div>
                <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4"><h3 className="text-lg font-semibold whitespace-nowrap">Available Listings ({filteredAndSortedResults.length})</h3><div className="relative w-full sm:w-auto"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="Filter by shop, market, price..." value={listSearchTerm} onChange={(e) => setListSearchTerm(e.target.value)} className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm border rounded-full" /></div></div>
                  <table className="w-full table-auto">
                    <thead className="text-left bg-gray-50"><tr><th className="px-6 py-3 text-xs font-medium uppercase">Shop Name</th><th className="px-6 py-3 text-xs font-medium uppercase">Market</th><th className="px-6 py-3 text-xs font-medium uppercase cursor-pointer" onClick={() => requestSort('date')}><div className="flex items-center">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FiChevronUp className="h-4 w-4 ml-1" /> : <FiChevronDown className="h-4 w-4 ml-1" />)}</div></th><th className="px-6 py-3 text-xs font-medium uppercase">Source</th><th className="px-6 py-3 text-xs font-medium uppercase text-right cursor-pointer" onClick={() => requestSort('price')}><div className="flex items-center justify-end">Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <FiChevronUp className="h-4 w-4 ml-1" /> : <FiChevronDown className="h-4 w-4 ml-1" />)}</div></th></tr></thead>
                    <tbody className="divide-y">{currentItems.map((item) => (<tr key={item.id}><td className="px-6 py-4 text-sm font-medium"><button onClick={() => setSelectedShop(item)} className="text-indigo-600 hover:underline">{item.shopName}</button></td><td className="px-6 py-4 text-sm text-gray-600"><Link to={`/markets/${item.marketId}`} className="hover:underline">{item.marketName}</Link></td><td className="px-6 py-4 text-sm text-gray-600">{new Date(item.date).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</td><td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{item.type}</span></td><td className="px-6 py-4 text-right text-sm font-bold font-mono">₦{item.price.toLocaleString()}</td></tr>))}</tbody>
                  </table>
                  <div className="pt-4 border-t"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /></div>
                </div>
              </div>
              <div className="lg:col-span-1 space-y-8"><PriceChart productName={query} priceEntries={allPriceEntries} /></div>
            </div>
          ) : (<div className="text-center bg-white p-12 rounded-lg shadow-md mt-8"><FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-lg font-medium">No Prices Found</h3><p className="mt-1 text-sm text-gray-500">We couldn't find any current prices for "{query}".</p><button onClick={handleReportButtonClick} className="inline-block mt-6 px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Be the first to report a price!</button></div>)}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
