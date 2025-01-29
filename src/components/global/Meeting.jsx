import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MeetingTable = () => {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    candidateDetails: {
      name: '',
      email: ''
    },
    interviewerDetails: {
      name: '',
      email: ''
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/all/company/event');
      setMeetings(response.data);
    } catch (error) {
      setError('Failed to fetch meetings');
    }
  };

  const validateForm = () => {
    const currentDate = new Date();
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (startDate < currentDate) {
      setError("Cannot schedule meetings in the past");
      return false;
    }

    if (endDate <= startDate) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await axios.put(`/api/update/event/${editingId}`, formData);
      } else {
        await axios.post('/api/create/event', formData);
      }
      
      fetchMeetings();
      setFormData({
        title: '',
        start: '',
        end: '',
        candidateDetails: {
          name: '',
          email: ''
        },
        interviewerDetails: {
          name: '',
          email: ''
        }
      });
      setEditingId(null);
      setIsModalOpen(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save meeting');
    }
  };

  const handleEdit = (meeting) => {
    setEditingId(meeting._id);
    setFormData({
      title: meeting.title,
      start: format(new Date(meeting.start), "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(meeting.end), "yyyy-MM-dd'T'HH:mm"),
      candidateDetails: meeting.candidateDetails,
      interviewerDetails: meeting.interviewerDetails
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete/event/${id}`);
      fetchMeetings();
    } catch (error) {
      setError('Failed to delete meeting');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Meeting Schedule</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Schedule Meeting
        </button>
      </div>

      {/* Meeting Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {meetings.map((meeting) => (
              <tr key={meeting._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meeting.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(meeting.start), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(meeting.end), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{meeting.candidateDetails.name}</div>
                    <div className="text-gray-500">{meeting.candidateDetails.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{meeting.interviewerDetails.name}</div>
                    <div className="text-gray-500">{meeting.interviewerDetails.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(meeting)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(meeting._id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-2 text-red-500 bg-red-100 rounded">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.start}
                      onChange={(e) => setFormData({...formData, start: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.end}
                      onChange={(e) => setFormData({...formData, end: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Candidate Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={formData.candidateDetails.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            candidateDetails: {...formData.candidateDetails, name: e.target.value}
                          })}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.candidateDetails.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            candidateDetails: {...formData.candidateDetails, email: e.target.value}
                          })}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Interviewer Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={formData.interviewerDetails.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            interviewerDetails: {...formData.interviewerDetails, name: e.target.value}
                          })}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.interviewerDetails.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            interviewerDetails: {...formData.interviewerDetails, email: e.target.value}
                          })}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      {editingId ? 'Update Meeting' : 'Create Meeting'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingTable;