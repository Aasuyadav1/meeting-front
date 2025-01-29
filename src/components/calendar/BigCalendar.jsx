import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from 'axios';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/all/company/event', { withCredentials: true });
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#3182ce',
        borderRadius: '3px',
      }
    };
  };

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 2rem)' }}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
      />

      {/* Event Detail Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {selectedEvent.title}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {format(new Date(selectedEvent.start), 'MMM dd, yyyy HH:mm')} - 
                        {format(new Date(selectedEvent.end), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Candidate</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.candidateDetails.name}</p>
                      <p className="text-sm text-gray-600">{selectedEvent.candidateDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interviewer</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.interviewerDetails.name}</p>
                      <p className="text-sm text-gray-600">{selectedEvent.interviewerDetails.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;