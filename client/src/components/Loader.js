import React from 'react';

const Loader = () => {
    return (
        <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            borderTopColor: '#343a40',
            animation: 'spin 1s ease-in-out infinite'
        }}>
            <style>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loader;