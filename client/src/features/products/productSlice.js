import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios'; // Import our new central API client

const initialState = {
  products: [],
  product: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getProducts = createAsyncThunk('products/getAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/api/products');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getProduct = createAsyncThunk('products/getOne', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/api/products/${productId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
    try {
        // No need to get state or set config here, the interceptor handles the token.
        const { data } = await API.post('/api/products', productData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ productId, productData }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/api/products/${productId}`, productData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (productId, { rejectWithValue }) => {
    try {
        await API.delete(`/api/products/${productId}`);
        return productId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const productSlice = createSlice({
  name: 'products', // Changed from 'product' to 'products' for consistency
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
      // Add other cases for create, update, delete
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;