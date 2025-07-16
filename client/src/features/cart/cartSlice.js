import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems') 
        ? JSON.parse(localStorage.getItem('cartItems')) 
        : [],
    shippingAddress: localStorage.getItem('shippingAddress') 
        ? JSON.parse(localStorage.getItem('shippingAddress')) 
        : {},
    paymentMethod: localStorage.getItem('paymentMethod') 
        ? JSON.parse(localStorage.getItem('paymentMethod'))
        : 'PayPal',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const itemToAdd = action.payload;

            // --- THE CRITICAL FIX IS HERE ---
            // Create a cart-specific item object from the full product object.
            const cartItem = {
                product: itemToAdd._id, // Keep original product ID
                name: itemToAdd.name,
                // Select the first image from the 'images' array.
                image: itemToAdd.images[0], 
                price: itemToAdd.price,
                countInStock: itemToAdd.countInStock,
                qty: itemToAdd.qty,
            };
            // --- END OF FIX ---

            const existItem = state.cartItems.find((x) => x.product === cartItem.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? cartItem : x
                );
            } else {
                state.cartItems = [...state.cartItems, cartItem];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            // The payload should be the product ID
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
    },
});

export const { 
    addToCart, 
    removeFromCart, 
    saveShippingAddress, 
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;