import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createCategory, deleteCategory } from '../../features/admin/categorySlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function ManageCategoriesPage() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [parent, setParent] = useState('');
    const { categories, loading, error } = useSelector(state => state.categories);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createCategory({ name, parent: parent || undefined }));
        setName('');
        setParent('');
    };
    
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            dispatch(deleteCategory(id));
        }
    }

    return (
        <div>
            <h1>Manage Categories</h1>
            {error && <Message variant="danger">{error}</Message>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="form-container" style={{ margin: 0, padding: '1.5rem' }}>
                    <form onSubmit={submitHandler}>
                        <h3>Add Category</h3>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input type="text" placeholder="e.g., Electronics" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Parent Category</label>
                            <select value={parent} onChange={e => setParent(e.target.value)}>
                                <option value="">-- No Parent (Top Level) --</option>
                                {categories && categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </form>
                </div>
                <div>
                    <h3>Existing Categories</h3>
                    {loading ? <Loader /> : (
                        <table>
                            <thead><tr><th>Name</th><th>Parent</th><th>Actions</th></tr></thead>
                            <tbody>
                                {categories && categories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>{cat.name}</td>
                                        <td>{cat.parent ? cat.parent.name : 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-light" disabled>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(cat._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}


export default ManageCategoriesPage;