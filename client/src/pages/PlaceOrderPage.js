import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../features/orders/orderSlice';
import { clearCartItems } from '../features/cart/cartSlice';
import Message from '../components/Message';

function PlaceOrderPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { order, success, error } = useSelector((state) => state.order);

    cart.itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
    cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
    cart.totalPrice = (cart.itemsPrice + cart.shippingPrice + cart.taxPrice).toFixed(2);

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`);
            dispatch(clearCartItems());
            dispatch(resetOrder());
        }
    }, [navigate, success, order, dispatch]);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems, shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod, itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice, taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }));
    };

    return (
        <div>
            <h1>Order Summary</h1>
            <div>
                <h2>Shipping</h2>
                <p><strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}</p>
            </div>
            <div>
                <h2>Payment Method</h2>
                <p><strong>Method:</strong> {cart.paymentMethod}</p>
            </div>
            <div>
                <h2>Order Items</h2>
                {cart.cartItems.map((item, index) => <p key={index}>{item.name} ({item.qty} x ${item.price})</p>)}
            </div>
            <h2>Summary</h2>
            <p><strong>Items:</strong> ${cart.itemsPrice}</p>
            <p><strong>Shipping:</strong> ${cart.shippingPrice}</p>
            <p><strong>Tax:</strong> ${cart.taxPrice}</p>
            <p><strong>Total:</strong> ${cart.totalPrice}</p>
            {error && <Message variant="danger">{error}</Message>}
            <button className="btn" onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>
                Place Order
            </button>
        </div>
    );
}
export default PlaceOrderPage;