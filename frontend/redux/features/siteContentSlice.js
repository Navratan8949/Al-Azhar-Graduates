import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";

export const fetchSiteContent = createAsyncThunk(
  "siteContent/fetchSiteContent",
  async (_, { rejectWithValue }) => {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get(`/site-content?t=${timestamp}`);
      // Convert array of contents into a key-value object for easy access
      const contentMap = {};
      if (response.data && response.data.contents) {
        response.data.contents.forEach((item) => {
          contentMap[item.key] = item;
        });
      }
      return contentMap;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const siteContentSlice = createSlice({
  name: "siteContent",
  initialState: {
    data: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSiteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchSiteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default siteContentSlice.reducer;
