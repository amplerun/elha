import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Import the central API client

// Helper function to extract error messages
const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || error.toString();
};

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/users', userData);
        if (data) localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/users/login', userData);
        if (data) localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// Firebase Login Bridge
export const firebaseLogin = createAsyncThunk('auth/firebaseLogin', async (firebaseToken, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/users/firebase-auth', { firebaseToken });
        if (data) localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.isLoading = true; };
    const handleFulfilled = (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
    };
    const handleRejected = (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
    };
    
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(login.rejected, handleRejected)
      .addCase(firebaseLogin.pending, handlePending)
      .addCase(firebaseLogin.fulfilled, handleFulfilled)
      .addCase(firebaseLogin.rejected, handleRejected)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;