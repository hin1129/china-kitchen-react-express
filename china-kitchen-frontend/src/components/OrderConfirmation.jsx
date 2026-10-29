import React, {
    useEffect,
    useState
} from 'react';

import axios
    from 'axios';

import {
    Link,
    useParams,
    useSearchParams
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


    const [
        searchParams
    ] =
        useSearchParams();


    const token =
        searchParams.get(
            'token'
        ) || '';


    const [
        order,
        setOrder
    ] =
        useState(
            null
        );


    const [
        loading,
        setLoading
    ] =
        useState(
            true
        );


    const [
        error,
        setError
    ] =
        useState('');


    useEffect(() => {

        let cancelled =
            false;


        const wait =
            milliseconds =>
                new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            milliseconds
                        )
                );


        const fetchPaidOrder =
            async () => {

                if (
                    !id
                ) {

                    if (
                        !cancelled
                    ) {

                        setError(
                            'This order confirmation link is invalid.'
                        );

                        setLoading(
                            false
                        );

                    }

                    return;

                }


                // Stripe can redirect the browser a moment before
                // our webhook has finished marking the order as paid.
                // Retry briefly instead of showing a false error.
                const maximumAttempts =
                    8;


                for (
                    let attempt = 1;
                    attempt <= maximumAttempts;
                    attempt += 1
                ) {

                    try {

                        const response =
                            token

                                ? await axios.get(

                                    `http://localhost:8000/orders/public/${id}`,

                                    {
                                        params: {
                                            token
                                        }
                                    }

                                )

                                : await axios.get(

                                    `http://localhost:8000/orders/${id}`,

                                    {
                                        withCredentials:
                                            true
                                    }

                                );


                        if (
                            cancelled
                        ) {

                            return;

                        }


                        const paidOrder =
                            response.data.order;


                        setOrder(
                            paidOrder
                        );


                        // Only clear the cart after the backend has
                        // verified the token AND confirmed payment.
                        localStorage.removeItem(
                            'TakeawayCart'
                        );


                        // ShoppingCart state lives in Takeaway.jsx.
                        // This event lets Takeaway clear its in-memory
                        // cart if it is currently mounted.
                        window.dispatchEvent(
                            new Event(
                                'takeaway-cart-cleared'
                            )
                        );


                        setError(
                            ''
                        );

                        setLoading(
                            false
                        );

                        return;

                    }

                    catch (error) {

                        if (
                            cancelled
                        ) {

                            return;

                        }


                        const status =
                            error.response
                                ?.status;


                        // The public endpoint returns 404 while the
                        // order is still "not paid". Give the Stripe
                        // webhook a few seconds to finish.
                        if (
                            token &&
                            status === 404 &&
                            attempt < maximumAttempts
                        ) {

                            await wait(
                                1000
                            );

                            continue;

                        }


                        console.error(
                            'Get paid order error:',
                            error
                        );


                        setError(

                            error.response
                                ?.data
                                ?.message ||

                            'Unable to verify this paid order.'

                        );


                        setLoading(
                            false
                        );

                        return;

                    }

                }

            };


        fetchPaidOrder();


        return () => {

            cancelled =
                true;

        };

    }, [
        id,
        token
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

                Payment successful. Your order has been confirmed.

            </Alert>


            {
                order.refundStatus ===
                'full' && (

                    <Alert variant="warning">

                        <strong>
                            This order has been fully refunded.
                        </strong>

                        <br />

                        Refunded:{' £'}

                        {
                            Number(
                                order.refundedAmount ||
                                0
                            )
                                .toFixed(2)
                        }

                    </Alert>

                )
            }


            {
                order.refundStatus ===
                'partial' && (

                    <Alert variant="warning">

                        <strong>
                            This order has been partially refunded.
                        </strong>

                        <br />

                        Refunded so far:{' £'}

                        {
                            Number(
                                order.refundedAmount ||
                                0
                            )
                                .toFixed(2)
                        }

                    </Alert>

                )
            }


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