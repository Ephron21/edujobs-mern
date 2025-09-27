import { useState, useEffect } from 'react';
import { Download, Trash2, Eye, FileText, Image, File, Calendar, HardDrive } from 'lucide-react';

interface FileItem {
  name: string;
  size: number;
  mtime: string;
  type: string;
}

export default function AdminFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';

      const response = await fetch(`${apiUrl}/api/admin/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      if (data.success) {
        setFiles(data.data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const extension = type.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (extension === '.pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileType = (type: string) => {
    const extension = type.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      return 'Image';
    } else if (extension === '.pdf') {
      return 'PDF Document';
    } else {
      return 'Document';
    }
  };

  const isImageFile = (type: string) => {
    const extension = type.toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const getFilesByType = () => {
    const types = {
      images: 0,
      pdfs: 0,
      others: 0
    };

    files.forEach(file => {
      const extension = file.type.toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
        types.images++;
      } else if (extension === '.pdf') {
        types.pdfs++;
      } else {
        types.others++;
      }
    });

    return types;
  };

  const fileTypes = getFilesByType();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Files Management</h1>
        <p className="text-gray-600">Manage uploaded files and documents</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Total Files</div>
              <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Image className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Images</div>
              <div className="text-2xl font-bold text-gray-900">{fileTypes.images}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">PDF Documents</div>
              <div className="text-2xl font-bold text-gray-900">{fileTypes.pdfs}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600">Total Size</div>
              <div className="text-2xl font-bold text-gray-900">{formatFileSize(getTotalSize())}</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Files Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading files...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No files found
                  </td>
                </tr>
              ) : (
                files.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {file.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getFileType(file.type)}</div>
                      <div className="text-sm text-gray-500">{file.type.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(file.mtime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(file.mtime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {isImageFile(file.type) && (
                          <button
                            onClick={() => {
                              setSelectedFile(file);
                              setShowPreview(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <a
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/uploads/applications/${file.name}`}
                          download
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this file?')) {
                              // TODO: Implement file deletion
                              console.log('Delete file:', file.name);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && selectedFile && isImageFile(selectedFile.type) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Image Preview - {selectedFile.name}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/uploads/applications/${selectedFile.name}`}
                alt={selectedFile.name}
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">File Name:</span>
                  <span className="ml-2 text-gray-900">{selectedFile.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Size:</span>
                  <span className="ml-2 text-gray-900">{formatFileSize(selectedFile.size)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Type:</span>
                  <span className="ml-2 text-gray-900">{getFileType(selectedFile.type)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Modified:</span>
                  <span className="ml-2 text-gray-900">{new Date(selectedFile.mtime).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <a
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/uploads/applications/${selectedFile.name}`}
                download
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Download
              </a>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
