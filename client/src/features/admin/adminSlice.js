import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const getErrorMessage = (error) => error.response?.data?.message || error.message || error.toString();

const initialState = {
    stats: {},
    users: [],
    orders: [],
    stores: [],
    loading: false,
    error: null,
};

// Async thunks for admin actions
export const getDashboardStats = createAsyncThunk('admin/getStats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/admin/stats');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const listUsers = createAsyncThunk('admin/listUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/users');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const listOrders = createAsyncThunk('admin/listOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/orders');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const listStores = createAsyncThunk('admin/listStores', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/stores/admin');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const updateStoreStatus = createAsyncThunk('admin/updateStoreStatus', async ({ storeId, status }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/api/stores/${storeId}/status`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
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
            .addCase(getDashboardStats.pending, handlePending)
            .addCase(getDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(getDashboardStats.rejected, handleRejected)
            .addCase(listUsers.pending, handlePending)
            .addCase(listUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
            .addCase(listUsers.rejected, handleRejected)
            .addCase(listOrders.pending, handlePending)
            .addCase(listOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
            .addCase(listOrders.rejected, handleRejected)
            .addCase(listStores.pending, handlePending)
            .addCase(listStores.fulfilled, (state, action) => { state.loading = false; state.stores = action.payload; })
            .addCase(listStores.rejected, handleRejected)
            .addCase(updateStoreStatus.fulfilled, (state, action) => {
                const index = state.stores.findIndex(store => store._id === action.payload._id);
                if (index !== -1) state.stores[index] = action.payload;
            });
    },
});

export default adminSlice.reducer;