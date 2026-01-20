import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://sr2mp9qm50.execute-api.ap-south-1.amazonaws.com/dev'; 

// Async Action: Fetch Appointments based on Role and ID
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      // Example call: GET /appointments?role=doctor&userId=123
      const response = await axios.get(`${API_URL}/appointments`, {
        params: { role, userId }
      });
      return response.data; // Expecting an array of appointments
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch appointments');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;