import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data for demonstration
  const mockUsers = [
    {
      id: '1',
      email: 'admin@kiit.ac.in',
      name: 'Admin User',
      role: 'admin',
      studentId: 'ADMIN001',
      phone: '+91 9876543210'
    },
    {
      id: '2',
      email: 'student@kiit.ac.in',
      name: 'John Doe',
      role: 'student',
      studentId: 'KIIT2024001',
      phone: '+91 9876543211'
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      // In a real app, you'd verify the password here
      if (password.length < 6) {
        throw new Error('Invalid password');
      }
      
      const userData = { ...foundUser };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: 'student'
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};