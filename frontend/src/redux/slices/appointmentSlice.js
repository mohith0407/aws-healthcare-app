import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://sr2mp9qm50.execute-api.ap-south-1.amazonaws.com/dev'; 

// 1. Fetch Appointments (For Patient History & Doctor Dashboard)
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        params: { role, userId } // Sends ?role=doctor&userId=123
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch appointments');
    }
  }
);

// 2. Fetch Available Slots (For Booking Form)
export const fetchSlots = createAsyncThunk(
  'appointments/fetchSlots',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/slots`, {
        params: { doctorId, date }
      });
      return response.data; // Returns array of time strings
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch slots');
    }
  }
);

// 3. Book Appointment (New!)
export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData);
      return response.data; // Returns the created appointment object
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Booking failed');
    }
  }
);

// 4. Update Status (For Doctor Dashboard - Accept/Reschedule)
export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { status });
      return { id, status }; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [],         // All appointments
    slots: [],        // Available slots for selected doctor/date
    loading: false,   // General loading state
    bookingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Helper to reset booking state after successful popup
    resetBookingStatus: (state) => {
      state.bookingStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Appointments ---
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
      })

      // --- Fetch Slots ---
      .addCase(fetchSlots.pending, (state) => {
        // We don't necessarily need global loading for slots, but we can clear previous slots
        state.slots = []; 
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
      })

      // --- Book Appointment ---
      .addCase(bookAppointment.pending, (state) => {
        state.bookingStatus = 'loading';
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookingStatus = 'succeeded';
        // Optimistically add to list if we are viewing a list
        state.list.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingStatus = 'failed';
        state.error = action.payload;
      })

      // --- Update Status ---
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(appt => appt.id === action.payload.id);
        if (index !== -1) {
          state.list[index].status = action.payload.status;
        }
      });
  },
});

export const { resetBookingStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;