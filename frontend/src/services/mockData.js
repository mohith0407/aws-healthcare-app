export const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    experience: '12 Years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    fee: '$120'
  },
  {
    id: 2,
    name: 'Dr. James Carter',
    specialization: 'Dermatologist',
    experience: '8 Years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    fee: '$90'
  },
  {
    id: 3,
    name: 'Dr. Emily Chen',
    specialization: 'Neurologist',
    experience: '15 Years',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    fee: '$150'
  }
];

// Helper to generate slots (mocking backend availability logic)
export const getAvailableSlots = (doctorId, date) => {
  // In a real app, this fetches from DB based on doctor's schedule
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: Doctor 1 is busy in mornings, etc.
      const slots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM', 
        '02:00 PM', '02:30 PM', '04:00 PM'
      ];
      resolve(slots);
    }, 500); // Simulate network latency
  });
};