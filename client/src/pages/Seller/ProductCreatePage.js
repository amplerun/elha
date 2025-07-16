import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getProduct, updateProduct, reset } from '../../features/products/productSlice';
import FileUpload from '../../components/FileUpload';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function ProductCreatePage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { product, isLoading, isError, message } = useSelector(state => state.products);
    const { myStore } = useSelector(state => state.store); // Assuming you have a slice for the seller's store

    const isEditMode = Boolean(productId);

    useEffect(() => {
        if (isEditMode && (!product || product._id !== productId)) {
            dispatch(getProduct(productId));
        } else if (isEditMode && product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.images[0]);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
        return () => dispatch(reset());
    }, [dispatch, productId, product, isEditMode]);

    const submitHandler = (e) => {
        e.preventDefault();
        const productData = { name, price, images: [image], brand, category, countInStock, description, store: myStore._id };
        if (isEditMode) {
            dispatch(updateProduct({ productId, productData }));
        } else {
            dispatch(createProduct(productData));
        }
        navigate('/seller/products');
    };

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
            {isLoading && <Loader />}
            {isError && <Message variant="danger">{message}</Message>}
            <form onSubmit={submitHandler}>
                <div className="form-group"><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="form-group"><label>Price</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
                <div className="form-group"><label>Image</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter image URL" /><FileUpload onUploadSuccess={(url) => setImage(url)} /></div>
                <div className="form-group"><label>Brand</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
                <div className="form-group"><label>Category</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
                <div className="form-group"><label>Count In Stock</label><input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} /></div>
                <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <button type="submit" className="btn">{isEditMode ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
}
export default ProductCreatePage;