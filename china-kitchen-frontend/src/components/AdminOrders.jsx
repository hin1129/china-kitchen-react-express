import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statuses = [
    'pending',
    'accepted',
    'preparing',
    'ready',
    'out-for-delivery',
    'completed',
    'cancelled',
];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/orders', {
                withCredentials: true,
            });

            setOrders(response.data);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to load orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/admin/orders/${orderId}/status`,
                { status },
                { withCredentials: true }
            );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: response.data.order.status }
                        : order
                )
            );
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to update order');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin - Orders</h2>

            {error && <p>{error}</p>}

            {orders.map((order) => (
                <div key={order._id} className="card mb-3">
                    <div className="card-body">
                        <h5>{order._id}</h5>

                        <p>
                            Customer:{' '}
                            {order.customerFullName || order.userId?.fullName || 'Unknown'}
                        </p>

                        {order.userId?.username && (
                            <p>Username: {order.userId.username}</p>
                        )}

                        <p>Type: {order.orderType}</p>

                        {order.orderType === 'delivery' && (
                            <p>
                                Address: {order.deliveryAddress}, {order.deliveryPostcode}
                            </p>
                        )}

                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.quantity} × {item.name}
                                    {item.rice && ` + ${item.rice}`}
                                </li>
                            ))}
                        </ul>

                        <p>Total: £{Number(order.total).toFixed(2)}</p>

                        <label>
                            Status:{' '}
                            <select
                                value={order.status}
                                onChange={(event) =>
                                    handleStatusChange(order._id, event.target.value)
                                }
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrders;
