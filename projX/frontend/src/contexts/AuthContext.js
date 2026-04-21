import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("smartSensesUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = (username, password) => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("smartSensesUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartSensesUser");
  };
  return <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthProvider,
  useAuth
};
