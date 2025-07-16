import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getProduct, updateProduct, reset } from '../../features/products/productSlice';
import { getMyStore } from '../../features/store/storeSlice';
import FileUpload from '../../components/FileUpload';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function ProductCreatePage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    // Use an images array to be consistent with the model
    const [images, setImages] = useState(['']); 
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { product, isLoading, isError, message } = useSelector(state => state.products);
    const { myStore } = useSelector(state => state.store);

    const isEditMode = Boolean(productId);

    useEffect(() => {
        // Fetch seller's store info if not already loaded
        if (!myStore) {
            dispatch(getMyStore());
        }

        if (isEditMode) {
            if (!product || product._id !== productId) {
                dispatch(getProduct(productId));
            } else if (product) {
                setName(product.name);
                setPrice(product.price);
                setImages(product.images);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
        
        // Cleanup on unmount
        return () => {
            dispatch(reset());
        }
    }, [dispatch, productId, product, isEditMode, myStore]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!myStore) {
            alert('Store information is not available. Please create or refresh your store page.');
            return;
        }
        const productData = { name, price, images, brand, category, countInStock, description, store: myStore._id };
        if (isEditMode) {
            dispatch(updateProduct({ productId, productData }));
        } else {
            dispatch(createProduct(productData));
        }
        navigate('/seller/products');
    };
    
    // --- THE CRITICAL FIX FOR UPLOADING ---
    // This handler will be passed to the FileUpload component
    const handleUploadSuccess = (uploadedImageUrl) => {
        // We will set the first image in the array to the newly uploaded one.
        // A more advanced implementation could handle multiple images.
        setImages([uploadedImageUrl]);
    };

    return (
        <div className="form-container">
            <Link to="/seller/products" className="btn btn-light" style={{marginBottom: '1rem'}}>Go Back</Link>
            <h1>{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
            {isLoading && <Loader />}
            {isError && <Message variant="danger">{message}</Message>}
            <form onSubmit={submitHandler}>
                <div className="form-group"><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="form-group"><label>Price</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
                
                <div className="form-group">
                    <label>Image</label>
                    <input type="text" value={images[0]} onChange={(e) => setImages([e.target.value])} placeholder="Enter image URL or upload" />
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
                
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