import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function RegisterPage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth);
    
    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (isSuccess || user) {
            navigate(redirect);
        }
    }, [user, isSuccess, navigate, redirect]);

    useEffect(() => {
        return () => { dispatch(reset()); };
    }, [dispatch]);

    // --- 2. LOGIC AND RENDER ---
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
            <p style={{marginTop: '1rem'}}>Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link></p>
        </div>
    );
}
export default RegisterPage;