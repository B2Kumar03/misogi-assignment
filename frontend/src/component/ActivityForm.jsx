import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaTags, FaMoneyBill, FaStickyNote } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ['Sightseeing', 'Food', 'Adventure', 'Relaxation', 'Shopping'];

const ActivityForm = () => {
  const { id: tripId, tripName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    category: '',
    cost: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time) {
      toast.error('Please fill in the required fields!');
      return;
    }

    const formDataWithTripId = {
      ...formData,
      vote:[],
    };

    try {
      const res = await axios.post(
        `https://trip-application-qe9y.onrender.com/api/user/add-activities/${tripId}`,
        formDataWithTripId
      );

      toast.success('Activity added!');
      navigate(`/dashboard/trip/${encodeURIComponent(tripName)}/${tripId}`);
    } catch (err) {
      toast.error('Failed to add activity. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center text-blue-600">Add New Activity</h2>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Title *</label>
        <input
          type="text"
          name="title"
          placeholder="E.g., Visit Eiffel Tower"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FaCalendarAlt /> Date *
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Time */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FaClock /> Time *
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FaTags /> Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Estimated Cost */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FaMoneyBill /> Estimated Cost
        </label>
        <input
          type="number"
          name="cost"
          placeholder="Enter cost in INR"
          value={formData.cost}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FaStickyNote /> Notes
        </label>
        <textarea
          name="notes"
          placeholder="Additional notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Add Activity
      </button>
    </form>
  );
};

export default ActivityForm;
