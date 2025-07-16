import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth);

    useEffect(() => {
        if (isSuccess || user) navigate('/');
        return () => { dispatch(reset()); };
    }, [user, isSuccess, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
        } else {
            setFormError('');
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            {isError && <Message variant="danger">{message}</Message>}
            {formError && <Message variant="danger">{formError}</Message>}
            {isLoading && <Loader />}
            <form onSubmit={submitHandler}>
                <div className="form-group"><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <div className="form-group"><label>Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}
export default RegisterPage;