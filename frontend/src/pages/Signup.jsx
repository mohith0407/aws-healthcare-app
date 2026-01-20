import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import InputGroup from '../components/atoms/InputGroup';
import SelectGroup from '../../src/components/atoms/SelectGroup'; 
import Button from '../../src/components/atoms/Button';
import Navbar from '../../src/components/organisms/Navbar';
import Seo from '../components/utils/Seo';
import { signUpAPI, confirmSignUpAPI } from '../services/authServices';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for Flow Control
  const [step, setStep] = useState(1); // 1 = Signup Form, 2 = OTP Verification
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Role Logic
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState(initialRole);

  // Form Data
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', specialization: ''
  });
  const [otp, setOtp] = useState(''); // Store the verification code

  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 
    'Pediatrician', 'General Physician', 'Orthopedic'
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- HANDLER 1: SIGN UP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if(formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // Call AWS Cognito
      await signUpAPI({ ...formData, role });
      // If successful, move to Step 2 (OTP)
      setStep(2); 
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER 2: VERIFY OTP ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await confirmSignUpAPI(formData.email, otp);
      alert("Account verified! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="Create Account" description="Join DocAppoint today." />
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 ? `Join us as a ${role}` : `Enter the code sent to ${formData.email}`}
            </p>
          </div>

          {/* Show Error if any */}
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

          {/* --- STEP 1: SIGNUP FORM --- */}
          {step === 1 && (
            <>
              {/* Role Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {['patient', 'doctor'].map((r) => (
                  <button
                    key={r} onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                      role === r ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSignup}>
                <InputGroup label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                <InputGroup label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                
                {role === 'patient' && (
                   <InputGroup label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
                )}

                {role === 'doctor' && (
                  <SelectGroup label="Specialization" name="specialization" options={specializations} value={formData.specialization} onChange={handleChange} required />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                  <InputGroup label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </>
          )}

          {/* --- STEP 2: OTP VERIFICATION FORM --- */}
          {step === 2 && (
            <form className="mt-8 space-y-5" onSubmit={handleVerify}>
              <InputGroup 
                label="Verification Code" 
                name="otp" 
                placeholder="123456" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Account'}
              </Button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                Incorrect email? Go Back
              </button>
            </form>
          )}

          {step === 1 && (
            <p className="text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-medium text-primary hover:text-sky-600">Log in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;