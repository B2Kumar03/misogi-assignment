import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../component/Home";
import Login from "../component/Login";
import Register from "../component/Register";
import Dashboard from "../pages/Dashboard";
import CreateTrip from "../pages/CreateTrip";
import PrivateRoutes from "./PrivateRoutes";
import TripDetails from "../pages/TripDetails";
import ActivityForm from "../component/ActivityForm";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-activity/:tripName/:id" element={<ActivityForm />} />

      <Route
        path="/dashboard/trip/:tripName/:id"
        element={
          <PrivateRoutes>
            <TripDetails />
          </PrivateRoutes>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
      <Route
        path="/create"
        element={
          <PrivateRoutes>
            <CreateTrip />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
}
