import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct, reset } from '../../features/products/productSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function ProductListPage() {
    const dispatch = useDispatch();
    const { products = [], isLoading, isError, message } = useSelector(state => state.products);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getProducts());
        return () => dispatch(reset());
    }, [dispatch]);
    
    const deleteHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    // Filter products safely, ensuring products is an array
    const sellerProducts = Array.isArray(products) ? products.filter(p => p.user === user._id) : [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>My Products</h1>
                <Link to="/seller/product/create" className="btn">Create Product</Link>
            </div>
            {isLoading ? <Loader /> : isError ? <Message variant="danger">{message}</Message> : (
                <table>
                    <thead>
                        <tr><th>ID</th><th>NAME</th><th>PRICE</th><th>CATEGORY</th><th>BRAND</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                        {sellerProducts.length > 0 ? (
                            sellerProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <Link to={`/seller/product/${product._id}/edit`} className="btn btn-sm btn-light">Edit</Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center'}}>You have not created any products yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductListPage;