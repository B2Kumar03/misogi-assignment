import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
  const [form, setForm] = useState({
    Trip_name: '',
    start_date: '',
    end_date: '',
    gruop_budget: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { Trip_name, start_date, end_date } = form;
    if (!Trip_name || !start_date || !end_date) {
      toast.error('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized. Please login.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://trip-application-qe9y.onrender.com/api/user/create-trip',
        {
          ...form,
          praticipant: [], // set default or based on current user in backend
          invited_user: [],
          Activites: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Trip created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary">Create a New Trip</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Trip Name */}
        <div>
          <label className="block font-medium mb-1">Trip Name</label>
          <input
            type="text"
            name="Trip_name"
            placeholder="Goa Adventure"
            value={form.Trip_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Group Budget */}
        <div>
          <label className="block font-medium mb-1">Group Budget (Optional)</label>
          <input
            type="number"
            name="gruop_budget"
            value={form.gruop_budget}
            onChange={handleChange}
            placeholder="e.g., 20000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#8883d7] transition duration-300"
        >
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
