import { createContext, useContext, useEffect, useState } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [machinesStats, setMachinesStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [machinesRes, problemsRes, requestsRes] = await Promise.all([
        fetch("http://localhost:8080/api/v1/machines/stats/dashboard"),
        fetch("http://localhost:8080/api/v1/problems"),
        fetch("http://localhost:8080/api/v1/assistance-requests")
      ]);

      const machinesData = await machinesRes.json();
      const problemsData = await problemsRes.json();
      const requestsData = await requestsRes.json();

      setMachinesStats(machinesData);
      setProblems(problemsData);
      setAssistanceRequests(requestsData);

    } catch (error) {
      console.error("Error updatingdashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        machinesStats,
        problems,
        assistanceRequests
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
