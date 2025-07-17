import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, reset } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductPage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const { product, isLoading, isError, message } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProduct(productId));
        return () => { dispatch(reset()); };
    }, [dispatch, productId]);

    // --- 2. EVENT HANDLERS & RENDER ---
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    if (isLoading) return <Loader />;
    if (isError) return <Message variant="danger">{message || 'Product not found.'}</Message>;

    return (
        <div style={{ padding: '1rem' }}>
            <Link className="btn btn-light" to='/' style={{ marginBottom: '2rem', display: 'inline-block' }}>
                Go Back
            </Link>
            {product ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '5px' }} />
                        )}
                    </div>
                    <div>
                        <h3>{product.name}</h3>
                        {/* ... Rest of JSX ... */}
                    </div>
                </div>
            ) : (
                <Message>Product not found.</Message>
            )}
        </div>
    );
}
export default ProductPage;