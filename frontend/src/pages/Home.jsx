import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Seo from '../components/utils/Seo'; // Import the new SEO component

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic SEO Tags */}
      <Seo 
        title="Home - Book Doctor Appointments" 
        description="Connect with top-rated doctors instantly. Secure, fast, and reliable appointment booking."
      />

      <Navbar />

      <header className="flex-1 flex items-center bg-gradient-to-br from-blue-50 to-white py-12">
        <div className="container-main grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              #1 Trusted Health Platform
            </span>
            <h1 className="leading-tight">
              Your Health, Our Priority. <br />
              <span className="text-primary">Book Appointments</span> with Ease.
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Access top-rated doctors, view real-time availability, and manage your health records securely.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button>Book an Appointment</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="relative">
             {/* PERFORMANCE FIX: Added width, height, and loading="lazy" */}
             <img 
               src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=1000&auto=format&fit=crop" 
               alt="Doctor consulting a patient" 
               width="600"
               height="400"
               loading="lazy" 
               className="rounded-2xl shadow-2xl w-full object-cover h-[400px] bg-gray-200"
             />
             <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="text-sm text-gray-500">Active Doctors</p>
                <p className="text-2xl font-bold text-slate-800">500+</p>
             </div>
          </div>
        </div>
      </header>
      
      {/* ... Rest of the component remains the same ... */}
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-main text-center space-y-12">
          <div>
            <h2 className="mb-4">Why Choose Us?</h2>
            <p className="text-gray-500">Everything you need to manage your health in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Instant Booking", desc: "No more waiting on calls. Book instantly.", icon: "📅" },
              { title: "Secure Records", desc: "Your data is encrypted with AWS standards.", icon: "🔒" },
              { title: "24/7 Support", desc: "Our team is here to help you anytime.", icon: "💬" }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;