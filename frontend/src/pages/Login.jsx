import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputGroup from '../components/atoms/InputGroup';
import Button from '../components/atoms/Button';
import Navbar from '../components/organisms/Navbar';
import Seo from '../components/utils/Seo';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  // State for Role Selection (Default to Patient)
  const [role, setRole] = useState('patient');
  
  // Form State
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(`Logging in as ${role}:`, formData);
    // TODO: Connect to AuthContext/Backend API
    // navigate('/dashboard'); 
    try {
    const { role: userRole } = await login(formData.email, formData.password);
    
    // Redirect based on role
    if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'doctor') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
    
  } catch (error) {
    alert(error.message); // Simple alert for now
  }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="Login" description="Login to your DocAppoint account." />
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          {/* Role Toggles - Polymorphic UI */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['patient', 'doctor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                  role === r 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <InputGroup 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            
            <InputGroup 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />

            <Button type="submit" className="w-full">
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </form>

          {role !== 'admin' && (
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className="font-medium text-primary hover:text-sky-600">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;