import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";

const savedCurrency = localStorage.getItem("storeCurrency") || "USD";
const savedLanguage = localStorage.getItem("storeLanguage") || "en";

export const createCollabSession = createAsyncThunk(
  "collab/create",
  async (flag, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/collaboration/create", {
        method: "POST",
        body: JSON.stringify({ flag }),
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinCollabSession = createAsyncThunk(
  "collab/join",
  async ({ sessionCode, flag }, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/collaboration/join", {
        method: "POST",
        body: JSON.stringify({ sessionCode, flag }),
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCollabSession = createAsyncThunk(
  "collab/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/collaboration/session");
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCollabStep = createAsyncThunk(
  "collab/updateStep",
  async (activeStep, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/collaboration/step", {
        method: "PUT",
        body: JSON.stringify({ activeStep }),
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCollabCart = createAsyncThunk(
  "collab/addToCart",
  async ({ productId, quantity, flag }, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/collaboration/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity, flag }),
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCollabCartQuantity = createAsyncThunk(
  "collab/updateCartQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/api/collaboration/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCollabCart = createAsyncThunk(
  "collab/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/api/collaboration/cart/${productId}`, {
        method: "DELETE",
      });
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveCollabSession = createAsyncThunk(
  "collab/leave",
  async (_, { rejectWithValue }) => {
    try {
      await apiFetch("/api/collaboration/leave", { method: "POST" });
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const collabSlice = createSlice({
  name: "collab",
  initialState: {
    activeSession: null,
    currency: savedCurrency,
    language: savedLanguage,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("storeCurrency", action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("storeLanguage", action.payload);
    },
    clearCollabError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleFullfilled = (state, action) => {
      state.activeSession = action.payload;
      state.loading = false;
      state.error = null;
    };

    builder
      .addCase(createCollabSession.fulfilled, handleFullfilled)
      .addCase(joinCollabSession.fulfilled, handleFullfilled)
      .addCase(fetchCollabSession.fulfilled, handleFullfilled)
      .addCase(updateCollabStep.fulfilled, handleFullfilled)
      .addCase(addToCollabCart.fulfilled, handleFullfilled)
      .addCase(updateCollabCartQuantity.fulfilled, handleFullfilled)
      .addCase(removeFromCollabCart.fulfilled, handleFullfilled)
      .addCase(leaveCollabSession.fulfilled, (state) => {
        state.activeSession = null;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("collab/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("collab/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message;
        }
      );
  },
});

export const { setCurrency, setLanguage, clearCollabError } = collabSlice.actions;
export default collabSlice.reducer;
