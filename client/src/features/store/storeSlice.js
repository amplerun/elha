import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Import the central API client

const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || error.toString();
};

const initialState = {
    myStore: null,
    loading: false,
    error: null,
};

export const getMyStore = createAsyncThunk('store/getMyStore', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/stores/mystore');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const createOrUpdateStore = createAsyncThunk('store/createOrUpdate', async (storeData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/stores', storeData);
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
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