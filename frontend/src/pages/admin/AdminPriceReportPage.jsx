
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingReports, approveReport, rejectReport } from '../../services/api';

// --- ICONS ---
const FiCheckCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const FiXCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const FiInbox = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);


// --- Reusable UI Components ---
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? FiCheckCircle : FiAlertTriangle;

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} transform transition-transform duration-300 translate-x-0`}>
      <Icon className="h-6 w-6 mr-3" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-center mt-6 space-x-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Confirm</button>
        </div>
      </div>
    </div>
  );
};

/**
 * AdminPriceReportsPage Component
 */
const AdminPriceReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, reportId: null });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data } = await getPendingReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      showNotification("Could not load reports. Please ensure you are logged in as an Admin.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApprove = async (reportId) => {
    try {
      await approveReport(reportId);
      showNotification("Report approved successfully!", "success");
      fetchReports();
    } catch (error) {
      console.error("Failed to approve report:", error);
      showNotification("Could not approve report.", "error");
    }
  };

  const handleRejectClick = (reportId) => {
    setConfirmModal({ isOpen: true, reportId });
  };

  const handleConfirmReject = async () => {
    const { reportId } = confirmModal;
    try {
      await rejectReport(reportId);
      showNotification("Report rejected successfully.", "success");
      fetchReports();
    } catch (error) {
      console.error("Failed to reject report:", error);
      showNotification("Could not reject report.", "error");
    } finally {
      setConfirmModal({ isOpen: false, reportId: null });
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading Reports...</div>;

  return (
    <>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, reportId: null })}
        onConfirm={handleConfirmReject}
        title="Reject Report"
        message="Are you sure you want to reject this price report? This action cannot be undone."
      />
      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verify Price Reports</h1>
            <p className="mt-1 text-md text-gray-600">Review and manage price submissions from the community.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            {reports.length > 0 ? (
              <table className="w-full table-auto">
                <thead className="text-left bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reported Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"><div>{report.marketName}</div><div className="text-xs text-gray-400">{report.shopName}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">₦{report.reportedPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.reportedBy.name || report.reportedBy.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button onClick={() => handleApprove(report._id)} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200"><FiCheckCircle className="h-4 w-4 mr-1" />Approve</button>
                        <button onClick={() => handleRejectClick(report._id)} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200"><FiXCircle className="h-4 w-4 mr-1" />Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <FiInbox className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">All Caught Up!</h3>
                <p className="mt-1 text-sm text-gray-500">There are no pending price reports to review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPriceReportsPage;
