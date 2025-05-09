import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/travel.json";

export default function Home() {
  const navigate = useNavigate();
  const True = localStorage.getItem("token");
  

  return (
    <section className="md:h-[calc(100vh-4rem)] h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-[#EEF2FF] to-[#F3F4F6] flex flex-col md:flex-row items-center justify-center p-6">
      {/* Left Content */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Plan Your Dream Trip <br />
          with <span className="text-primary">Planit ✈</span>
        </h1>
        <p className="text-lg text-gray-600">
          Collaborate, explore, and organize your journeys effortlessly.
        </p>
        {True?<button
          onClick={() => navigate("/create")}
          className="mt-4 px-6 py-3 bg-[#4F46E5] text-white rounded-xl text-lg font-semibold hover:bg-indigo-500 transition"
        >
          Create Trip
        </button>:
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-6 py-3 bg-[#4F46E5] text-white rounded-xl text-lg font-semibold hover:bg-indigo-500 transition"
        >
          Get Started
        </button>}
      </div>

      {/* Right Animation */}
      <div className="flex-1 mt-10 md:mt-0">
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </section>
  );
}