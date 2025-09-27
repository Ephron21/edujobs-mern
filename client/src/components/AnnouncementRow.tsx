// components/AnnouncementRow.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Announcement } from '../services/announcementService';
import { format } from 'date-fns';

interface AnnouncementRowProps {
  announcement: Announcement;
  onToggleFeatured: (id: string) => void;
  onTogglePublished: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementRow: React.FC<AnnouncementRowProps> = ({
  announcement,
  onToggleFeatured,
  onTogglePublished,
  onDelete,
}) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {announcement.mediaUrl && announcement.mediaType === 'image' ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={announcement.mediaUrl}
                alt=""
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium">
                  {announcement.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{announcement.title}</div>
            <div className="text-gray-500 line-clamp-1">
              {announcement.content.substring(0, 60)}...
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-col space-y-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              announcement.published
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {announcement.published ? 'Published' : 'Draft'}
          </span>
          {announcement.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Featured
            </span>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTogglePublished(announcement._id)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
            title={announcement.published ? 'Unpublish' : 'Publish'}
          >
            {announcement.published ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.99 3.99 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.99 3.99 0 015 15a3.99 3.99 0 01-2.67-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.26 0 .51-.052.742-.146l.99-3.08-1.732-1.5zM15 12c.26 0 .51-.052.742-.146l.99-3.08-1.732-1.5-.818 2.552c.25.112.526.174.818.174z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => onToggleFeatured(announcement._id)}
            className={`${
              announcement.featured
                ? 'text-yellow-600 hover:text-yellow-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={announcement.featured ? 'Remove from featured' : 'Add to featured'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <Link
            to={`/admin/announcements/edit/${announcement._id}`}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.793.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Link>
          <button
            onClick={() => onDelete(announcement._id)}
            className="text-red-600 hover:text-red-900 ml-2"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AnnouncementRow;