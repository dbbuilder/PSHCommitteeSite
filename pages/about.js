import Layout from '../components/Layout'
import Link from 'next/link'

export default function About() {
  return (
    <Layout title="About PSH">
      <div className="container-wrapper py-12">
        <h1>About Permanent Supportive Housing</h1>
        
        {/* Definition Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2>What is Permanent Supportive Housing?</h2>
            <p className="text-lg mb-4">
              Permanent supportive housing (PSH) is subsidized, leased housing with no limit on length of stay that prioritizes people who need comprehensive support services to retain tenancy. PSH utilizes admissions practices designed to use lower barriers to entry than would be typical for other subsidized or unsubsidized rental housing, especially related to rental history, criminal history, and personal behaviors.
            </p>
            <p className="text-lg mb-4">
              PSH is paired with on-site or off-site voluntary services designed to support a person living with a complex and disabling behavioral health or physical health condition who was experiencing homelessness or was at imminent risk of homelessness prior to moving into housing.
            </p>
            <p className="text-lg">
              The goal is to help residents retain their housing, be successful tenants, improve their health status, and connect with community-based health care, treatment, or employment services.
            </p>
          </div>
        </section>
        
        {/* Evidence-Based Practice */}
        <section className="mb-12">
          <h2>Evidence-Based Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3>SAMHSA Evidence-Based Model</h3>
              <p className="mb-4">
                PSH follows the Substance Abuse and Mental Health Services Administration (SAMHSA) evidence-based practice model with seven key principles:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Choice of Housing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Separation of Housing and Services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Decent, Safe, and Affordable Housing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Rights of Tenancy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Access to Housing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-wa-green mr-2">•</span>
                  <span>Flexible, Voluntary Services</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3>Key Outcomes</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-wa-blue">90-95%</div>
                  <p className="text-gray-600">Housing retention rate after one year</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-wa-blue">$16K-$22K</div>
                  <p className="text-gray-600">Annual cost per person housed in PSH</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-wa-blue">$30K-$50K+</div>
                  <p className="text-gray-600">Annual cost per person on the street</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Advisory Committee Section */}
        <section className="mb-12">
          <h2>About the Advisory Committee</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg mb-4">
              The Washington State Permanent Supportive Housing Advisory Committee was established by Chapter 266, Laws of 2022 (SHB 1724) to provide guidance and recommendations on the administration of permanent supportive housing resources managed by the Department of Commerce.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2">Committee Responsibilities:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Meet quarterly</li>
                  <li>• Provide guidance on PSH resource administration</li>
                  <li>• Ensure alignment of capital, services, and operating investments</li>
                  <li>• Report recommendations annually to the Legislature</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Committee Composition:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 26 members representing diverse stakeholders</li>
                  <li>• State agency representatives</li>
                  <li>• PSH developers and operators</li>
                  <li>• Service providers</li>
                  <li>• People with lived experience</li>
                  <li>• Community representatives</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Resources Section */}
        <section>
          <h2>Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/resources" className="card hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Resources & Documents</h3>
              <p className="text-gray-600">Access committee reports, legislation, and educational materials.</p>
            </Link>
            <Link href="/calendar" className="card hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Meeting Calendar</h3>
              <p className="text-gray-600">View upcoming committee meetings and events.</p>
            </Link>
            <Link href="/contact" className="card hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">Get Involved</h3>
              <p className="text-gray-600">Share your interest and connect with the committee.</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
