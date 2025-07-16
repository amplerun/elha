import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/users/';
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  token: user ? user.token : null,
  isError: false, isSuccess: false, isLoading: false, message: '',
};

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, user);
    if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'login', user);
    if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const firebaseLogin = createAsyncThunk('auth/firebaseLogin', async (firebaseToken, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'firebase-auth', { firebaseToken });
        if(response.data) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false; state.isSuccess = false;
      state.isError = false; state.message = '';
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.isLoading = true; };
    const handleFulfilled = (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.user = action.payload; state.token = action.payload.token;
    };
    const handleRejected = (state, action) => {
        state.isLoading = false; state.isError = true;
        state.message = action.payload; state.user = null; state.token = null;
    };
    
    builder
      .addCase(register.pending, handlePending).addCase(register.fulfilled, handleFulfilled).addCase(register.rejected, handleRejected)
      .addCase(login.pending, handlePending).addCase(login.fulfilled, handleFulfilled).addCase(login.rejected, handleRejected)
      .addCase(firebaseLogin.pending, handlePending).addCase(firebaseLogin.fulfilled, handleFulfilled).addCase(firebaseLogin.rejected, handleRejected)
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;