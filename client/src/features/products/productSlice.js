import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  product: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
    try {
        const { data } = await axios.get('/api/products');
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const getProduct = createAsyncThunk('products/getOne', async (productId, thunkAPI) => {
    try {
        const { data } = await axios.get(`/api/products/${productId}`);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post('/api/products', productData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.put(`/api/products/${productId}`, productData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (productId, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${productId}`, config);
        return productId;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.isLoading = true; };
    const handleRejected = (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; };

    builder
      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.products = action.payload;
      })
      .addCase(getProducts.rejected, handleRejected)
      .addCase(getProduct.pending, handlePending)
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.product = action.payload;
      })
      .addCase(getProduct.rejected, handleRejected)
      .addCase(createProduct.pending, handlePending)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, handleRejected)
      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.products = state.products.map(p => p._id === action.payload._id ? action.payload : p);
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, handleRejected)
      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, handleRejected);
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;