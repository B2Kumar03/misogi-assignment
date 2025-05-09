import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

    console.log(form);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://trip-application-qe9y.onrender.com/api/user/register', form);

      if (response.status === 201 || response.data.success) {
        toast.success('Register successfully!');
        navigate('/login');
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {

      const msg = error.response?.data?.message || 'Registration failed';
      
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Your Name"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <span onClick={togglePassword} className="absolute top-3 right-3 text-gray-500 cursor-pointer">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <span className="text-blue-600 underline cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};




export default Register;
