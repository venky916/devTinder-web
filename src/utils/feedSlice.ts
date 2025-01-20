import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: [],
    reducers: {
        addFeed: (state:any, action:any) => {
            state.push(action?.payload);
            return;
        },
        removeTop: (state) => {
            state.shift()
            return
        }
    }
})


export const { addFeed} = feedSlice.actions;

export default feedSlice.reducer;