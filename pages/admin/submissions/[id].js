import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';

export default function ViewSubmission() {
  const router = useRouter();
  const { id } = router.query;
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      checkAuth();
      fetchSubmission();
    }
  }, [id]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubmission(data);
        // Mark as read automatically when viewing
        if (!data.read) {
          markAsRead();
        }
      } else {
        setError(data.error || 'Failed to fetch submission');
      }
    } catch (error) {
      setError('Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleRead' })
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/admin/submissions');
      } else {
        alert('Failed to delete submission');
      }
    } catch (error) {
      console.error('Failed to delete submission:', error);
      alert('Failed to delete submission');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </Layout>
    );
  }

  if (error || !submission) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Submission not found'}
          </div>
          <button
            onClick={() => router.push('/admin/submissions')}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Back to Submissions
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">View Submission</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{formatDate(submission.date)}</p>
            <button
              onClick={() => router.push('/admin/submissions')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Submissions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Name</h3>
              <p className="text-lg text-gray-900">{submission.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Email</h3>
              <p className="text-lg text-gray-900">
                <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                  {submission.email}
                </a>
              </p>
            </div>
            {submission.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Phone</h3>
                <p className="text-lg text-gray-900">{submission.phone}</p>
              </div>
            )}
            {submission.organization && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Organization</h3>
                <p className="text-lg text-gray-900">{submission.organization}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Message</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-900 whitespace-pre-wrap">{submission.message}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push(`mailto:${submission.email}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reply via Email
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </Layout>
  );
}