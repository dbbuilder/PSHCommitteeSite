// Resources and documents page
import Layout from '../components/Layout'
import Link from 'next/link'

const documents = [
  {
    id: 1,
    title: "2023 PSH Advisory Committee Final Report",
    description: "Annual report to the Legislature with recommendations for enhancing permanent supportive housing coordination",
    category: "Reports",
    filename: "Attachment 11_CommerceReports_2023_HD_PSH_Advisory_Committee_Final.pdf",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "PSH 101 Factsheet",
    description: "Overview of Permanent Supportive Housing basics and key information",
    category: "Educational",
    filename: "Attachment 12_PSH 101 Factsheet.pdf",
    size: "1.1 MB"
  },
  {
    id: 3,
    title: "Senate Bill 1724",
    description: "Legislative document establishing the PSH Advisory Committee",
    category: "Legislative",
    filename: "Attachment 1_ 1724-S.sl.pdf",
    size: "892 KB"
  },
  {
    id: 4,
    title: "RCW 36.70A.030 - Definitions",
    description: "Washington State law defining permanent supportive housing",
    category: "Legislative",
    filename: "Attachment 2_RCW 36.70A.030.pdf",
    size: "156 KB"
  },
  {
    id: 5,
    title: "RCW 43.330.425 - Office Duties",
    description: "Legislative requirements for the Office of Apple Health and Homes",
    category: "Legislative",
    filename: "Attachment 3_RCW 43.330.425.pdf",
    size: "212 KB"
  },
  {
    id: 6,
    title: "Implementing Housing First in Permanent Supportive Housing",
    description: "Best practices guide for implementing Housing First principles",
    category: "Educational",
    filename: "Attachment 4_Implementing_Housing_First_in_Permanent_Supportive_Housing.pdf",
    size: "3.7 MB"
  },
  {
    id: 7,
    title: "All-In Report - Page 45",
    description: "Excerpt from comprehensive housing strategy report",
    category: "Reports",
    filename: "Attachment 5_All-in pg. 45.pdf",
    size: "456 KB"
  },
  {
    id: 8,
    title: "PSH Advisory Committee By-Laws",
    description: "Official by-laws governing the committee's operations",
    category: "Governance",
    filename: "Attachment 7_ PSH By-Laws- FINAL (1).pdf",
    size: "789 KB"
  }
]

export default function Resources() {
  const categories = [...new Set(documents.map(doc => doc.category))]
  
  return (
    <Layout title="Resources & Documents">
      {/* Hero Section */}
      <div className="bg-wa-blue text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">Resources & Documents</h1>
          <p className="text-xl mt-4 text-gray-100">
            Access committee reports, educational materials, and legislative documents
          </p>
        </div>
      </div>
      {/* Document Library */}
      <div className="container mx-auto px-4 py-12">
        {/* Audio Overview Section */}
        <div className="bg-wa-green text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Audio Overview Available</h2>
          <p className="mb-6">
            Listen to an AI-generated audio overview of our key documents and committee work, 
            created using Google's NotebookLM technology.
          </p>
          <a
            href="https://notebooklm.google.com/notebook/d3cc0711-1475-4010-978d-04fed58fd324/audio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-wa-green px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Listen to Audio Overview
          </a>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-wa-blue text-white rounded-md hover:bg-opacity-90">
              All Documents
            </button>
            {categories.map(category => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-2">
                    {doc.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                </div>
                <svg className="w-8 h-8 text-red-500 flex-shrink-0 ml-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {doc.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{doc.size}</span>
                <a
                  href={`/documents/${doc.filename}`}
                  download
                  className="inline-flex items-center text-wa-blue hover:text-wa-green font-medium text-sm"
                >
                  Download
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">External Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.commerce.wa.gov/permanent-supportive-housing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wa-blue hover:text-wa-green flex items-center"
                  >
                    Permanent Supportive Housing Advisory Committee – Washington State Department of Commerce
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.commerce.wa.gov/building-infrastructure/housing/office-of-apple-health-and-homes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wa-blue hover:text-wa-green flex items-center"
                  >
                    Office of Apple Health and Homes
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you need assistance accessing these documents or require them in an alternative format, 
                please contact us.
              </p>
              <Link href="/contact" className="text-wa-blue hover:text-wa-green font-medium">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}