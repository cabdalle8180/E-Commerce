import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// register user
export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// login user
export const loginUser = createAsyncThunk(
    "user/login",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login");
            }

            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
// token 

const userSlice = createSlice({
    name: "user",

    initialState: {
        userInfo: null,
        loading: false,
        error: null,
        status: "idle",
    },

    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        },

        clearUserInfo: (state) => {
            state.userInfo = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.status = "succeeded";
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.status = "succeeded";
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserInfo, resetStatus } = userSlice.actions;

export default userSlice.reducer;