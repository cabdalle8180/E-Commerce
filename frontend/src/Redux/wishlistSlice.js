import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/wishlist");
      return data.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { wishlist } = getState();
      const exists = wishlist.items.some((p) => p._id === productId);

      if (exists) {
        const data = await apiFetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        });
        return data.wishlist || [];
      }

      const data = await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      return data.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((p) => p._id === productId);

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
