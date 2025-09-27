import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Star, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

// Mock types
interface Announcement {
  _id: string;
  title: string;
  content: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock services
const mockAnnouncements: Announcement[] = [
  {
    _id: '1',
    title: 'New Product Launch',
    content: 'We are excited to announce our new product line...',
    published: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: 'System Maintenance Notice',
    content: 'Scheduled maintenance will occur on...',
    published: false,
    featured: false,
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-14T08:30:00Z'
  },
  {
    _id: '3',
    title: 'Holiday Schedule',
    content: 'Our office hours during the holiday season...',
    published: true,
    featured: false,
    createdAt: '2024-01-13T14:15:00Z',
    updatedAt: '2024-01-13T14:15:00Z'
  }
];

// Mock services
const getAnnouncements = async (): Promise<Announcement[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAnnouncements;
};

const toggleFeatured = async (id: string): Promise<Announcement> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const announcement = mockAnnouncements.find(a => a._id === id);
  if (!announcement) throw new Error('Announcement not found');
  announcement.featured = !announcement.featured;
  return announcement;
};

const togglePublished = async (id: string): Promise<Announcement> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const announcement = mockAnnouncements.find(a => a._id === id);
  if (!announcement) throw new Error('Announcement not found');
  announcement.published = !announcement.published;
  return announcement;
};

const deleteAnnouncement = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockAnnouncements.findIndex(a => a._id === id);
  if (index === -1) throw new Error('Announcement not found');
  mockAnnouncements.splice(index, 1);
};

// Format date helper
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Toast notification system
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

// Toast component
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white max-w-sm cursor-pointer transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          onClick={() => onRemove(toast.id)}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

// AdminLayout component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// AnnouncementRow component
const AnnouncementRow: React.FC<{
  announcement: Announcement;
  onToggleFeatured: (id: string) => void;
  onTogglePublished: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ announcement, onToggleFeatured, onTogglePublished, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{announcement.title}</div>
            <div className="text-gray-500 truncate max-w-xs">
              {announcement.content.substring(0, 60)}...
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            announcement.published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {announcement.published ? 'Published' : 'Draft'}
          </span>
          {announcement.featured && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {formatDate(announcement.createdAt)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleFeatured(announcement._id)}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              announcement.featured ? 'text-yellow-500' : 'text-gray-400'
            }`}
            title={announcement.featured ? 'Remove from featured' : 'Mark as featured'}
          >
            <Star className="h-4 w-4" fill={announcement.featured ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={() => onTogglePublished(announcement._id)}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              announcement.published ? 'text-green-500' : 'text-gray-400'
            }`}
            title={announcement.published ? 'Unpublish' : 'Publish'}
          >
            {announcement.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => {}}
            className="p-1 rounded-full hover:bg-gray-100 text-blue-500"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(announcement._id)}
            className="p-1 rounded-full hover:bg-gray-100 text-red-500"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Main Announcements component
const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements. Please try again later.');
      showToast('Failed to load announcements', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      const updatedAnnouncement = await toggleFeatured(id);
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement._id === id ? updatedAnnouncement : announcement
        )
      );
      showToast(
        `Announcement ${updatedAnnouncement.featured ? 'marked as featured' : 'removed from featured'}`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleTogglePublished = async (id: string) => {
    try {
      const updatedAnnouncement = await togglePublished(id);
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement._id === id ? updatedAnnouncement : announcement
        )
      );
      showToast(
        `Announcement ${updatedAnnouncement.published ? 'published' : 'unpublished'} successfully`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling published status:', error);
      showToast('Failed to update published status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        setAnnouncements(prevAnnouncements => 
          prevAnnouncements.filter(announcement => announcement._id !== id)
        );
        showToast('Announcement deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        showToast('Failed to delete announcement', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAnnouncements}
                className="mt-2 text-sm text-red-600 underline hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage all announcements that appear on the platform.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => showToast('Add announcement feature coming soon!', 'info')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Announcement</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Title
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Created
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {announcements.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-sm text-gray-500 text-center">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No announcements found</p>
                            <p className="text-gray-500">Get started by creating your first announcement.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      announcements.map((announcement) => (
                        <AnnouncementRow
                          key={announcement._id}
                          announcement={announcement}
                          onToggleFeatured={handleToggleFeatured}
                          onTogglePublished={handleTogglePublished}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
};

export default Announcements;