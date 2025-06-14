
import React, { useState } from 'react';

// --- ICONS ---
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiXCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>);

// --- Mock Data ---
const mockPriceReports = [
  { id: 1, product: 'Yam (Tuber)', market: 'Sabon Gari Market', shopName: 'Binta\'s Provisions', reportedPrice: 1500, reportedBy: 'amina.yusuf@example.com', date: '2024-06-11' },
  { id: 2, product: 'Beans (Mudu)', market: 'Yankura Market', shopName: 'Danladi Foods', reportedPrice: 1750, reportedBy: 'user2@example.com', date: '2024-06-12' },
  { id: 3, product: 'Garri (Mudu)', market: 'Kasuwar Rimi', shopName: 'Sani\'s Grains', reportedPrice: 800, reportedBy: 'user3@example.com', date: '2024-06-13' },
];

/**
 * AdminPriceReportsPage Component
 * Provides an interface for admins to verify or reject user-submitted price reports.
 */
const AdminPriceReportsPage = () => {
  const [reports, setReports] = useState(mockPriceReports);

  const handleApprove = (reportId) => {
    alert(`Approving report ID: ${reportId}. This would update the main product price.`);
    // In a real app, you would make an API call here.
    setReports(reports.filter(r => r.id !== reportId));
  };

  const handleReject = (reportId) => {
    alert(`Rejecting report ID: ${reportId}.`);
    setReports(reports.filter(r => r.id !== reportId));
  };

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Price Reports</h1>
          <p className="mt-1 text-md text-gray-600">Verify new prices submitted by the community.</p>
        </div>

        {/* Reports Table */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {reports.length > 0 ? (
            <table className="w-full table-auto">
              <thead className="text-left bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Market & Shop</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reported Price</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{report.market}</div>
                      <div className="text-xs text-gray-400">{report.shopName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">₦{report.reportedPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.reportedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button onClick={() => handleApprove(report.id)} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200">
                        <FiCheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button onClick={() => handleReject(report.id)} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200">
                        <FiXCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <FiCheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">All Caught Up!</h3>
              <p className="mt-1 text-sm text-gray-500">There are no pending price reports to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPriceReportsPage;
