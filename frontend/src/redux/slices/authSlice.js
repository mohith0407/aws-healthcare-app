import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from '../../../src/services/authServices';

// 1. Thunk: Handles the async login process
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await loginAPI(email, password);
      // Save to local storage manually here (or use redux-persist later)
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 2. Initial State: Try to load from localStorage first
const userFromStorage = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

const initialState = {
  user: userFromStorage, // Persist login on refresh
  loading: false,
  error: null,
};

// 3. Slice: Manages the state changes
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // Handle the Thunk states (Pending, Fulfilled, Rejected)
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;