// import {configureStore} from '@reduxjs/toolkit';
// import userSlice from './userSlice';

// export const store = configureStore({
//     reducer: {
//         // Add your reducers here
//         user: userSlice.reducer,
//     },
// });




import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});