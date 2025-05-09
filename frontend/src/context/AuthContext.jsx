import { createContext, useContext, useState, useEffect } from 'react';

// ✅ 1. Create the context (Fixed typo: `exconst` ➜ `const`)
const AuthContext = createContext();

// ✅ 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participant , setParticipant] = useState({
    tripname:"",
    allParticipants:[],
  });

  useEffect(() => {
    // Check for user data in localStorage (simulate auth persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also remove token on logout
  };

  return (
    <AuthContext.Provider value={{participant,setParticipant, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 3. Custom hook for using auth context
export {AuthContext, AuthProvider};
