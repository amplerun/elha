import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, firebaseLogin, reset } from '../features/auth/authSlice';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { uiConfig, auth } from '../firebase';
import Loader from '../components/Loader';
import Message from '../components/Message';

function LoginPage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (isSuccess || user) {
            navigate(redirect);
        }
        // No need to reset on unmount, as we want error messages to persist briefly
    }, [user, isSuccess, navigate, redirect]);
    
    // Cleanup effect specifically for unmounting
    useEffect(() => {
        return () => { dispatch(reset()); };
    }, [dispatch]);


    // --- 2. LOGIC AND RENDER ---
    const fullUiConfig = { ...uiConfig, callbacks: {
        signInSuccessWithAuthResult: function(authResult) {
            authResult.user.getIdToken().then(idToken => dispatch(firebaseLogin(idToken)));
            return false;
        },
    }};

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="form-container">
            <h1>Sign In</h1>
            {isError && <Message variant="danger">{message}</Message>}
            {isLoading && <Loader />}
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn">Sign In</button>
            </form>
            <p style={{marginTop: '1rem'}}>New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link></p>
            <hr style={{margin: '20px 0'}} />
            <StyledFirebaseAuth uiConfig={fullUiConfig} firebaseAuth={auth} />
        </div>
    );
}
export default LoginPage;