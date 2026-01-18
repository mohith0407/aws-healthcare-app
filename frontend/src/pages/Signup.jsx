import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import InputGroup from '../components/atoms/InputGroup';
import SelectGroup from '../components/atoms/SelectGroup'; // New Component
import Button from '../components/atoms/Button';
import Navbar from '../components/organisms/Navbar';
import Seo from '../components/utils/Seo';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Default role from URL (e.g., /signup?role=doctor) or default to patient
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',        // Patient Specific
    specialization: '' // Doctor Specific
  });

  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 
    'Pediatrician', 'General Physician', 'Orthopedic'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(`Signing up as ${role}:`, formData);
    // TODO: Connect to API
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Seo title="Create Account" description="Join DocAppoint today." />
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us as a {role}</p>
          </div>

          {/* Role Toggle for Signup (Only Patient/Doctor) */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'patient' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'doctor' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
              }`}
            >
              Doctor
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            {/* Common Fields */}
            <InputGroup 
              label="Full Name" name="fullName" placeholder="John Doe" 
              value={formData.fullName} onChange={handleChange} required 
            />
            
            <InputGroup 
              label="Email" name="email" type="email" placeholder="john@example.com" 
              value={formData.email} onChange={handleChange} required 
            />

            {/* CONDITIONAL FIELDS */}
            {role === 'patient' && (
               <InputGroup 
                 label="Phone Number" name="phone" type="tel" placeholder="+1 234 567 890" 
                 value={formData.phone} onChange={handleChange} required 
               />
            )}

            {role === 'doctor' && (
              <SelectGroup 
                label="Specialization" 
                name="specialization"
                options={specializations}
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup 
                label="Password" name="password" type="password" placeholder="••••••" 
                value={formData.password} onChange={handleChange} required 
              />
              <InputGroup 
                label="Confirm" name="confirmPassword" type="password" placeholder="••••••" 
                value={formData.confirmPassword} onChange={handleChange} required 
              />
            </div>

            <Button type="submit" className="w-full">Sign Up</Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-sky-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;