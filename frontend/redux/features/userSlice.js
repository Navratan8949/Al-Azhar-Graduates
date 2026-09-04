import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getmyprofile } from "../../service/auth.service";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getmyprofile();
      console.log("------User data fetched successfully-------:", userData);
      return userData;
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user || action.payload;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      if (action.payload.token && typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAuthStatus = (state) => state.user.status;

export default userSlice.reducer;
