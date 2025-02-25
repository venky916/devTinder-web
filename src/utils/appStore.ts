import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import connectionReducer from './conecctionSlice';
import requestReducer from './requestSlice';
const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
});

// ✅ Export RootState Type
export type RootState = ReturnType<typeof appStore.getState>;

export default appStore;





