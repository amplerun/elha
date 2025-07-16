import React from 'react';

const Message = ({ variant = 'info', children }) => {
    const getVariantClass = () => {
        switch (variant) {
            case 'success': return { backgroundColor: '#d4edda', color: '#155724' };
            case 'danger': return { backgroundColor: '#f8d7da', color: '#721c24' };
            default: return { backgroundColor: '#cce5ff', color: '#004085' };
        }
    };

    return (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.25rem', ...getVariantClass() }}>
            {children}
        </div>
    );
};

export default Message;