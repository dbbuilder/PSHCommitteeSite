import Layout from '../components/Layout'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (res.ok) {
        setSubmitMessage('Thank you for your message. We will get back to you soon!')
        reset()
      } else {
        setSubmitMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Layout title="Contact">
      <div className="container mx-auto px-4 py-12">
        <h1>Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Share Your Interest</h2>
              <p className="mb-6 text-gray-600">
                We welcome your input on permanent supportive housing. Please share your thoughts, questions, or interest in getting involved.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wa-blue focus:border-wa-blue"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wa-blue focus:border-wa-blue"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                {/* Organization Field */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    {...register('organization')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wa-blue focus:border-wa-blue"
                  />
                </div>
                
                {/* Interest Area */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                    Area of Interest
                  </label>
                  <select
                    id="interest"
                    {...register('interest')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wa-blue focus:border-wa-blue"
                  >
                    <option value="">Select an area</option>
                    <option value="general">General Information</option>
                    <option value="development">PSH Development</option>
                    <option value="services">Support Services</option>
                    <option value="advocacy">Advocacy</option>
                    <option value="research">Research</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                  </select>
                </div>
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wa-blue focus:border-wa-blue"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
                
                {/* Honeypot field for spam protection */}
                <div className="hidden">
                  <input
                    type="text"
                    {...register('honeypot')}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-md ${
                    submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Office of Apple Health and Homes</h3>
                  <p className="text-gray-600">Permanent Supportive Housing</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Mailing Address:</h4>
                  <p className="text-gray-600">
                    PSH Advisory Committee<br />
                    c/o Washington State Department of Commerce<br />
                    1011 Plum St. SE<br />
                    P.O. Box 42525<br />
                    Olympia, WA 98504-2525
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Email:</h4>
                  <p className="text-gray-600">
                    <a href="mailto:pshadcom@gmail.com" className="text-wa-blue hover:text-wa-green">
                      pshadcom@gmail.com
                    </a>
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Website:</h4>
                  <p className="text-gray-600">
                    <a 
                      href="https://www.commerce.wa.gov/permanent-supportive-housing/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wa-blue hover:text-wa-green"
                    >
                      Permanent Supportive Housing Advisory Committee – Washington State Department of Commerce
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Resources */}
            <div className="bg-wa-gray rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/resources" className="text-wa-blue hover:text-wa-green flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4z" clipRule="evenodd" />
                    </svg>
                    Committee Documents & Reports
                  </a>
                </li>
                <li>
                  <a href="/calendar" className="text-wa-blue hover:text-wa-green flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" clipRule="evenodd" />
                    </svg>
                    Upcoming Events & Meetings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}