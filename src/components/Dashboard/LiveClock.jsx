import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 mb-2 w-full border-t border-b border-white/10">
      <h3 className="text-lg font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        Current Time (IST)
      </h3>
      <div className="text-4xl font-bold tracking-wider" style={{ color: "var(--action-primary)" }}>
        {time.toLocaleTimeString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
      <div className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
        {time.toLocaleDateString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};

export default LiveClock;
