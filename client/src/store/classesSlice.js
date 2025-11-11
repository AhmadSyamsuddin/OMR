import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchClasses = createAsyncThunk(
  "classes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/workout-classes");
      return data.classes || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const bookClass = createAsyncThunk(
  "classes/book",
  async (classId, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.post(`/workout-classes/${classId}`);
      
      // Re-fetch classes to update currentQuota
      dispatch(fetchClasses());
      
      return { classId, data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      return rejectWithValue(errorMsg);
    }
  }
);

const classesSlice = createSlice({
  name: "classes",
  initialState: {
    items: [],
    loading: false,
    bookingLoading: false,
    error: null,
    bookingSuccess: false,
  },
  reducers: {
    clearBookingSuccess(state) {
      state.bookingSuccess = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchClasses.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchClasses.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(bookClass.pending, (s) => {
        s.bookingLoading = true;
        s.error = null;
        s.bookingSuccess = false;
      })
      .addCase(bookClass.fulfilled, (s, a) => {
        s.bookingLoading = false;
        s.bookingSuccess = true;
        // Update currentQuota locally
        const classIndex = s.items.findIndex(c => c.id === a.payload.classId);
        if (classIndex !== -1 && s.items[classIndex].currentQuota < s.items[classIndex].quota) {
          s.items[classIndex].currentQuota += 1;
        }
      })
      .addCase(bookClass.rejected, (s, a) => {
        s.bookingLoading = false;
        s.error = a.payload;
        s.bookingSuccess = false;
      });
  },
});

export const { clearBookingSuccess, clearError } = classesSlice.actions;
export default classesSlice.reducer;