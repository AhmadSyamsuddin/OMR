import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchUserClasses = createAsyncThunk(
  "userClasses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/workout-classes-user");
      return data.classes || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteUserClass = createAsyncThunk(
  "userClasses/delete",
  async (classId, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/workout-classes/${classId}`);
      
      // Re-fetch user classes after delete
      dispatch(fetchUserClasses());
      
      return classId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const userClassesSlice = createSlice({
  name: "userClasses",
  initialState: {
    items: [],
    loading: false,
    deleteLoading: false,
    error: null,
    deleteSuccess: false,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearDeleteSuccess(state) {
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserClasses.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserClasses.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchUserClasses.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(deleteUserClass.pending, (s) => {
        s.deleteLoading = true;
        s.error = null;
        s.deleteSuccess = false;
      })
      .addCase(deleteUserClass.fulfilled, (s, a) => {
        s.deleteLoading = false;
        s.deleteSuccess = true;
      })
      .addCase(deleteUserClass.rejected, (s, a) => {
        s.deleteLoading = false;
        s.error = a.payload;
      });
  },
});

export const { clearError, clearDeleteSuccess } = userClassesSlice.actions;
export default userClassesSlice.reducer;