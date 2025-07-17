import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyStore, createOrUpdateStore } from '../../features/store/storeSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FileUpload from '../../components/FileUpload';

function SellerDashboard() {
    // 1. ALL HOOKS AT THE TOP
    const dispatch = useDispatch();
    const { myStore, loading, error } = useSelector(state => state.store);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState('');

    useEffect(() => {
        dispatch(getMyStore());
    }, [dispatch]);

    useEffect(() => {
        if (myStore) {
            setName(myStore.name || '');
            setDescription(myStore.description || '');
            setLogo(myStore.logo || '');
        }
    }, [myStore]);

    // 2. EVENT HANDLERS / RENDER LOGIC
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createOrUpdateStore({ name, description, logo }));
    };

    return (
        <div>
            <h1>Seller Dashboard</h1>
            {/* JSX content... */}
        </div>
    );
}
export default SellerDashboard;