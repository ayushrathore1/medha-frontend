import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center pt-24 pb-14 px-6">
    <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-10 flex flex-col items-center max-w-md w-full">
      <img
        src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
        alt="Not found illustration"
        className="w-52 h-52 mb-8 drop-shadow-xl opacity-90"
        draggable="false"
      />
      <h1 className="text-5xl font-extrabold text-blue-700 mb-4 text-center tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-bold text-blue-600 mb-3 text-center">
        Page Not Found
      </h2>
      <p className="mb-8 text-blue-900 text-lg text-center">
        Oops! The page you are looking for does not exist.
        <br />
        It might have been moved or never existed.
      </p>
      <Link to="/dashboard">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition">
          Back to Dashboard
        </button>
      </Link>
    </div>
  </div>
);

export default NotFound;
