import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState('');

    const fetchOrders = async () => {
        try {
            setError('');

            const response = await axios.get(
                'http://localhost:8000/admin/orders',
                {
                    withCredentials: true,
                }
            );

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        }
        catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to load orders'
            );
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDateTime = (value) => {
        if (!value) {
            return 'Not available';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return 'Not available';
        }

        return date.toLocaleString(
            'en-GB',
            {
                dateStyle: 'medium',
                timeStyle: 'short',
            }
        );
    };

    const getRequestedTimeText = (order) => {
        if (order.fulfilmentType === 'asap') {
            return 'As soon as possible';
        }

        return order.requestedTime
            ? formatDateTime(order.requestedTime)
            : 'Not specified';
    };

    const getRefundText = (order) => {
        if (order.refundStatus === 'full') {
            return `FULL — £${Number(
                order.refundedAmount || 0
            ).toFixed(2)} refunded`;
        }

        if (order.refundStatus === 'partial') {
            return `PARTIAL — £${Number(
                order.refundedAmount || 0
            ).toFixed(2)} refunded`;
        }

        return 'None';
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h2>Admin - Orders</h2>

            <p className="text-muted">
                Paid orders are shown newest first.
            </p>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!error && orders.length === 0 && (
                <div className="alert alert-info">
                    No paid orders found.
                </div>
            )}

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="card mb-4"
                >
                    <div className="card-body">
                        <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                            <div>
                                <h5 className="mb-1">
                                    Order #{order._id}
                                </h5>

                                <div className="text-muted">
                                    Placed:{' '}
                                    {formatDateTime(
                                        order.createdAt
                                    )}
                                </div>
                            </div>

                            <div className="text-md-end">
                                <strong>
                                    {order.orderType === 'delivery'
                                        ? 'Delivery'
                                        : 'Collection'}
                                </strong>

                                <div>
                                    {getRequestedTimeText(order)}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                            <div>
                                <strong>
                                    £{Number(order.total || 0).toFixed(2)}
                                </strong>
                                {' · '}
                                {order.items?.length || 0}{' '}
                                {(order.items?.length || 0) === 1
                                    ? 'item'
                                    : 'items'}
                                {' · '}
                                {String(
                                    order.paymentStatus || 'not paid'
                                ).toUpperCase()}

                                {order.refundStatus &&
                                    order.refundStatus !== 'none' && (
                                        <>
                                            {' · '}
                                            Refund:{' '}
                                            {String(
                                                order.refundStatus
                                            ).toUpperCase()}
                                        </>
                                    )}
                            </div>

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                aria-expanded={
                                    expandedOrderId === order._id
                                }
                                onClick={() =>
                                    setExpandedOrderId(
                                        expandedOrderId === order._id
                                            ? ''
                                            : order._id
                                    )
                                }
                            >
                                {expandedOrderId === order._id
                                    ? 'Hide Details'
                                    : 'View Details'}
                            </button>
                        </div>

                        {expandedOrderId === order._id && (
                            <div className="mt-3">
                        <hr />

                        <h6>Customer</h6>

                        <p className="mb-1">
                            <strong>Name:</strong>{' '}
                            {order.customerFullName ||
                                order.userId?.fullName ||
                                'Unknown'}
                        </p>

                        <p className="mb-1">
                            <strong>Email:</strong>{' '}
                            {order.customerEmail ||
                                order.userId?.email ||
                                'Not available'}
                        </p>

                        <p className="mb-3">
                            <strong>Phone:</strong>{' '}
                            {order.customerPhoneNumber ||
                                order.userId?.phoneNumber ||
                                'Not available'}
                        </p>

                        {order.orderType === 'delivery' && (
                            <>
                                <h6>Delivery</h6>

                                <p className="mb-1">
                                    {order.deliveryAddress}
                                    {order.deliveryPostcode
                                        ? `, ${order.deliveryPostcode}`
                                        : ''}
                                </p>

                                {order.deliveryPhoneNumber && (
                                    <p className="mb-1">
                                        <strong>
                                            Delivery phone:
                                        </strong>{' '}
                                        {order.deliveryPhoneNumber}
                                    </p>
                                )}

                                <p className="mb-3">
                                    <strong>
                                        Driving distance:
                                    </strong>{' '}
                                    {Number(
                                        order.drivingDistanceMiles || 0
                                    ).toFixed(2)}{' '}
                                    miles
                                </p>
                            </>
                        )}

                        {order.allergyInformation && (
                            <div className="alert alert-danger">
                                <strong>
                                    ALLERGY INFORMATION
                                </strong>
                                <br />
                                {order.allergyInformation}
                            </div>
                        )}

                        {order.specialRequests && (
                            <div className="mb-3">
                                <strong>
                                    Special Requests
                                </strong>
                                <p className="mb-0">
                                    {order.specialRequests}
                                </p>
                            </div>
                        )}

                        <hr />

                        <h6>Items</h6>

                        <div className="border rounded mb-3">
                            {(order.items || []).map(
                                (item, index) => (
                                    <div
                                        key={`${item.dishId}-${index}`}
                                        className={`p-3 ${
                                            index <
                                            order.items.length - 1
                                                ? 'border-bottom'
                                                : ''
                                        }`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-start gap-2">
                                                    <strong className="text-nowrap">
                                                        {item.dishId}
                                                    </strong>

                                                    <strong>
                                                        {item.name}
                                                    </strong>
                                                </div>

                                                {item.rice && (
                                                    <div className="text-muted ms-4 mt-1">
                                                        {item.rice}
                                                    </div>
                                                )}

                                                <div className="text-muted ms-4 mt-1">
                                                    Quantity:{' '}
                                                    {item.quantity}
                                                </div>
                                            </div>

                                            <strong className="text-nowrap">
                                                £
                                                {(
                                                    Number(
                                                        item.price || 0
                                                    ) *
                                                    Number(
                                                        item.quantity || 0
                                                    )
                                                ).toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Food subtotal</span>
                            <span>
                                £
                                {Number(
                                    order.subtotal || 0
                                ).toFixed(2)}
                            </span>
                        </div>

                        {order.orderType === 'delivery' && (
                            <div className="d-flex justify-content-between">
                                <span>Delivery</span>
                                <span>
                                    £
                                    {Number(
                                        order.deliveryFee || 0
                                    ).toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-2">
                            <strong>Total</strong>
                            <strong>
                                £
                                {Number(
                                    order.total || 0
                                ).toFixed(2)}
                            </strong>
                        </div>

                        <hr />

                        <p className="mb-1">
                            <strong>Payment:</strong>{' '}
                            {String(
                                order.paymentStatus || 'not paid'
                            ).toUpperCase()}
                        </p>

                        <p className="mb-0">
                            <strong>Refund:</strong>{' '}
                            {getRefundText(order)}
                        </p>

                        {order.refundedAt &&
                            order.refundStatus !== 'none' && (
                                <div className="text-muted mt-1">
                                    Refunded:{' '}
                                    {formatDateTime(
                                        order.refundedAt
                                    )}
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrders;
