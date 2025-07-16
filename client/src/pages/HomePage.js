import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, reset } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomePage() {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  // Render logic with explicit checks
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (isError) {
      return <Message variant="danger">{message || 'An error occurred'}</Message>;
    }
    // THE CRITICAL FIX: Check if 'products' is actually an array before trying to map it.
    if (Array.isArray(products) && products.length > 0) {
      return (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }
    // If not loading, not an error, but no products, show a message.
    return <p>No products found.</p>;
  };

  return (
    <div>
      <h1>Latest Products</h1>
      {renderContent()}
    </div>
  );
}
export default HomePage;