import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users: [],
    orders: [],
    stores: [],
    loading: false,
    error: null,
};

// Async thunks for admin actions
export const listUsers = createAsyncThunk('admin/listUsers', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/users', config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const listOrders = createAsyncThunk('admin/listOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders', config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const listStores = createAsyncThunk('admin/listStores', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/stores/admin', config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const updateStoreStatus = createAsyncThunk('admin/updateStoreStatus', async ({ storeId, status }, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.put(`/api/stores/${storeId}/status`, { status }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };
        
        builder
            .addCase(listUsers.pending, handlePending)
            .addCase(listUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(listUsers.rejected, handleRejected)
            .addCase(listOrders.pending, handlePending)
            .addCase(listOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(listOrders.rejected, handleRejected)
            .addCase(listStores.pending, handlePending)
            .addCase(listStores.fulfilled, (state, action) => {
                state.loading = false;
                state.stores = action.payload;
            })
            .addCase(listStores.rejected, handleRejected)
            .addCase(updateStoreStatus.fulfilled, (state, action) => {
                const index = state.stores.findIndex(store => store._id === action.payload._id);
                if (index !== -1) {
                    state.stores[index] = action.payload;
                }
            });
    },
});

export default adminSlice.reducer;