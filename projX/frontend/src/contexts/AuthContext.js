import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

const API_URL = "http://localhost:8080/api/v1/auth/login";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartSensesUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrUsername,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Backend login failed with status ${response.status}:`, errorData.error || "Unknown error");
        return false;
      }

      const data = await response.json();

      const userData = {
        id: data.id,
        name: data.name,
        role: data.role,
        email: emailOrUsername,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("smartSensesUser", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return true;
    } catch (err) {
      console.error("Backend login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartSensesUser");
    localStorage.removeItem("token");
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem("smartSensesUser", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
