import React, { useEffect, useState } from 'react';
// The 'useNavigate' was removed in a previous step, but Link was used. Add it back.
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, reset } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductPage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const { product, isLoading, isError, message } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProduct(productId));
        return () => { dispatch(reset()); };
    }, [dispatch, productId]);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    return (
        <div>
        {isLoading ? <Loader /> : isError ? <Message variant="danger">{message}</Message> : product && (
            <>
                <Link className="btn btn-light" to='/' style={{ marginBottom: '1rem', display: 'inline-block' }}>Go Back</Link>
                <div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '5px' }} />
                    </div>
                    <div style={{ flex: 1, paddingLeft: '1rem' }}>
                        <h3>{product.name}</h3>
                        <p><strong>Price: ${product.price}</strong></p>
                        <p>Description: {product.description}</p>
                        <p>Status: {product.countInStock > 0 ? <span style={{color: 'green'}}>In Stock</span> : <span style={{color: 'red'}}>Out Of Stock</span>}</p>
                        {product.countInStock > 0 && (
                            <div className="form-group">
                                <label>Qty</label>
                                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                    {[...Array(product.countInStock).keys()].map(x => <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                                </select>
                            </div>
                        )}
                        <button className="btn" onClick={addToCartHandler} disabled={product.countInStock === 0}>Add to Cart</button>
                    </div>
                </div>
            </>
        )}
        </div>
    );
}
export default ProductPage;