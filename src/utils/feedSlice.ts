// import { createSlice } from '@reduxjs/toolkit';

// const feedSlice = createSlice({
//   name: 'feed',
//   initialState: [],
//   reducers: {
//     addFeed: (state: any, action: any) => {
//       state.push(action?.payload);
//       return;
//     },
//     removeUserFromFeed: (state: any, action: any) => {
//       const newFeed = state.filter((user: any) => user._id !== action.payload);
//       return newFeed;
//     },
//   },
// });

// export const { addFeed ,removeUserFromFeed} = feedSlice.actions;

// export default feedSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { user } from '../types';

const initialState: user[] = [];

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addFeed: (state, action: PayloadAction<user[]>) => {
      state.push(...action.payload);
      return;
    },
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      const newFeed = state.filter((user: any) => user._id !== action.payload);
      return newFeed;
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;
