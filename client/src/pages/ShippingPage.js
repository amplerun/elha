import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../features/cart/cartSlice';

function ShippingPage() {
    const { shippingAddress } = useSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="form-container">
            <h1>Shipping</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group"><label>Address</label><input type="text" value={address} required onChange={(e) => setAddress(e.target.value)} /></div>
                <div className="form-group"><label>City</label><input type="text" value={city} required onChange={(e) => setCity(e.target.value)} /></div>
                <div className="form-group"><label>Postal Code</label><input type="text" value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} /></div>
                <div className="form-group"><label>Country</label><input type="text" value={country} required onChange={(e) => setCountry(e.target.value)} /></div>
                <button type="submit" className="btn">Continue</button>
            </form>
        </div>
    );
}
export default ShippingPage;