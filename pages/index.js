import Layout from '../components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  
  useEffect(() => {
    // Fetch upcoming events and recent posts
    fetchUpcomingEvents()
    fetchRecentPosts()
  }, [])
  
  const fetchUpcomingEvents = async () => {
    try {
      const res = await fetch('/api/events?limit=3')
      const data = await res.json()
      setUpcomingEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }
  
  const fetchRecentPosts = async () => {
    try {
      const res = await fetch('/api/blog?limit=3')
      const data = await res.json()
      setRecentPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }
  
  return (
    <Layout title="Home">
      {/* Hero Section */}
      <section className="bg-wa-blue text-white py-16">
        <div className="container-wrapper">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Permanent Supportive Housing Advisory Committee
          </h1>
          <p className="text-xl mb-8 max-w-3xl">
            Providing guidance and recommendations to enhance the coordination and availability of permanent supportive housing across Washington State.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="btn-secondary">
              Learn More About PSH
            </Link>
            <Link href="/calendar" className="bg-white text-wa-blue px-6 py-3 rounded-md hover:bg-gray-100 transition-all duration-200 font-medium">
              View Meeting Calendar
            </Link>
          </div>
        </div>
      </section>
      
      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="container-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-wa-blue mb-2">26</div>
              <p className="text-gray-600">Advisory Committee Members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-wa-blue mb-2">122,000</div>
              <p className="text-gray-600">PSH Units Needed by 2045</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-wa-blue mb-2">84,000</div>
              <p className="text-gray-600">Individuals Potentially Eligible</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* What is PSH Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-wrapper">
          <h2 className="text-3xl font-bold text-center mb-8">What is Permanent Supportive Housing?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Permanent supportive housing combines housing and wraparound services for all residents. It is subsidized housing intended for individuals with complex behavioral or physical health conditions currently experiencing or at risk of homelessness.
              </p>
              <p className="mb-6">
                PSH is paired with voluntary services to achieve housing stability, enhance health, and connect residents with community-based services.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-wa-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No limits on length of stay</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-wa-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Lower barriers to entry</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-wa-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Voluntary supportive services</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-wa-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>90-95% housing retention rate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-12 bg-white">
        <div className="container-wrapper">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/calendar" className="text-wa-blue hover:text-wa-green transition-colors">
              View Full Calendar →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="card">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Time:</span> {event.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {event.location}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No upcoming events scheduled. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Recent Blog Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container-wrapper">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Updates</h2>
            <Link href="/blog" className="text-wa-blue hover:text-wa-green transition-colors">
              View All Posts →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <article key={post.id} className="card">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-wa-green transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-wa-blue hover:text-wa-green transition-colors text-sm font-medium">
                    Read More →
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No blog posts yet. Check back soon for updates!
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-wa-blue text-white">
        <div className="container-wrapper text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Get Involved</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share your interest in permanent supportive housing and stay informed about our committee's work.
          </p>
          <Link href="/contact" className="bg-white text-wa-blue px-8 py-4 rounded-md hover:bg-gray-100 transition-all duration-200 font-medium inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  )
}
