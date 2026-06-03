import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import cartReducer from './cartSlice.js';
import wishlistReducer from './wishlistSlice.js';
import collabReducer from './collabSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        collab: collabReducer,
    },
});