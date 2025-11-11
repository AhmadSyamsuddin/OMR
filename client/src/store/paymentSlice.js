import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const generatePaymentToken = createAsyncThunk(
  "payment/generateToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/payment/generate-token");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentToken(state) {
      state.token = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePaymentToken.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(generatePaymentToken.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
      })
      .addCase(generatePaymentToken.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { clearPaymentToken, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;