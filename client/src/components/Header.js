import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#343a40', color: 'white' }}>
      <Link to="/" style={{ color: 'white', fontSize: '1.5rem' }}>E-Commerce</Link>
      <nav>
        <Link to="/cart" style={{ color: 'white', margin: '0 10px' }}>
            Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
        </Link>
        {user ? (
          <div style={{ display: 'inline' }}>
            <Link to="/profile" style={{ color: 'white', margin: '0 10px' }}>{user.name}</Link>
            {user.role === 'admin' && <Link to="/admin/dashboard" style={{ color: 'white', margin: '0 10px' }}>Admin</Link>}
            {user.role === 'seller' && <Link to="/seller/dashboard" style={{ color: 'white', margin: '0 10px' }}>Seller</Link>}
            <a href="#!" onClick={onLogout} style={{ color: 'white', margin: '0 10px' }}>Logout</a>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', margin: '0 10px' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;