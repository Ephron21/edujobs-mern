import React, { useState } from 'react';
import { Announcement } from '../services/announcementService';
import useAnnouncementForm, { AnnouncementFormData } from '../hooks/useAnnouncementForm';

interface AnnouncementFormProps {
  initialData?: Announcement;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText?: string;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitButtonText = 'Submit',
}) => {
  const [serverError, setServerError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.mediaUrl || null
  );

  const {
    formData,
    errors,
    handleChange,
    handleFileChange,
    validate,
    getFormData,
  } = useAnnouncementForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    try {
      const formData = getFormData();
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setServerError(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
    
    // Create preview URL for images
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(initialData?.mediaUrl || null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title *
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.title ? 'border-red-300' : ''
            }`}
            placeholder="Enter announcement title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content *
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            name="content"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.content ? 'border-red-300' : ''
            }`}
            placeholder="Enter announcement content"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="media"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Media (Image/Video)
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="media"
            name="media"
            accept="image/*,video/mp4"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {errors.mediaFile && (
          <p className="mt-1 text-sm text-red-600">{errors.mediaFile}</p>
        )}
        
        {/* Media Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview:
            </p>
            {previewUrl.endsWith('.mp4') ? (
              <video 
                src={previewUrl} 
                controls 
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 max-w-full rounded-lg shadow-sm border border-gray-200"
              />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="featured"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Featured
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Publish
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
