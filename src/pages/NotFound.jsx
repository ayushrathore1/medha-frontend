import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NotFound = () => (
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
        Oops! The page you are looking for does not exist.
        <br />
        It might have been moved or never existed.
      </p>
      <Link to="/dashboard">
        <Button size="large">
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
