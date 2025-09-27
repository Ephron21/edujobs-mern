import { useState, useEffect } from 'react';
import { Eye, Download, Filter, Search, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  serviceType: string;
  status: 'pending' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected';
  resumeUrl?: string;
  certificatesUrl?: string[];
  createdAt: string;
  reviewedBy?: any;
  reviewedAt?: string;
  notes?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminApplicants() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  
  // Pagination
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [statistics, setStatistics] = useState({
    pending: 0,
    under_review: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    accepted: 0,
    rejected: 0
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(serviceTypeFilter !== 'all' && { serviceType: serviceTypeFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${apiUrl}/api/applications/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      if (data.success) {
        setApplications(data.data.applications);
        setPagination(data.data.pagination);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [pagination.page, statusFilter, serviceTypeFilter, searchTerm]);

  const updateApplicationStatus = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';

      const response = await fetch(`${apiUrl}/api/applications/admin/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, notes })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh applications
        fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update application status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications Management</h1>
        <p className="text-gray-600">Manage and review job applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(statistics).map(([status, count]) => (
          <div key={status} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-600 mb-1">{formatStatus(status)}</div>
            <div className="text-2xl font-bold text-gray-900">{count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Services</option>
            <option value="job_application">Job Application</option>
            <option value="scholarship">Scholarship</option>
            <option value="training">Training</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {app.firstName} {app.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{app.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.province}</div>
                      <div className="text-sm text-gray-500">{app.district}, {app.sector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                        {formatStatus(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.resumeUrl && (
                        <a
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/${app.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
          onStatusUpdate={updateApplicationStatus}
        />
      )}
    </div>
  );
}

// Application Detail Modal Component
function ApplicationDetailModal({ 
  application, 
  onClose, 
  onStatusUpdate 
}: { 
  application: Application;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
}) {
  const [newStatus, setNewStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');

  const handleStatusUpdate = () => {
    onStatusUpdate(application._id, newStatus, notes);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Application Details - {application.firstName} {application.lastName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Personal Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <p className="text-sm text-gray-900">{application.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <p className="text-sm text-gray-900">{application.lastName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{application.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{application.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-sm text-gray-900">{application.gender}</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 border-b pb-2 mt-6">Parent Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <p className="text-sm text-gray-900">{application.fatherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Father's Phone</label>
                <p className="text-sm text-gray-900">{application.fatherPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                <p className="text-sm text-gray-900">{application.motherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mother's Phone</label>
                <p className="text-sm text-gray-900">{application.motherPhone}</p>
              </div>
            </div>
          </div>

          {/* Location & Status */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Location Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Province</label>
                <p className="text-sm text-gray-900">{application.province}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <p className="text-sm text-gray-900">{application.district}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <p className="text-sm text-gray-900">{application.sector}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cell</label>
                <p className="text-sm text-gray-900">{application.cell || 'N/A'}</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 border-b pb-2 mt-6">Application Status</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2"
                placeholder="Add notes about this application..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Applied Date</label>
              <p className="text-sm text-gray-900">{new Date(application.createdAt).toLocaleString()}</p>
            </div>

            {/* Documents */}
            <h4 className="font-medium text-gray-900 border-b pb-2 mt-6">Documents</h4>
            <div className="space-y-2">
              {application.resumeUrl && (
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/${application.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  ID Document
                </a>
              )}
              {application.certificatesUrl && application.certificatesUrl.length > 0 && (
                application.certificatesUrl.map((url, index) => (
                  <a
                    key={index}
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Certificate {index + 1}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
