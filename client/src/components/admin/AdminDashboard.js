import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../../features/admin/adminSlice';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon }) => (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h4 style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{title}</h4>
        <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#343a40' }}>{value}</h2>
    </div>
);

function AdminDashboard() {
    const dispatch = useDispatch();
    const { stats, loading, error } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    // Mock chart data for revenue visualization
    const chartData = {
        labels: ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30'],
        datasets: [{
            label: 'Site-Wide Revenue',
            data: [1200, 1900, 3000, 5000, 7300], // Example data
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
            tension: 0.3
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue (Last 30 Days)' }
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#6c757d' }}>Overview of the entire marketplace.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
                <StatCard title="Total Users" value={stats.totalUsers} />
                <StatCard title="Active Sellers" value={stats.activeSellers} />
                <StatCard title="Total Products" value={stats.totalProducts} />
                <StatCard title="Total Revenue" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} />
            </div>
            <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
}

export default AdminDashboard;