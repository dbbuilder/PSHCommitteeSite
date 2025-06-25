// Admin document upload page
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'

export default function UploadDocuments() {
  const router = useRouter()
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState('general')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // In a real implementation, this would upload to cloud storage
      // For now, we'll simulate a successful upload
      
      if (files.length === 0) {
        setError('Please select at least one file to upload')
        setLoading(false)
        return
      }

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(`Successfully uploaded ${files.length} file(s)`)
      
      // Reset form
      setFiles([])
      setCategory('general')
      setDescription('')
      
      // Clear file input
      const fileInput = document.getElementById('files')
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Error uploading files:', error)
      setError('Failed to upload files. Please try again.')
    } finally {
      setLoading(false)
    }  }

  const acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf'
  
  return (
    <Layout title="Upload Documents - Admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Upload Documents</h1>
          <Link href="/admin/dashboard" className="text-wa-blue hover:text-wa-green">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
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
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                Select Files *
              </label>
              <input
                type="file"
                id="files"
                name="files"
                multiple
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: PDF, Word, Excel, PowerPoint, Text files
              </p>
            </div>
            
            {/* Selected Files Display */}
            {files.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Document Category *
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                required
              >
                <option value="general">General Documents</option>
                <option value="meeting-minutes">Meeting Minutes</option>
                <option value="reports">Reports & Studies</option>
                <option value="presentations">Presentations</option>
                <option value="policies">Policies & Guidelines</option>
                <option value="forms">Forms & Applications</option>
                <option value="resources">Resources</option>
              </select>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-wa-blue focus:border-wa-blue"
                placeholder="Brief description of the documents (optional)"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link 
                href="/admin/dashboard" 
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="px-4 py-2 text-white bg-wa-blue rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-wa-gray rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Upload Instructions</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 text-wa-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You can upload multiple files at once by selecting them in the file dialog
            </li>
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
              Documents will be available on the Resources page after upload
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
  )
}