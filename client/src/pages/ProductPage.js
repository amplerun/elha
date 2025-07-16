import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, reset } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductPage() {
    // --- HOOKS INITIALIZATION (TOP LEVEL) ---
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector(state => state.auth); // To potentially add features like "Chat with Seller"

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        // Fetch product details when the component mounts or productId changes
        dispatch(getProduct(productId));

        // Cleanup function to reset the product state when the component unmounts
        return () => {
            dispatch(reset());
        };
    }, [dispatch, productId]);

    // --- EVENT HANDLERS ---
    const addToCartHandler = () => {
        // Dispatch the addToCart action with the full product object and selected quantity
        dispatch(addToCart({ ...product, qty }));
        // Navigate the user to their cart page for immediate feedback
        navigate('/cart');
    };

    // --- RENDER LOGIC ---
    return (
        <div>
            <Link className="btn btn-light" to='/' style={{ marginBottom: '2rem', display: 'inline-block' }}>
                Go Back
            </Link>

            {/* Conditional Rendering Logic */}
            {isLoading ? (
                <Loader />
            ) : isError ? (
                <Message variant="danger">{message || 'Product not found.'}</Message>
            ) : product ? ( // Only render if the product object exists
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    
                    {/* Left Column: Product Image */}
                    <div>
                        {/* Ensure images array exists before accessing its first element */}
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '5px' }} />
                        )}
                    </div>
                    
                    {/* Right Column: Product Details and Actions */}
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

                        {/* Quantity Selector and Add to Cart button only show if product is in stock */}
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
                // Fallback message if product is null after loading and no error
                <Message>Product not found.</Message>
            )}
        </div>
    );
}

export default ProductPage;