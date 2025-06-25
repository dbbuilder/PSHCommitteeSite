import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories from documents
  const categories = ['all', ...new Set(documents.map(doc => doc.category))];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, selectedCategory, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents || []);
        setFilteredDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    setFilteredDocuments(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Reports': '📊',
      'Legislation': '⚖️',
      'Guidelines': '📋',
      'Factsheets': '📄',
      'Governance': '🏛️',
      'Meeting Minutes': '📝',
      'Presentations': '📽️',
      'Policies': '📑',
      'Forms': '📋',
      'Resources': '📚'
    };
    return icons[category] || '📄';
  };

  return (
    <Layout>
      <Head>
        <title>Documents - PSH Advisory Committee</title>
        <meta name="description" content="Access documents, reports, and resources from the Permanent Supportive Housing Advisory Committee" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-wa-blue text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Documents & Resources</h1>
            <p className="text-xl">
              Access reports, guidelines, legislation, and other resources related to Permanent Supportive Housing
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Documents</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wa-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wa-blue"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="spinner"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No documents found matching your filters.' 
                  : 'No documents available at this time.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <span className="mr-2">{getCategoryIcon(doc.category)}</span>
                        {doc.category}
                      </span>
                      <span className="text-sm text-gray-500">{doc.fileSize}</span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {doc.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-gray-500">
                        {formatDate(doc.uploadedAt)}
                      </span>
                      <a
                        href={doc.downloadUrl || `/documents/${doc.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-wa-blue hover:text-wa-green font-medium text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 bg-wa-gray rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About These Documents</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                The Permanent Supportive Housing Advisory Committee provides various documents and resources to support 
                stakeholders, policymakers, and service providers in understanding and implementing permanent supportive 
                housing solutions across Washington State.
              </p>
              <p>
                These documents include legislative materials, implementation guidelines, research reports, and other 
                resources essential for advancing permanent supportive housing initiatives. All documents are available 
                for download in PDF format.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}