import { createSlice } from '@reduxjs/toolkit';

const readFileSlice = createSlice({
  name: 'loadAudioReducer',
  initialState: {
    principalAudioBlob: null,
    errorLoading: false,
    loading: false
  },
  reducers: {
    setError: (state, _action) => {
      state.errorLoading = true;
      console.log(state);
    },
    setBlob: (state, action) => {
      state.principalAudioBlob = action.payload;
      console.log(state);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      console.log(state);
    }
  },
});

export const { setError, setBlob, setLoading } = readFileSlice.actions;
export default readFileSlice.reducer;