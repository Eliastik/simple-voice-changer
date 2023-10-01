import { configureStore } from '@reduxjs/toolkit';
import readFileReducer from './slices/loadAudio';

const store = configureStore({
  reducer: {
    readFileReducer
  },
  devTools: true
});

export default store;