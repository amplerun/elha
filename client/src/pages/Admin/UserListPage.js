import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../../features/admin/adminSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function UserListPage() {
    const dispatch = useDispatch();
    // Provide a default empty array
    const { users = [], loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    return (
        <div>
            <h1>Users</h1>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <table>
                    <thead>
                        <tr><th>ID</th><th>NAME</th><th>EMAIL</th><th>ROLE</th></tr>
                    </thead>
                    <tbody>
                        {/* Add a check before mapping */}
                        {users && users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>{user.role}</td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserListPage;