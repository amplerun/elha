import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../features/orders/orderSlice';
import { clearCartItems } from '../features/cart/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

function PlaceOrderPage() {
    // 1. ALL HOOKS AT THE TOP
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { order, success, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (!cart.shippingAddress?.address) navigate('/shipping');
        if (success && order) {
            navigate(`/order/${order._id}`);
            dispatch(clearCartItems());
            dispatch(resetOrder());
        }
    }, [navigate, cart.shippingAddress, success, order, dispatch]);

    // 2. EARLY RETURN AFTER HOOKS
    if (!cart.cartItems || cart.cartItems.length === 0) {
        return <div style={{ padding: '2rem' }}><Message>Your cart is empty. <Link to="/">Go Shopping</Link></Message></div>;
    }
    
    // 3. RENDER LOGIC
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
    const itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const placeOrderHandler = () => dispatch(createOrder({ orderItems: cart.cartItems, shippingAddress: cart.shippingAddress, paymentMethod: cart.paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice }));

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Order Summary</h1>
            {/* JSX content... */}
        </div>
    );
}

export default PlaceOrderPage;