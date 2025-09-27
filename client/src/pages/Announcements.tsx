import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';
import { format } from 'date-fns';

const Announcements: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        setError(t('announcements.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [t]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: i18n.language });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('announcements.title')}</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('announcements.title')}</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('announcements.title')}</h1>
      
      {announcements.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {t('announcements.noAnnouncements')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div 
              key={announcement._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {announcement.title}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {announcement.content}
                </p>
                
                {announcement.tags && announcement.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {announcement.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
