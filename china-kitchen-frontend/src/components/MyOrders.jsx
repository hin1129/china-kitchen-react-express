import React, {
    useEffect,
    useState
} from 'react';

import axios
    from 'axios';

import {
    Link
} from 'react-router-dom';


const MyOrders = () => {

    const [
        orders,
        setOrders
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        error,
        setError
    ] =
        useState('');


    useEffect(() => {

        const fetchOrders =
            async () => {

                try {

                    const response =
                        await axios.get(

                            'http://localhost:8000/orders/my',

                            {
                                withCredentials:
                                    true
                            }

                        );


                    setOrders(

                        Array.isArray(
                            response.data.orders
                        )

                            ? response.data.orders

                            : []

                    );

                }

                catch (error) {

                    console.error(
                        'Get my orders error:',
                        error
                    );


                    setError(

                        error.response
                            ?.data
                            ?.message ||

                        'Failed to load your orders'

                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            };


        fetchOrders();

    }, []);


    const formatRequestedTime =
        order => {

            if (
                order.fulfilmentType ===
                'asap'
            ) {

                return 'As soon as possible';

            }


            if (
                !order.requestedTime
            ) {

                return 'Not specified';

            }


            return new Date(
                order.requestedTime
            )
                .toLocaleString(
                    'en-GB',
                    {
                        dateStyle:
                            'medium',

                        timeStyle:
                            'short'
                    }
                );

        };


    if (
        loading
    ) {

        return (

            <div className="container mt-4">

                <p>
                    Loading orders...
                </p>

            </div>

        );

    }


    return (

        <div className="container mt-4">

            <h2>
                My Orders
            </h2>


            {
                error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )
            }


            {
                orders.length ===
                    0

                    ? (

                        <p>
                            You have no orders.
                        </p>

                    )

                    : (

                        orders.map(
                            order => (

                                <div

                                    key={
                                        order._id
                                    }

                                    className="card mb-3"

                                >

                                    <div className="card-body">

                                        <h5>

                                            Order{' '}

                                            {
                                                order._id
                                            }

                                        </h5>


                                        <p>

                                            <strong>
                                                Placed:
                                            </strong>{' '}

                                            {
                                                new Date(
                                                    order.createdAt
                                                )
                                                    .toLocaleString(
                                                        'en-GB'
                                                    )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Type:
                                            </strong>{' '}

                                            {
                                                order.orderType ===
                                                    'delivery'

                                                    ? 'Delivery'

                                                    : 'Collection'
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Requested Time:
                                            </strong>{' '}

                                            {
                                                formatRequestedTime(
                                                    order
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Payment:
                                            </strong>{' '}

                                            {
                                                order.paymentStatus ||
                                                'pending'
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Total:
                                            </strong>{' '}

                                            £{
                                                Number(
                                                    order.total ||
                                                    0
                                                )
                                                    .toFixed(2)
                                            }

                                        </p>


                                        <Link

                                            to={
                                                `/order-confirmation/${order._id}`
                                            }

                                            className="btn btn-outline-primary"

                                        >

                                            View Order

                                        </Link>

                                    </div>

                                </div>

                            )
                        )

                    )
            }

        </div>

    );

};


export default MyOrders;