import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { 
    order: null, 
    myOrders: [],
    loading: false, 
    error: null, 
    success: false 
};

export const createOrder = createAsyncThunk('order/create', async (order, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post('/api/orders', order, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const getOrderDetails = createAsyncThunk('order/details', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const getMyOrders = createAsyncThunk('order/myOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/myorders`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };
        
        builder
            .addCase(createOrder.pending, handlePending)
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, handleRejected)
            .addCase(getOrderDetails.pending, handlePending)
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, handleRejected)
            .addCase(getMyOrders.pending, handlePending)
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.myOrders = action.payload;
            })
            .addCase(getMyOrders.rejected, handleRejected);
    },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;