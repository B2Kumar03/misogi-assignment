import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("https://trip-application-qe9y.onrender.com/api/user/get-trip", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const filteredTrips = res.data.filter(trip =>
          trip.invited_user.includes(user?.email) ||
          trip.praticipant.includes(user?.email)
        );

        setTrips(filteredTrips);
      } catch (err) {
        console.error("Error fetching trips:", err);
        toast.error("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Trips</h1>

      {loading ? (
        <p className="text-gray-600">Loading your trips...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {trip.Trip_name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {trip.start_date} - {trip.end_date}
              </p>

              <div className="flex justify-between items-center">
                <Link
                  to={`trip/${trip.Trip_name}/${trip._id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View Plan
                </Link>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  {trip.Activites.length} Activities
                </span>
              </div>
            </div>
          ))}

          {/* Add New Trip Card */}
          <Link
            to="/create"
            className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl h-40 hover:bg-gray-200 transition-all"
          >
            <span className="text-gray-600 font-medium">+ Create New Trip</span>
          </Link>
        </div>
      )}
    </div>
  );
}
