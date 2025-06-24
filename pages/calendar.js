import Layout from '../components/Layout'
import Calendar from 'react-calendar'
import { useState, useEffect } from 'react'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  useEffect(() => {
    fetchEvents()
  }, [])
  
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }
  
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }
  
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date)
      if (dayEvents.length > 0) {
        return <div className="w-2 h-2 bg-wa-blue rounded-full mx-auto mt-1"></div>
      }
    }
    return null
  }
  
  const handleDateChange = (date) => {
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0])
    } else {
      setSelectedEvent(null)
    }
  }
  
  return (
    <Layout title="Meeting Calendar">
      <div className="container mx-auto px-4 py-12">
        <h1>Meeting Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full border-0"
              />
            </div>
            
            {/* Selected Date Events */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Events on {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <div><span className="font-medium">Time:</span> {event.time}</div>
                        <div><span className="font-medium">Location:</span> {event.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events scheduled for this date.</p>
              )}
            </div>
          </div>
          
          {/* Upcoming Events Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="border-b pb-3 last:border-0">
                      <div className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <h4 className="font-medium mt-1">{event.title}</h4>
                      <div className="text-sm text-gray-600 mt-1">{event.time}</div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Meeting Information */}
            <div className="bg-wa-blue text-white rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold mb-3">Regular Meeting Schedule</h3>
              <p className="mb-3">The PSH Advisory Committee meets quarterly.</p>
              <p className="text-sm">All meetings are open to the public and include time for public comment.</p>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-12">
          <h2>PSH Locations Map</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4">View the distribution of Permanent Supportive Housing units across Washington State:</p>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1ctEK4jPkda6gKKqi3FDoSTyGPVUfHBk&hl=en"
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
