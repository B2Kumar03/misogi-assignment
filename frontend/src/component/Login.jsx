import React, { useContext, useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext
  ); // ✅ useContext with AuthContext

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://trip-application-qe9y.onrender.com/api/user/login', form);
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      login(user); // ✅ Update context with user
      toast.success('Login successful');
      const redirectTo = localStorage.getItem("redirectAfterLogin");
    if (redirectTo) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
    } else {
      navigate("/dashboard");
    }
  
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-indigo-100 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={handleChange}
              required
            />
            <span onClick={togglePassword} className="absolute top-3 right-3 text-gray-500 cursor-pointer">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <span className="text-indigo-600 underline cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
