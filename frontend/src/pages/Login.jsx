import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'; 
// --- V6 CHANGE ---
import { signInWithRedirect, signOut } from 'aws-amplify/auth'; 
// -----------------

import InputGroup from '../components/atoms/InputGroup';
import Button from '../components/atoms/Button';
import Navbar from '../components/organisms/Navbar';
import Seo from '../components/utils/Seo';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Regular Email/Password Login (Handled by your Redux)
    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
                {error}
              </div>
            )}
            
            <InputGroup label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <div>
              <InputGroup 
                label="Password" 
                name="password" 
                
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
             
              <div className="flex items-center mt-2">
                <input
                  id="show-password"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="show-password" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                  Show Password
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* --- GOOGLE BUTTON SECTION --- */}
            {/* <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative z-10 bg-white px-2 text-gray-500 text-sm">
                  Or continue with
                </div>
            </div>
            
            <GoogleButton /> */}
            {/* ----------------------------- */}

          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-sky-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- UPDATED V6 GOOGLE BUTTON ---
export const GoogleButton = () => {
  const handleGoogleLogin = async () => {
    try {
      await signOut();
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <button 
      type="button" // Prevent form submission
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full p-2 border border-gray-300 rounded hover:bg-gray-50 transition"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="G" 
        className="w-5 h-5 mr-2"
      />
      Sign in with Google
    </button>
  );
};

export default Login;