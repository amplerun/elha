import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../features/orders/orderSlice';
import { clearCartItems } from '../features/cart/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

function PlaceOrderPage() {
    // 1. All hooks at the top
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

    // 2. Early return after hooks
    if (!cart.cartItems || cart.cartItems.length === 0) {
        return <div style={{ padding: '2rem' }}><Message>Your cart is empty. <Link to="/">Go Shopping</Link></Message></div>;
    }
    
    // 3. Calculations and handlers
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
    const itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const placeOrderHandler = () => dispatch(createOrder({ orderItems: cart.cartItems, shippingAddress: cart.shippingAddress, paymentMethod: cart.paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice }));

    // 4. Main JSX Render
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Order Summary</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                {/* Left Column */}
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2>Shipping</h2>
                        <p><strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}</p>
                    </div>
                    <hr />
                    <div style={{ margin: '1rem 0' }}>
                        <h2>Payment Method</h2>
                        <p><strong>Method:</strong> {cart.paymentMethod}</p>
                    </div>
                    <hr />
                    <div style={{ marginTop: '1rem' }}>
                        <h2>Order Items</h2>
                        {cart.cartItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '1rem' }} />
                                <Link to={`/product/${item.product || item._id}`} style={{ flex: 1 }}>{item.name}</Link>
                                <div>{item.qty} x ${addDecimals(item.price)} = ${addDecimals(item.qty * item.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (Summary) */}
                <div>
                    <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '5px', backgroundColor: 'white' }}>
                        <h2>Summary</h2>
                        <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Items:</span> <span>${itemsPrice}</span></p>
                        <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping:</span> <span>${shippingPrice}</span></p>
                        <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax:</span> <span>${taxPrice}</span></p>
                        <hr />
                        <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}><span>Total:</span> <span>${totalPrice}</span></p>
                        <hr />
                        {error && <Message variant="danger">{error.message || error}</Message>}
                        {loading && <Loader />}
                        <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={placeOrderHandler} disabled={cart.cartItems.length === 0 || loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrderPage;