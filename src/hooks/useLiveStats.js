import { useEffect, useState } from 'react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

const fallbackStats = {
  studentsOnline: null,
  totalStudents: null,
  topicsAvailable: 250,
};

export function useLiveStats() {
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        // The backend's public endpoint is /api/users/stats and returns { totalUsers }.
        const response = await fetch(`${BACKEND_URL}/api/users/stats`);
        if (!response.ok) return;
        const data = await response.json();
        if (!mounted) return;
        setStats(previous => ({
          ...previous,
          totalStudents: Number.isFinite(Number(data.totalUsers))
            ? Number(data.totalUsers)
            : previous.totalStudents,
          studentsOnline: Number.isFinite(Number(data.studentsOnline))
            ? Number(data.studentsOnline)
            : previous.studentsOnline,
          topicsAvailable: Number.isFinite(Number(data.topicsAvailable))
            ? Number(data.topicsAvailable)
            : previous.topicsAvailable,
        }));
      } catch {
        // Public landing page remains usable when stats are unavailable.
      }
    };

    fetchStats();
    const interval = window.setInterval(fetchStats, 60000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return stats;
}
