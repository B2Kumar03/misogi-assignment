import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, login, logout, loading } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "Alice", text: "Hey team, when should we go?" },
    { sender: "You", text: "Let's plan for next weekend!" },
    { sender: "Bob", text: "Perfect. I’m in!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const menuRef = useRef();
  const { participant, setParticipant } = useContext(AuthContext);

  console.log(participant.tripname);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `px-3 py-1 rounded-md transition font-medium ${
      isActive(path)
        ? "bg-[#4F46E5] text-[#F3F4F6] shadow-md scale-105"
        : "text-gray-700 hover:text-[#4F46E5] hover:scale-105"
    }`;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(
            "https://trip-application-qe9y.onrender.com/api/user/get-user",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          login(res.data.user);
        } catch (err) {
          console.error("User fetch failed:", err);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchParticipantCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://trip-application-qe9y.onrender.com/api/trip/participants",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParticipantCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch participant count:", err);
      }
    };

    if (user) fetchParticipantCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setShowMenu(false);
    window.location.reload();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: "You", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20 md:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <FaPlaneDeparture className="text-[#4F46E5] text-xl" />
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-wide text-[#4F46E5]"
              >
                Planit
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link to="/dashboard" className={linkClasses("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/create" className={linkClasses("/create")}>
                Create Trip
              </Link>
            </div>

            {/* Desktop Auth/Profile */}
            <div
              className="hidden md:flex space-x-4 items-center relative"
              ref={menuRef}
            >
              {!loading && user ? (
                <>
                 <button
  onClick={() => setShowChat(true)}
  className="text-indigo-700 hover:text-indigo-900 px-4 py-2 font-medium transition duration-200"
>
  {
    participant.tripname
      ? <div className="flex flex-col items-start leading-tight hover:border-2 hover:border-indigo-600 hover:bg-indigo-100 rounded-lg p-2">
    <span className="text-base font-semibold">{participant.tripname}</span>
    <span className="text-sm text-gray-500 underline">See Group Decision</span>
  </div>
      : ""
  }
</button>


                  <div
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="bg-indigo-600 cursor-pointer font-semibold rounded-full w-10 h-10 flex items-center justify-center text-lg text-white"
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </div>

                  {showMenu && (
                    <div className="absolute right-0 top-12 bg-white border shadow-lg rounded-md p-4 w-60 z-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Trip Participants:{" "}
                        <span className="font-medium">{participantCount}</span>
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 border border-[#4F46E5] rounded-xl transition ${
                      isActive("/login")
                        ? "bg-[#4F46E5] text-white"
                        : "text-[#4F46E5] hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-xl transition ${
                      isActive("/register")
                        ? "bg-indigo-600 text-white"
                        : "bg-[#4F46E5] text-white hover:bg-indigo-600"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-gray-800 text-2xl hover:text-[#4F46E5] transition"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                <FiMenu />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenu && (
            <div className="md:hidden flex flex-col mt-2 space-y-2">
              <Link to="/dashboard" className={linkClasses("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/create" className={linkClasses("/create")}>
                Create Trip
              </Link>
              {user && (
                <>
                  <button
                    onClick={() => {
                      setShowChat(true);
                      setMobileMenu(false);
                    }}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg"
                  >
                    <span>{participant.tripname}</span>
                    <br />
                    See Group Decision
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed right-0 top-0 w-full md:w-[400px] h-full bg-white shadow-lg z-[100] border-l flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-indigo-600">
              Group Chat
            </h2>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-600 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[70%] ${
                  msg.sender === "You"
                    ? "ml-auto bg-indigo-100 text-right"
                    : "mr-auto bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {msg.sender}
                </p>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-[#4F46E5] text-white px-4 py-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
