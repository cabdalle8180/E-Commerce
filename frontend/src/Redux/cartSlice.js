import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";

const savedCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const persistLocal = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const addItemLocal = (items, product, qty) => {
  const existing = items.find((item) => item._id === product._id);
  if (existing) {
    existing.quantity = Math.min(product.stock, existing.quantity + qty);
    return [...items];
  }
  return [
    ...items,
    {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: Math.min(product.stock, qty),
    },
  ];
};

export const loadCart = createAsyncThunk(
  "cart/load",
  async (_, { getState, rejectWithValue }) => {
    const { userInfo } = getState().user;
    const local = getState().cart.items;

    if (!userInfo?.token) return local;

    try {
      const data = await apiFetch("/api/cart");
      if (data.cart?.length > 0) {
        persistLocal(data.cart);
        return data.cart;
      }
      if (local.length > 0) {
        const synced = await apiFetch("/api/cart/sync", {
          method: "PUT",
          body: JSON.stringify({
            items: local.map((i) => ({
              productId: i._id,
              quantity: i.quantity,
            })),
          }),
        });
        persistLocal(synced.cart);
        return synced.cart;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (payload, { getState, rejectWithValue }) => {
    const product = payload.product || payload;
    const qty = payload.quantity || 1;
    const { userInfo } = getState().user;
    const local = getState().cart.items;

    if (!userInfo?.token) {
      const items = addItemLocal([...local], product, qty);
      persistLocal(items);
      return items;
    }

    try {
      const data = await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });
      persistLocal(data.cart);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    const { userInfo } = getState().user;
    const local = getState().cart.items;

    if (!userInfo?.token) {
      const items = local.map((item) =>
        item._id === id && quantity > 0 && quantity <= item.stock
          ? { ...item, quantity }
          : item
      ).filter((item) => item.quantity > 0);
      persistLocal(items);
      return items;
    }

    try {
      const data = await apiFetch(`/api/cart/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      persistLocal(data.cart);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { getState, rejectWithValue }) => {
    const { userInfo } = getState().user;
    const local = getState().cart.items;

    if (!userInfo?.token) {
      const items = local.filter((item) => item._id !== productId);
      persistLocal(items);
      return items;
    }

    try {
      const data = await apiFetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });
      persistLocal(data.cart);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { getState, rejectWithValue }) => {
    const { userInfo } = getState().user;

    if (!userInfo?.token) {
      persistLocal([]);
      return [];
    }

    try {
      const data = await apiFetch("/api/cart", { method: "DELETE" });
      persistLocal([]);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart,
    loading: false,
    error: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      persistLocal(action.payload);
    },
  },
  extraReducers: (builder) => {
    const setItems = (state, action) => {
      state.items = action.payload;
      state.loading = false;
    };

    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCart.fulfilled, setItems)
      .addCase(loadCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, setItems)
      .addCase(updateQuantity.fulfilled, setItems)
      .addCase(removeFromCart.fulfilled, setItems)
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

export const { setCartItems } = cartSlice.actions;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
