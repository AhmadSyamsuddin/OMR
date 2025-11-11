import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const registerUser = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/register", payload);
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/login", payload);
      if (data.access_token) localStorage.setItem("token", data.access_token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isMembership: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isMembership = false;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token || s.token;
        s.user = a.payload.user || s.user;
        s.isMembership = Boolean(a.payload.user?.isMembership);
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.access_token;
        s.user = a.payload.user;
        s.isMembership = Boolean(a.payload.user?.isMembership);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        s.isMembership = Boolean(a.payload.isMembership);
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.loading = false;
        s.user = null;
        s.isMembership = false;
        s.error = a.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;