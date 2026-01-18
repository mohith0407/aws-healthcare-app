import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// --- TEST CREDENTIALS ---
const TEST_USERS = {
  'admin@doc.com': { 
    password: '123', 
    role: 'admin', 
    name: 'Super Admin', 
    id: 'adm_1' 
  },
  'doctor@doc.com': { 
    password: '123', 
    role: 'doctor', 
    name: 'Dr. Strange', 
    specialization: 'Neurologist', 
    id: 'doc_1' 
  },
  'patient@doc.com': { 
    password: '123', 
    role: 'patient', 
    name: 'John Doe', 
    phone: '9876543210', 
    id: 'pat_1' 
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage to persist login on refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(false);

  const login = (email, password) => {
    setLoading(true);
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = TEST_USERS[email];
        
        if (foundUser && foundUser.password === password) {
          const { password, ...safeUser } = foundUser; // Remove password from state
          setUser(safeUser);
          localStorage.setItem('user', JSON.stringify(safeUser));
          resolve({ success: true, role: safeUser.role });
        } else {
          reject({ success: false, message: "Invalid email or password" });
        }
        setLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // We will handle redirect in the UI component
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);