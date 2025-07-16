import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    myStore: null,
    loading: false,
    error: null,
};

export const getMyStore = createAsyncThunk('store/getMyStore', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/stores/mystore', config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const createOrUpdateStore = createAsyncThunk('store/createOrUpdate', async (storeData, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post('/api/stores', storeData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };
        const handleFulfilled = (state, action) => { state.loading = false; state.myStore = action.payload; };

        builder
            .addCase(getMyStore.pending, handlePending)
            .addCase(getMyStore.fulfilled, handleFulfilled)
            .addCase(getMyStore.rejected, handleRejected)
            .addCase(createOrUpdateStore.pending, handlePending)
            .addCase(createOrUpdateStore.fulfilled, handleFulfilled)
            .addCase(createOrUpdateStore.rejected, handleRejected);
    },
});

export default storeSlice.reducer;