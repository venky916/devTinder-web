import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connection } from '../types';

const initialState: connection[] = [];

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequests: (_state, action: PayloadAction<connection[]>) => action.payload,
    removeRequest: (state, action: PayloadAction<string>) => {
      const newArray = state?.filter((req) => req?._id !== action.payload);
      return newArray;
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
