import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext(undefined);

const USE_DEMO = false;

const API_URL = "http://localhost:8080/api/v1/auth/login";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartSensesUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const mockLogin = (usernameOrEmail, password) => {
    const foundUser = mockUsers.find(
      (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("smartSensesUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const realLogin = async (emailOrUsername, password) => {
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

  const login = async (usernameOrEmail, password) => {
    if (USE_DEMO) {
      return mockLogin(usernameOrEmail, password);
    }

    const backendSuccess = await realLogin(usernameOrEmail, password);
    if (backendSuccess) return true;

    return mockLogin(usernameOrEmail, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartSensesUser");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
