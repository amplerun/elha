import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const getErrorMessage = (error) => error.response?.data?.message || error.message || error.toString();

const initialState = {
    categories: [],
    loading: false,
    error: null,
};

export const getCategories = createAsyncThunk('categories/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/categories');
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const createCategory = createAsyncThunk('categories/create', async (categoryData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/api/categories', categoryData);
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
    try {
        await API.delete(`/api/categories/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(getCategories.pending, handlePending)
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, handleRejected)
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(cat => cat._id !== action.payload);
            });
    }
});

export default categorySlice.reducer;