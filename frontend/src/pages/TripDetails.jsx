import React, { useState, useEffect, useContext } from "react";
import { MdClose } from "react-icons/md";
import { redirectDocument, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TripDetails = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [activities, setActivities] = useState([]);
  const [trip, setTrip] = useState({});
  const [loading, setLoading] = useState(true);
  const [reqest, setRequest] = useState(false);

  const {participant,setParticipant}=useContext(AuthContext) 



   const tripIdOBJ = useParams();
  const tripId = tripIdOBJ.id;

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const currentUser = JSON.parse(storedUser).email;

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`https://trip-application-qe9y.onrender.com/api/user/get-single-trip/${tripId}`);
        const data = await response.json();

        if (data) {
          setTrip(data);
          setActivities(data.Activites || []);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    const invited_user = trip.invited_user;

    if (invited_user && invited_user.length > 0) {
      const updateParticipants = async () => {
        try {
          const response = await fetch("https://trip-application-qe9y.onrender.com/api/user/update-participant", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invited_user, tripId }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error("Failed to update participants:", result.message);
          } else {
            console.log("Participants updated successfully.");
          }
        } catch (error) {
          console.error("Error updating participants:", error);
        }
      };
      updateParticipants();
    }
  }, [trip.invited_user, tripId]);

  useEffect(() => {
    setParticipant((prev)=>{
      return {
        ...prev,
        tripname:trip.Trip_name,
        allParticipants:trip.praticipant,
      }
    })
     return () => {
      setParticipant((prev)=>{
        return {
          ...prev,
          tripname:"",
          allParticipants:[],
        }
      })
    }
    
  },[trip])


  const handleVote = (index) => {
    const updatedActivities = [...activities];
    const activity = updatedActivities[index];

    if (!activity.vote.includes(currentUser)) {
      activity.vote.push(currentUser);
      setActivities(updatedActivities);
    } else {
      alert("You have already voted for this activity.");
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const inviteURL = window.location.href;

    try {
      // Step 1: Add to invited_user in trip
      const updateTripResponse = await fetch("https://trip-application-qe9y.onrender.com/api/user/update-trip", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          tripId: tripId,
        }),
      });

      const updateTripResult = await updateTripResponse.json();

      if (!updateTripResponse.ok) {
        return alert(`Failed to update trip: ${updateTripResult.message || "Unknown error"}`);
      }

      // Step 2: Send invitation email
      const inviteResponse = await fetch("https://trip-application-qe9y.onrender.com/api/user/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          url: inviteURL,
        }),
      });

      const inviteResult = await inviteResponse.json();
      

      if (inviteResponse.ok) {
        alert(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        setIsInviteOpen(false);
      } else {
        alert(`Failed to send invite: ${inviteResult.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Something went wrong while sending the invite.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-full relative">
      <h2 className="text-2xl font-bold text-primary mb-4">{trip.Trip_name}</h2>
      <p className="text-gray-700 mb-2"><strong>Dates:</strong> {trip.start_date} - {trip.end_date}</p>
      <p className="text-gray-700 mb-2"><strong>Budget:</strong> ₹{trip.gruop_budget}</p>
      <p className="text-gray-700 mb-4"><strong>Description:</strong> {trip.description || "No description provided."}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Activities</h3>
          {activities.length === 0 ? (
            <p className="text-gray-500 italic">No activities yet</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-blue-700">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {activity.date} at {activity.time} — <span className="italic">{activity.category}</span>
                  </p>
                  <p className="text-sm text-gray-600">Cost: ₹{activity.cost}</p>
                  <p className="text-sm text-gray-500">{activity.notes}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-700">Votes: {activity.vote.length}</p>
                    <button
                      onClick={() => handleVote(index)}
                      disabled={activity.vote.includes(currentUser)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activity.vote.includes(currentUser)
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                      }`}
                    >
                      {activity.vote.includes(currentUser) ? "Voted" : "Vote"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Participants</h3>
          {trip.praticipant.length === 0 ? (
            <p className="text-gray-500 italic">No participants yet</p>
          ) : (
            <ul className="space-y-1 list-disc list-inside text-gray-700">
              {trip.praticipant.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => navigate(`/add-activity/${tripIdOBJ.tripName}/${tripIdOBJ.id}`)}
          className="px-4 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#7cc3ab]"
        >
          Add Activity
        </button>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-[#7572b1]"
        >
          Invite Friends
        </button>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <MdClose size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Invite a Friend</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Friend's Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send Invite
                </button>
              </div>
            </form>
            <p className="text-sm text-gray-600 mt-4">
              Invite URL:{" "}
              <span className="text-blue-600 break-all">{window.location.href}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
