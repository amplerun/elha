import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts, reset } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomePage() {
  const dispatch = useDispatch();
  // Provide a default empty array to prevent errors before data arrives
  const { products = [], isLoading, isError, message } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  return (
    <div>
      <h1>Latest Products</h1>
      {isLoading ? <Loader /> : isError ? <Message variant="danger">{message}</Message> : (
        <div className="product-grid">
          {/* Add a check to ensure products is a valid array before mapping */}
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
export default HomePage;