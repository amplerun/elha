import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import Message from '../components/Message';

function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Provide a default empty array for cartItems
    const { cartItems = [] } = useSelector((state) => state.cart);

    const removeFromCartHandler = (id) => { dispatch(removeFromCart(id)); };
    const checkoutHandler = () => { navigate('/login?redirect=/shipping'); };

    // These calculations are safe because cartItems defaults to []
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div>
            <h1>Shopping Cart</h1>
            {/* The length check is already a sufficient guard clause here */}
            {cartItems.length === 0 ? (
                <Message>Your cart is empty <Link to='/'>Go Back</Link></Message>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', listStyle: 'none' }}>
                                <img src={item.images[0]} alt={item.name} style={{width: '100px', marginRight: '1rem'}} />
                                <div style={{ flex: 1 }}><Link to={`/product/${item._id}`}>{item.name}</Link></div>
                                <div style={{ flex: 1 }}>${item.price}</div>
                                <div style={{ flex: 1 }}>
                                    <select className="form-group" value={item.qty} onChange={(e) => dispatch(addToCart({...item, qty: Number(e.target.value)}))}>
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}><button className="btn btn-danger btn-sm" onClick={() => removeFromCartHandler(item._id)}>Remove</button></div>
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '2rem' }}>
                        <h2>Subtotal ({totalItems}) items: ${totalPrice}</h2>
                        <button className="btn" disabled={cartItems.length === 0} onClick={checkoutHandler}>Proceed To Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default CartPage;