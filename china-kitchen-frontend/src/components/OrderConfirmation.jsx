import React, {
    useEffect,
    useState
} from 'react';

import axios
    from 'axios';

import {
    Link,
    useLocation,
    useParams
} from 'react-router-dom';

import {
    Alert
} from 'react-bootstrap';


const OrderConfirmation = ({
    logInState
}) => {

    const {
        id
    } =
        useParams();


    const location =
        useLocation();


    const [
        order,
        setOrder
    ] =
        useState(

            location.state
                ?.order ||

            null

        );


    const [
        loading,
        setLoading
    ] =
        useState(

            !location.state
                ?.order

        );


    const [
        error,
        setError
    ] =
        useState('');


    useEffect(() => {

        if (
            location.state
                ?.order
        ) {

            setLoading(
                false
            );

            return;

        }


        if (
            !logInState
        ) {

            setError(
                'This order confirmation is no longer available.'
            );

            setLoading(
                false
            );

            return;

        }


        const fetchOrder =
            async () => {

                try {

                    const response =
                        await axios.get(

                            `http://localhost:8000/orders/${id}`,

                            {
                                withCredentials:
                                    true
                            }

                        );


                    setOrder(
                        response.data.order
                    );

                }

                catch (error) {

                    console.error(
                        'Get order error:',
                        error
                    );


                    setError(

                        error.response
                            ?.data
                            ?.message ||

                        'Failed to load order'

                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            };


        fetchOrder();

    }, [
        id,
        logInState,
        location.state
    ]);


    if (
        loading
    ) {

        return (

            <div className="container mt-4">

                <p>
                    Loading order...
                </p>

            </div>

        );

    }


    if (
        error
    ) {

        return (

            <div className="container mt-4">

                <Alert variant="danger">
                    {error}
                </Alert>

            </div>

        );

    }


    if (
        !order
    ) {

        return (

            <div className="container mt-4">

                <Alert variant="warning">
                    Order not found.
                </Alert>

            </div>

        );

    }


    const items =
        Array.isArray(
            order.items
        )

            ? order.items

            : [];


    const requestedTimeText =

        order.fulfilmentType ===
            'asap'

            ? 'As soon as possible'

            : order.requestedTime

                ? new Date(
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
                    )

                : 'Not specified';


    return (

        <div className="container mt-4">

            <h2>
                Order Confirmation
            </h2>


            <Alert variant="success">

                Your order has been submitted.

            </Alert>


            <p>

                <strong>
                    Order ID:
                </strong>{' '}

                {
                    order._id
                }

            </p>


            <p>

                <strong>
                    Order Type:
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
                    requestedTimeText
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


            {
                order.orderType ===
                'delivery' && (

                    <>

                        <hr />


                        <h4>
                            Delivery
                        </h4>


                        <p>

                            {
                                order.deliveryAddress
                            }

                            <br />

                            {
                                order.deliveryPostcode
                            }

                        </p>


                        <p>

                            Phone:{' '}

                            {
                                order.deliveryPhoneNumber
                            }

                        </p>


                        <p>

                            Driving distance:{' '}

                            {
                                Number(
                                    order.drivingDistanceMiles ||
                                    0
                                )
                                    .toFixed(2)
                            }

                            {' miles'}

                        </p>

                    </>

                )
            }


            {
                order.allergyInformation && (

                    <Alert variant="danger">

                        <strong>
                            ALLERGY INFORMATION
                        </strong>

                        <br />

                        {
                            order.allergyInformation
                        }

                    </Alert>

                )
            }


            {
                order.specialRequests && (

                    <div className="mb-3">

                        <strong>
                            Special Requests
                        </strong>

                        <p>
                            {
                                order.specialRequests
                            }
                        </p>

                    </div>

                )
            }


            <hr />


            <h4>
                Items
            </h4>


            <ul>

                {
                    items.map(
                        (
                            item,
                            index
                        ) => (

                            <li
                                key={
                                    item._id ||
                                    `${item.dishId}-${index}`
                                }
                            >

                                {
                                    item.quantity
                                }

                                {' × '}

                                {
                                    item.name
                                }


                                {
                                    item.rice &&
                                    ` + ${item.rice}`
                                }


                                {' — £'}

                                {
                                    (
                                        Number(
                                            item.price ||
                                            0
                                        ) *

                                        Number(
                                            item.quantity ||
                                            0
                                        )
                                    )
                                        .toFixed(2)
                                }

                            </li>

                        )
                    )
                }

            </ul>


            <p>

                Food:{' £'}

                {
                    Number(
                        order.subtotal ||
                        0
                    )
                        .toFixed(2)
                }

            </p>


            {
                order.orderType ===
                'delivery' && (

                    <p>

                        Delivery:{' £'}

                        {
                            Number(
                                order.deliveryFee ||
                                0
                            )
                                .toFixed(2)
                        }

                    </p>

                )
            }


            <h4>

                Total:{' £'}

                {
                    Number(
                        order.total ||
                        0
                    )
                        .toFixed(2)
                }

            </h4>


            {
                logInState && (

                    <Link

                        to="/my-orders"

                        className="btn btn-primary mt-3"

                    >

                        View My Orders

                    </Link>

                )
            }

        </div>

    );

};


export default OrderConfirmation;