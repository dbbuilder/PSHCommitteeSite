import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-wa-dark-gray text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">About PSH Advisory Committee</h3>
            <p className="text-gray-300 text-sm">
              The PSH Advisory Committee provides guidance and recommendations on the administration of permanent supportive housing programs managed by the Washington State Department of Commerce.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-white transition-colors">
                  Resources & Documents
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-300 hover:text-white transition-colors">
                  Meeting Calendar
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Latest News & Updates
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.commerce.wa.gov/permanent-supportive-housing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Commerce PSH Program
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact Information</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>PSH Advisory Committee</p>
              <p>Washington State Department of Commerce</p>
              <p>1011 Plum St. SE</p>
              <p>P.O. Box 42525</p>
              <p>Olympia, WA 98504-2525</p>
              <p className="mt-2">
                Email: <a href="mailto:pshadcom@gmail.com" className="hover:text-white transition-colors">
                  pshadcom@gmail.com
                </a>
              </p>
              <p className="mt-2">
                Phone: <a href="tel:360-725-4000" className="hover:text-white transition-colors">
                  360-725-4000
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-600 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} PSH Advisory Committee. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
