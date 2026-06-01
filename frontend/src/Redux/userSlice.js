import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";

const persistUser = (user, token) => {
  const merged = token ? { ...user, token } : user;
  localStorage.setItem("userInfo", JSON.stringify(merged));
  if (token) localStorage.setItem("userToken", token);
  return merged;
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to register");
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to login");
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/auth/me");
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  "user/uploadProfilePic",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const data = await apiFetch("/api/auth/profile-pic", {
        method: "PUT",
        body: formData,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // ignore
  }
});

const savedUser = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: savedUser,
    loading: false,
    error: null,
    status: "idle",
    passwordMessage: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.passwordMessage = null;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.status = "idle";
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
    },
    setUserInfo: (state, action) => {
      const token = state.userInfo?.token || localStorage.getItem("userToken");
      state.userInfo = persistUser(action.payload, token);
    },
  },
  extraReducers: (builder) => {
    const handleAuthFulfilled = (state, action) => {
      state.loading = false;
      state.userInfo = persistUser(action.payload, action.payload.token);
      state.status = "succeeded";
    };

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.userInfo = persistUser(action.payload, state.userInfo?.token);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userInfo = persistUser(action.payload, state.userInfo?.token);
        state.status = "succeeded";
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.userInfo = persistUser(action.payload, state.userInfo?.token);
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.passwordMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
      });
  },
});

export const { clearUserInfo, resetStatus, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
