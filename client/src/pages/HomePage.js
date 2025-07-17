import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, reset } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomePage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    // --- 2. RENDER LOGIC (AFTER HOOKS) ---
    const renderContent = () => {
        if (isLoading) return <Loader />;
        if (isError) return <Message variant="danger">{message || 'Could not fetch products.'}</Message>;
        if (Array.isArray(products) && products.length > 0) {
            return (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            );
        }
        return <p>No products found.</p>;
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Latest Products</h1>
            {renderContent()}
        </div>
    );
}
export default HomePage;