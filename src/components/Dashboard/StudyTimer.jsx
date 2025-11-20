import React, { useState, useEffect, useRef } from 'react';
import Button from '../Common/Button';

const StudyTimer = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const getSeconds = `0${(seconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <h3 className="text-lg font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
        Study Session Timer
      </h3>
      
      <div className="text-4xl font-mono font-bold mb-8 tracking-wider whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
        {formatTime(time)}
      </div>
      
      <div className="flex gap-4">
        {!isActive && !isPaused ? (
          <Button onClick={handleStart} variant="primary" className="px-8">
            Start Session
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button onClick={handleResume} variant="primary" className="px-6">
                Resume
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary" className="px-6">
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="danger" className="px-6" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
