import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Import the central API client

const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || error.toString();
};

const initialState = { 
    order: null, 
    myOrders: [],
    loading: false, 
    error: null, 
    success: false 
};

export const createOrder = createAsyncThunk('order/create', async (order, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/orders', order);
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const getOrderDetails = createAsyncThunk('order/details', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/api/orders/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const getMyOrders = createAsyncThunk('order/myOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/api/orders/myorders`);
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.success = false;
            state.error = null;
            state.loading = false;
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