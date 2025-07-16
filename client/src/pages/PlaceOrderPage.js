import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for better UI
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../features/orders/orderSlice';
import { clearCartItems } from '../features/cart/cartSlice';
import Message from '../components/Message';

function PlaceOrderPage() {
    // --- ALL HOOKS MUST BE CALLED AT THE TOP LEVEL ---
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { order, success, error } = useSelector((state) => state.order);

    // --- EFFECT HOOK IS CALLED UNCONDITIONALLY ---
    useEffect(() => {
        // We put the conditional logic *inside* the effect
        if (success && order) {
            navigate(`/order/${order._id}`);
            dispatch(clearCartItems());
            dispatch(resetOrder());
        }
    }, [navigate, success, order, dispatch]);

    // --- CONDITIONAL RETURNS and RENDER LOGIC COME AFTER HOOKS ---
    
    // Guard clause for missing cart or shipping address
    if (!cart.shippingAddress.address) {
        navigate('/shipping');
        return null; // Return null while redirecting
    }
    if (!cart.cartItems || cart.cartItems.length === 0) {
        return <Message>Your cart is empty. <Link to="/">Go Shopping</Link></Message>;
    }

    // Calculations can happen after the guard clauses
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
    const itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
        }));
    };

    return (
        <div>
            <h1>Order Summary</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div>
                        <h2>Shipping</h2>
                        <p><strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>Payment Method</h2>
                        <p><strong>Method:</strong> {cart.paymentMethod}</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>Order Items</h2>
                        {cart.cartItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <img src={item.images[0]} alt={item.name} style={{ width: '50px', marginRight: '1rem' }} />
                                <Link to={`/product/${item._id}`} style={{ flex: 1 }}>{item.name}</Link>
                                <div>{item.qty} x ${item.price} = ${addDecimals(item.qty * item.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Summary</h2>
                    <p><strong>Items:</strong> ${itemsPrice}</p>
                    <p><strong>Shipping:</strong> ${shippingPrice}</p>
                    <p><strong>Tax:</strong> ${taxPrice}</p>
                    <p><strong>Total:</strong> ${totalPrice}</p>
                    {error && <Message variant="danger">{error.message || error}</Message>}
                    <button className="btn" style={{ width: '100%' }} onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
export default PlaceOrderPage;