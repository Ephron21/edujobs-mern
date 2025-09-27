import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getAnnouncementById, 
  updateAnnouncement,
  Announcement
} from '../../../services/announcementService';
import AnnouncementForm from '../../components/AnnouncementForm';
import AdminLayout from '../../layouts/AdminLayout';

interface RouteParams {
  id: string;
}

const EditAnnouncement: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
        toast.error('Failed to load announcement', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        history.push('/admin/announcements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, history]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await updateAnnouncement(id, formData);
      
      toast.success('Announcement updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect to announcements list
      history.push('/admin/announcements');
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to update announcement', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      throw error; // Let the form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!announcement) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Announcement not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Edit Announcement
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the details of this announcement.
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <AnnouncementForm
                initialData={announcement}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                submitButtonText="Update Announcement"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditAnnouncement;
