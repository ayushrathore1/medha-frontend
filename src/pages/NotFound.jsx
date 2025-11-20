import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NotFound = () => (
<<<<<<< HEAD
  <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-14 px-6">
    <Card className="max-w-md w-full text-center">
      <img
        src="https://ik.imagekit.io/ayushrathore1/image.png?updatedAt=1761830272988"
        alt="Not found illustration"
        className="w-52 h-52 mb-6 mx-auto drop-shadow-xl opacity-90 pointer-events-none select-none"
        style={{
          animation: "floatY 3.6s ease-in-out infinite"
        }}
        draggable="false"
      />
      <h1 
        className="text-5xl font-extrabold mb-4 text-center tracking-tight select-none"
        style={{ 
          color: "var(--action-primary)",
          animation: "bounceIn .8s cubic-bezier(.23,1.12,.67,1.01) both"
        }}
      >
        404
      </h1>
      <h2 className="text-2xl font-bold mb-3 text-center" style={{ color: "var(--text-primary)" }}>
        Page Not Found
      </h2>
      <p className="mb-8 text-lg text-center font-medium" style={{ color: "var(--text-secondary)" }}>
=======
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center pt-24 pb-14 px-6 font-inter relative overflow-hidden">
    {/* Animated background blobs */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute -top-16 left-1/4 w-80 h-64 bg-gradient-to-tr from-violet-400/20 to-blue-400/14 rounded-full blur-3xl opacity-25 animate-blob" />
      <div className="absolute bottom-10 right-1/4 w-72 h-44 bg-gradient-to-r from-blue-400/20 to-purple-400/13 rounded-full blur-2xl opacity-20 animate-blob animation-delay-2000" />
      <style>{`
        @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.11) translate(24px,-24px);} 66% {transform: scale(0.93) translate(-20px,17px);} 100% {transform: scale(1) translate(0,0);} }
        .animate-blob { animation: blob 14s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .float-anim { animation: floatY 3.6s ease-in-out infinite; }
        @keyframes floatY {
          0% { transform: translateY(0);}
          50% { transform: translateY(-14px);}
          100% { transform: translateY(0);}
        }
        .animate-bounce-in { animation: bounceIn .8s cubic-bezier(.23,1.12,.67,1.01) both; }
        @keyframes bounceIn {
          0% { opacity: 0; transform: translateY(-80px) scale(0.6);}
          50% { opacity: 1; transform: translateY(10px) scale(1.2);}
          80% { transform: translateY(-5px) scale(0.98);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
    <div className="bg-[#18163a]/90 shadow-2xl border border-violet-400/15 p-10 rounded-3xl flex flex-col items-center max-w-md w-full relative backdrop-blur-2xl z-10">
      <img
        src="https://ik.imagekit.io/ayushrathore1/image.png?updatedAt=1761830272988"
        alt="Not found illustration"
        className="w-52 h-52 mb-6 float-anim drop-shadow-xl opacity-90 pointer-events-none select-none"
        draggable="false"
      />
      <h1 className="text-5xl font-extrabold mb-4 text-center tracking-tight animate-bounce-in bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent select-none">
        404
      </h1>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-violet-400 bg-clip-text text-transparent mb-3 text-center">
        Page Not Found
      </h2>
      <p className="mb-8 text-violet-300 text-lg text-center font-medium">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        Oops! The page you are looking for does not exist.
        <br />
        It might have been moved or never existed.
      </p>
      <Link to="/dashboard">
<<<<<<< HEAD
        <Button size="large">
=======
        <button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.05] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          Back to Dashboard
        </Button>
      </Link>
    </Card>
    
    <style>{`
      @keyframes floatY {
        0% { transform: translateY(0);}
        50% { transform: translateY(-14px);}
        100% { transform: translateY(0);}
      }
      @keyframes bounceIn {
        0% { opacity: 0; transform: translateY(-80px) scale(0.6);}
        50% { opacity: 1; transform: translateY(10px) scale(1.2);}
        80% { transform: translateY(-5px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
    `}</style>
  </div>
);

export default NotFound;
