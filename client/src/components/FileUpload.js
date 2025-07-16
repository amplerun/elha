import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';

const FileUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setError('');

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            onUploadSuccess(data.image);
            setUploading(false);
        } catch (err) {
            setError('Image upload failed. Please try again.');
            console.error(err);
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" label="Choose File" onChange={uploadFileHandler} />
            {uploading && <Loader />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileUpload;