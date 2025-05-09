// createTrip.controller.js
import TripCreationForm from "../models/TripCreationForm.model.js";
import User from "../models/user.model.js";
import Activities from "../models/Activities.model.js"; // Assuming you have an Activities model
import jwt from "jsonwebtoken";

const createTrip = async (req, res) => {
  const { Trip_name, start_date, end_date, group_budget, invited_user, activities } = req.body;

  try {
    // Check if the authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Create the trip
    const tripCreationForm = new TripCreationForm({
      Trip_name,
      start_date,
      end_date,
      group_budget,
      praticipant: [user.username], // Add the current user as the first participant
      invited_user:[user.email],
      activities,
    });

    await tripCreationForm.save();

    return res.status(201).json({
      message: "Trip created successfully",
      trip: tripCreationForm,
    });
  } catch (error) {
    console.error("Trip creation error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//write add activities controller

// TripCreationForm model should have a field for invited_user comming email and trip_id in body

const inviteUpdate=async (req,res)=>{
  const { tripId, email } = req.body;
  try {
    // Find the trip by ID
    const trip = await TripCreationForm.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Add the email to the invited_user array
    trip.invited_user.push(email);
    await trip.save();

    return res.status(200).json({
      message: "User invited successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Error inviting user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}



//update participant 

const updateParticipant = async (req, res) => {
  const { invited_user, tripId } = req.body;

  try {
    // Step 1: Find the trip by ID
    const trip = await TripCreationForm.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Step 2: Find users based on invited emails
    const users = await User.find({ email: { $in: invited_user } });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No matching users found" });
    }

    // Step 3: Extract usernames and remove duplicates
    const userNames = users.map(user => user.username);
    const existingParticipants = new Set(trip.praticipant);
    const newParticipants = userNames.filter(name => !existingParticipants.has(name));

    // Step 4: Update trip participants
    trip.praticipant.push(...newParticipants);
    await trip.save();

    return res.status(200).json({
      message: "Users invited successfully",
      trip,
    });

  } catch (error) {
    console.error("Error inviting users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};














const addActivities = async (req, res) => {
  try {
    // Get trip ID from route params
    const tripId = req.params.id;

    // Validate the trip ID
    const trip = await TripCreationForm.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Add the activity to the trip
    trip.Activites.push(req.body);
    await trip.save();

    return res.status(200).json({
      message: "Activity added successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Activity addition error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//get all trip

const getAllTrips = async (req, res) => {
  try {
    const trips = await TripCreationForm.find();
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await TripCreationForm.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};







export { createTrip, addActivities,getAllTrips,getSingleTrip,inviteUpdate,updateParticipant }; // Export the createTrip;
