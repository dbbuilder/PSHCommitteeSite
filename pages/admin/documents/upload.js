import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function UploadDocuments() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Reports'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      // Auto-populate title from filename if not set
      if (!formData.title && selectedFiles[0]) {
        const filename = selectedFiles[0].name;
        const titleWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
        setFormData({
          ...formData,
          title: titleWithoutExt.replace(/_/g, ' ').replace(/-/g, ' ')
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('adminToken');

    try {
      if (files.length === 0) {
        setError('Please select a file to upload');
        setLoading(false);
        return;
      }

      const file = files[0];
      
      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);

      // Upload file
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      let uploadResult;
      try {
        uploadResult = await uploadResponse.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Server error - invalid response format');
      }

      if (!uploadResponse.ok) {
        throw new Error(uploadResult?.message || 'Failed to upload file');
      }

      // If blob storage is not configured, show warning but continue
      if (uploadResult.warning) {
        alert(uploadResult.warning);
      }

      // Create document record
      const docResponse = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          filename: uploadResult.filename,
          fileSize: formatFileSize(file.size),
          blobUrl: uploadResult.blobUrl // Add blob URL to document record
        })
      });

      let docResult;
      try {
        docResult = await docResponse.json();
      } catch (e) {
        console.error('Failed to parse document response:', e);
        throw new Error('Failed to create document record - invalid response');
      }

      if (!docResponse.ok) {
        throw new Error(docResult.message || 'Failed to create document record');
      }

      setSuccess('Document uploaded successfully!');
      
      // Reset form
      setTimeout(() => {
        router.push('/admin/documents');
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(error.message || 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf';
  
  const categories = [
    'Reports',
    'Legislation',
    'Guidelines',
    'Factsheets',
    'Governance',
    'Meeting Minutes',
    'Presentations',
    'Policies',
    'Forms',
    'Resources'
  ];

  return (
    <Layout title="Upload Document - Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <Link href="/admin/documents" className="text-wa-blue hover:text-wa-green">
            ← Back to Documents
          </Link>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            {/* File Selection */}
            <div className="mb-6">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: PDF, Word, Excel, PowerPoint, Text files (Max: 10MB)
              </p>
            </div>
            
            {/* Selected File Display */}
            {files.length > 0 && (
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected file:</p>
                <div className="text-sm text-gray-600">
                  <p className="flex items-center justify-between">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      {files[0].name} ({formatFileSize(files[0].size)})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const fileURL = URL.createObjectURL(files[0]);
                        window.open(fileURL, '_blank');
                      }}
                      className="text-wa-blue hover:text-wa-green text-sm underline"
                    >
                      Preview
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Document Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Document Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="Brief description of the document"
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link 
                href="/admin/documents" 
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="px-4 py-2 text-white bg-wa-blue rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-wa-gray rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Upload Instructions</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-wa-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Maximum file size: 10MB per file
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-wa-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Provide a clear, descriptive title for easy searching
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-wa-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Choose the appropriate category to help users find the document
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-wa-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Ensure documents do not contain sensitive or confidential information
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}