// This file mimics a real API call. 
// Later, we will swap this code with AWS Cognito calls seamlessly.

const TEST_USERS = {
  'admin@doc.com': { password: '123', role: 'admin', name: 'Super Admin', id: 'adm_1' },
  'doctor@doc.com': { password: '123', role: 'doctor', name: 'Dr. Strange', id: 'doc_1' },
  'patient@doc.com': { password: '123', role: 'patient', name: 'John Doe', id: 'pat_1' }
};

export const loginAPI = async (email, password) => {
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = TEST_USERS[email];
      if (user && user.password === password) {
        const { password, ...safeUser } = user;
        resolve(safeUser);
      } else {
        reject("Invalid email or password");
      }
    }, 800);
  });
};