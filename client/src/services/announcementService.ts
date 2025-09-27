import api from './api';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementResponse {
  success: boolean;
  data: Announcement | Announcement[];
  message?: string;
}

// Get all announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await api.get<AnnouncementResponse>('/announcements');
    return Array.isArray(response.data.data) 
      ? response.data.data 
      : [response.data.data];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Get a single announcement by ID
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  try {
    const response = await api.get<AnnouncementResponse>(`/announcements/${id}`);
    return response.data.data as Announcement;
  } catch (error) {
    console.error(`Error fetching announcement with ID ${id}:`, error);
    throw error;
  }
};

// Create a new announcement
export const createAnnouncement = async (formData: FormData): Promise<Announcement> => {
  try {
    const response = await api.post<AnnouncementResponse>(
      '/announcements',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data as Announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Update an existing announcement
export const updateAnnouncement = async (
  id: string,
  formData: FormData
): Promise<Announcement> => {
  try {
    const response = await api.put<AnnouncementResponse>(
      `/announcements/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data as Announcement;
  } catch (error) {
    console.error(`Error updating announcement with ID ${id}:`, error);
    throw error;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await api.delete(`/announcements/${id}`);
  } catch (error) {
    console.error(`Error deleting announcement with ID ${id}:`, error);
    throw error;
  }
};

// Toggle featured status
export const toggleFeatured = async (id: string): Promise<Announcement> => {
  try {
    const response = await api.patch<AnnouncementResponse>(
      `/announcements/${id}/toggle-featured`
    );
    return response.data.data as Announcement;
  } catch (error) {
    console.error(`Error toggling featured status for announcement ${id}:`, error);
    throw error;
  }
};

// Toggle published status
export const togglePublished = async (id: string): Promise<Announcement> => {
  try {
    const response = await api.patch<AnnouncementResponse>(
      `/announcements/${id}/toggle-published`
    );
    return response.data.data as Announcement;
  } catch (error) {
    console.error(`Error toggling published status for announcement ${id}:`, error);
    throw error;
  }
};

// Get featured announcements
export const getFeaturedAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await api.get<AnnouncementResponse>(
      '/announcements/featured'
    );
    return Array.isArray(response.data.data) 
      ? response.data.data 
      : [response.data.data];
  } catch (error) {
    console.error('Error fetching featured announcements:', error);
    throw error;
  }
};

export default {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleFeatured,
  togglePublished,
  getFeaturedAnnouncements,
};
