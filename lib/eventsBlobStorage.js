import { list, put, del, head } from '@vercel/blob';

// Constants for blob storage
const EVENTS_METADATA_KEY = 'events/metadata.json';

// Default events data
const defaultEvents = [
  {
    "id": "1",
    "title": "PSH Advisory Committee Monthly Meeting",
    "description": "Regular monthly meeting to discuss ongoing initiatives and updates.",
    "date": "2024-02-15",
    "time": "10:00 AM - 12:00 PM",
    "location": "Virtual Meeting",
    "address": "Zoom link will be provided to registered attendees",
    "registrationLink": "",
    "createdAt": "2024-01-15T10:00:00Z"
  }
];

// In-memory fallback when blob storage is not configured
let memoryStore = null;

// Get events metadata from blob storage or memory
export async function getEventsMetadata() {
  try {
    // Check if we have a blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for events, using in-memory storage');
      if (!memoryStore) {
        memoryStore = [...defaultEvents];
      }
      return memoryStore;
    }

    // Try to fetch metadata from blob storage
    const response = await fetch(`https://blob.vercel-storage.com/${EVENTS_METADATA_KEY}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If metadata doesn't exist, create it with default events
      if (response.status === 404) {
        await saveEventsMetadata(defaultEvents);
        return defaultEvents;
      }
      throw new Error(`Failed to fetch events metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata.events || metadata; // Handle both formats
  } catch (error) {
    console.error('Error fetching events metadata:', error);
    // Fall back to memory store
    if (!memoryStore) {
      memoryStore = [...defaultEvents];
    }
    return memoryStore;
  }
}

// Save events metadata to blob storage or memory
export async function saveEventsMetadata(events) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for events, using in-memory storage');
      memoryStore = events;
      return true;
    }

    const blob = await put(EVENTS_METADATA_KEY, JSON.stringify({ events }, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return true;
  } catch (error) {
    console.error('Error saving events metadata:', error);
    // Fall back to memory store
    memoryStore = events;
    return false;
  }
}

// Get all events
export async function getAllEvents() {
  const events = await getEventsMetadata();
  return events;
}

// Get event by ID
export async function getEventById(id) {
  const events = await getEventsMetadata();
  return events.find(event => event.id === id);
}

// Add new event
export async function addEvent(eventData) {
  const events = await getEventsMetadata();
  const newEvent = {
    id: Date.now().toString(),
    ...eventData,
    createdAt: new Date().toISOString(),
  };
  
  events.push(newEvent);
  await saveEventsMetadata(events);
  
  return newEvent;
}

// Update event
export async function updateEvent(id, updates) {
  const events = await getEventsMetadata();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    return null;
  }
  
  events[index] = {
    ...events[index],
    ...updates,
    id: events[index].id,
    createdAt: events[index].createdAt,
  };
  
  await saveEventsMetadata(events);
  return events[index];
}

// Delete event
export async function deleteEvent(id) {
  const events = await getEventsMetadata();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    return false;
  }
  
  events.splice(index, 1);
  await saveEventsMetadata(events);
  
  return true;
}

// Initialize metadata if needed (called on first request)
export async function initializeEventsMetadata() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured for events');
      if (!memoryStore) {
        memoryStore = [...defaultEvents];
      }
      return;
    }

    // Check if metadata exists
    const response = await head(EVENTS_METADATA_KEY).catch(err => null);
    if (!response) {
      // Create initial metadata
      await saveEventsMetadata(defaultEvents);
    }
  } catch (error) {
    // If error, initialize memory store
    if (!memoryStore) {
      memoryStore = [...defaultEvents];
    }
  }
}
