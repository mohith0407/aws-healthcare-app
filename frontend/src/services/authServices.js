import { signIn, signOut, signUp, confirmSignUp, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// 1. Login
export const loginAPI = async (email, password) => {
  try {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    
    // Check if login is successful or if user needs to change password (common for Admins created manually)
    if (isSignedIn) {
      // A. Get Basic ID
      const { userId } = await getCurrentUser();
      
      // B. CRITICAL: Fetch the custom attributes (Role, Name, etc.)
      const attributes = await fetchUserAttributes();
      
      // C. Return clean object for Redux
      return {
        id: userId,
        email: attributes.email,
        name: attributes.name,
        role: attributes['custom:role'] || 'patient', // fallback if missing
        specialization: attributes['custom:specialization'] || null
      };
    } else {
      console.log("Login incomplete. Next step:", nextStep);
      throw new Error("Login incomplete. Please check console.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error.message; 
  }
};

// 2. Logout
export const logoutAPI = async () => {
  try {
    await signOut();
    localStorage.clear();
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// 3. Signup
export const signUpAPI = async (formData) => {
  const { email, password, role, name, phone, specialization } = formData;

  const attributes = {
    email,
    name,
    'custom:role': role,
  };

  // Add role-specific data
  if (role === 'patient') {
    attributes.phone_number = phone.startsWith('+') ? phone : `+91${phone}`; 
  } else if (role === 'doctor') {
    attributes['custom:specialization'] = specialization;
  }

  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: attributes,
      },
    });
    return { isSignUpComplete, userId, nextStep };
  } catch (error) {
    console.error("Signup Error:", error);
    throw error.message;
  }
};

// 4. confirm signup
export const confirmSignUpAPI = async (email, code) => {
  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code
    });
    return isSignUpComplete;
  } catch (error) {
    console.error("Confirmation Error:", error);
    throw error.message;
  }
};