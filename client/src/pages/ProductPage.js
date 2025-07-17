import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, reset } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductPage() {
    // --- HOOKS INITIALIZATION ---
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    // Pull only the necessary state from Redux
    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    // The 'user' variable has been removed as it was unused in this component.
    // const { user } = useSelector(state => state.auth); // <-- THIS LINE IS REMOVED

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        dispatch(getProduct(productId));
        return () => {
            dispatch(reset());
        };
    }, [dispatch, productId]);

    // --- EVENT HANDLERS ---
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    // --- RENDER LOGIC ---
    return (
        <div style={{ padding: '1rem' }}>
            <Link className="btn btn-light" to='/' style={{ marginBottom: '2rem', display: 'inline-block' }}>
                Go Back
            </Link>

            {isLoading ? (
                <Loader />
            ) : isError ? (
                <Message variant="danger">{message || 'Product not found.'}</Message>
            ) : product ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    
                    <div>
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '5px' }} />
                        )}
                    </div>
                    
                    <div>
                        <h3>{product.name}</h3>
                        <hr/>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <hr/>
                        <p><strong>Price: ${product.price}</strong></p>
                        <hr/>
                        <p><strong>Description:</strong> {product.description}</p>
                        <hr/>
                        <p>
                            <strong>Status:</strong> 
                            {product.countInStock > 0 
                                ? <span style={{color: 'green', fontWeight: 'bold'}}> In Stock</span> 
                                : <span style={{color: 'red', fontWeight: 'bold'}}> Out Of Stock</span>}
                        </p>
                        <hr/>

                        {product.countInStock > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label htmlFor="qty-select" style={{ marginRight: '10px' }}>Qty:</label>
                                    <select id="qty-select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                        {[...Array(product.countInStock).keys()].map(x => 
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        )}
                                    </select>
                                </div>
                                <button 
                                    className="btn" 
                                    onClick={addToCartHandler} 
                                    disabled={product.countInStock === 0}
                                    style={{ flex: 1 }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Message>Product not found.</Message>
            )}
        </div>
    );
}

export default ProductPage;