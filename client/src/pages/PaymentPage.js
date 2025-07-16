import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../features/cart/cartSlice';

function PaymentPage() {
    const { shippingAddress } = useSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!shippingAddress) navigate('/shipping');

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="form-container">
            <h1>Payment Method</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Select Method</label>
                    <div>
                        <input type="radio" id="paypal" name="paymentMethod" value="PayPal" checked onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="paypal">PayPal or Credit Card</label>
                    </div>
                </div>
                <button type="submit" className="btn">Continue</button>
            </form>
        </div>
    );
}
export default PaymentPage;