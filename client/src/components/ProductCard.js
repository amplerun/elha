import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.images[0]} alt={product.name} style={{ height: '150px', objectFit: 'cover' }} />
      </Link>
      <Link to={`/product/${product._id}`}>
        <h3>{product.name}</h3>
      </Link>
      <div>{product.rating} stars from {product.numReviews} reviews</div>
      <h4>${product.price}</h4>
    </div>
  );
}

export default ProductCard;