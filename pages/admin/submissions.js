import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function Submissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, filterStatus]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();
      
      if (response.ok) {
        // Sort by date, most recent first
        const sorted = data.submissions.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setSubmissions(sorted);
      } else {
        setError(data.error || 'Failed to fetch submissions');
      }
    } catch (error) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.organization && sub.organization.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => 
        filterStatus === 'read' ? sub.read : !sub.read
      );
    }

    setFilteredSubmissions(filtered);
  };

  const toggleRead = async (id) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleRead' })
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, read: !sub.read } : sub
          )
        );
      }
    } catch (error) {
      console.error('Failed to update submission:', error);
    }
  };

  const deleteSubmission = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete submission:', error);
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) return;

    try {
      const response = await fetch('/api/admin/submissions/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedSubmissions })
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.filter(sub => !selectedSubmissions.includes(sub.id))
        );
        setSelectedSubmissions([]);
      }
    } catch (error) {
      console.error('Failed to delete submissions:', error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedSubmissions(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map(sub => sub.id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Form Submissions</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-gray-600">
              Total: {submissions.length} | Unread: {submissions.filter(s => !s.read).length}
            </p>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Submissions</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
            <div className="flex items-end">
              {selectedSubmissions.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Selected ({selectedSubmissions.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'No submissions match your filters.' 
                : 'No submissions yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.length === filteredSubmissions.length}
                        onChange={selectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className={submission.read ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.includes(submission.id)}
                          onChange={() => toggleSelect(submission.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.read 
                            ? 'bg-gray-200 text-gray-700' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(submission.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {submission.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                          {submission.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {submission.organization || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleRead(submission.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          {submission.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => deleteSubmission(submission.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}