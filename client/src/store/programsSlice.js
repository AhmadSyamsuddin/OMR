import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchPrograms = createAsyncThunk(
  "programs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/exercises");
      return data.exercises;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchWorkoutPlan = createAsyncThunk(
  "programs/fetchWorkoutPlan",
  async ({ programId, programName }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/generate-workout-plan", { programName });
      return data.workoutPlan;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const programsSlice = createSlice({
  name: "programs",
  initialState: {
    items: [],
    workoutPlan: null,
    loading: false,
    workoutLoading: false,
    error: null,
  },
  reducers: {
    clearWorkoutPlan(state) {
      state.workoutPlan = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchPrograms.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchWorkoutPlan.pending, (s) => {
        s.workoutLoading = true;
        s.error = null;
      })
      .addCase(fetchWorkoutPlan.fulfilled, (s, a) => {
        s.workoutLoading = false;
        s.workoutPlan = a.payload;
      })
      .addCase(fetchWorkoutPlan.rejected, (s, a) => {
        s.workoutLoading = false;
        s.error = a.payload;
      });
  },
});

export const { clearWorkoutPlan, clearError } = programsSlice.actions;
export default programsSlice.reducer;