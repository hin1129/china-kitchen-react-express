import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';

const ShoppingCart = ({ cartItems, setCartItems, logInState }) => {

    const navigate = useNavigate();

    // =====================================
    // ORDER TYPE
    // =====================================

    const [
        orderType,
        setOrderType
    ] =
        useState(
            'collection'
        );


    // =====================================
    // ORDER TIME
    // =====================================

    const [
        fulfilmentType,
        setFulfilmentType
    ] =
        useState(
            'asap'
        );


    const [
        requestedTime,
        setRequestedTime
    ] =
        useState('');


    const [
        orderingInfo,
        setOrderingInfo
    ] =
        useState(null);


    const [
        orderingInfoLoading,
        setOrderingInfoLoading
    ] =
        useState(false);


    // =====================================
    // NOTES
    // =====================================

    const [
        allergyInformation,
        setAllergyInformation
    ] =
        useState('');


    const [
        specialRequests,
        setSpecialRequests
    ] =
        useState('');


    // =====================================
    // DELIVERY
    // =====================================

    const [
        deliveryQuote,
        setDeliveryQuote
    ] =
        useState(null);


    const [
        deliveryLoading,
        setDeliveryLoading
    ] =
        useState(false);


    // =====================================
    // CHECKOUT
    // =====================================

    const [
        checkoutLoading,
        setCheckoutLoading
    ] =
        useState(false);


    const [
        error,
        setError
    ] =
        useState('');


    // =====================================
    // GET ORDERING INFORMATION
    // =====================================

    useEffect(() => {

        const fetchOrderingInfo =
            async () => {

                try {

                    setOrderingInfoLoading(
                        true
                    );


                    const response =
                        await axios.get(

                            'http://localhost:8000/ordering-info',

                            {
                                params: {
                                    orderType
                                }
                            }

                        );


                    const info =
                        response.data;


                    setOrderingInfo(
                        info
                    );


                    // If currently closed,
                    // ASAP is impossible.
                    if (
                        !info.asapAvailable
                    ) {

                        setFulfilmentType(
                            'scheduled'
                        );


                        setRequestedTime(

                            info.timeSlots?.[0] ||
                            ''

                        );

                    }

                    else if (
                        fulfilmentType ===
                        'scheduled' &&

                        !requestedTime
                    ) {

                        setRequestedTime(

                            info.timeSlots?.[0] ||
                            ''

                        );

                    }

                }

                catch (error) {

                    console.error(
                        'Ordering info error:',
                        error
                    );

                }

                finally {

                    setOrderingInfoLoading(
                        false
                    );

                }

            };


        fetchOrderingInfo();

    }, [
        orderType
    ]);


    // =====================================
    // AUTOMATIC DELIVERY QUOTE
    // =====================================

    useEffect(() => {

        if (
            orderType !==
            'delivery' ||
            !logInState
        ) {

            setDeliveryQuote(
                null
            );

            return;

        }


        if (
            !cartItems ||
            cartItems.length ===
            0
        ) {

            setDeliveryQuote(
                null
            );

            return;

        }


        // Debounce so changing quantity does
        // not instantly fire several AWS calls.
        const timer =
            setTimeout(
                async () => {

                    try {

                        setDeliveryLoading(
                            true
                        );


                        setError('');


                        const response =
                            await axios.post(

                                'http://localhost:8000/delivery/quote',

                                {

                                    items:
                                        cartItems

                                },

                                {
                                    withCredentials:
                                        true
                                }

                            );


                        setDeliveryQuote(
                            response.data
                        );

                    }

                    catch (error) {

                        console.error(
                            'Automatic delivery quote error:',
                            error
                        );


                        setDeliveryQuote(
                            null
                        );


                        const code =
                            error.response
                                ?.data
                                ?.code;


                        if (
                            code ===
                            'DELIVERY_PROFILE_INVALID'
                        ) {

                            setError(
                                'Please complete your delivery address in your profile.'
                            );

                            return;

                        }


                        setError(

                            error.response
                                ?.data
                                ?.message ||

                            'Unable to calculate delivery'

                        );

                    }

                    finally {

                        setDeliveryLoading(
                            false
                        );

                    }

                },

                500
            );


        return () =>
            clearTimeout(
                timer
            );

    }, [

        orderType,

        cartItems,

        logInState

    ]);


    // =====================================
    // CHANGE ORDER TYPE
    // =====================================

    const handleOrderTypeChange =
        event => {

            const value =
                event.target.value;


            setOrderType(
                value
            );


            setDeliveryQuote(
                null
            );


            setRequestedTime(
                ''
            );


            setError('');

        };


    // =====================================
    // QUANTITY
    // =====================================

    const handleCartQuantityChange =
        (
            index,
            newQuantity
        ) => {

            const quantity =
                Number(
                    newQuantity
                );


            if (
                quantity <
                1
            ) {

                return;

            }


            setCartItems(
                previousItems =>

                    previousItems.map(
                        (
                            item,
                            itemIndex
                        ) =>

                            itemIndex ===
                                index

                                ? {
                                    ...item,
                                    quantity
                                }

                                : item

                    )
            );


            setDeliveryQuote(
                null
            );

        };


    // =====================================
    // REMOVE
    // =====================================

    const handleRemoveItem =
        index => {

            setCartItems(
                previousItems =>

                    previousItems.filter(
                        (
                            _,
                            itemIndex
                        ) =>

                            itemIndex !==
                            index

                    )
            );


            setDeliveryQuote(
                null
            );

        };


    // =====================================
    // SUBTOTAL DISPLAY ONLY
    // =====================================

    const frontendSubtotal =
        cartItems.reduce(
            (
                total,
                item
            ) =>

                total +
                (
                    Number(
                        item.price ||
                        0
                    ) *

                    Number(
                        item.quantity ||
                        0
                    )
                ),

            0
        );


    // =====================================
    // CHECKOUT
    // =====================================

    const handleCheckout =
        async () => {

            try {

                setError('');


                if (
                    !logInState
                ) {

                    localStorage.setItem(
                        'TakeawayCart',
                        JSON.stringify(
                            cartItems
                        )
                    );

                    navigate(
                        '/signin',
                        {
                            state: {
                                returnTo:
                                    '/takeaway'
                            }
                        }
                    );

                    return;

                }


                if (
                    !cartItems.length
                ) {

                    setError(
                        'Your cart is empty'
                    );

                    return;

                }


                if (
                    fulfilmentType ===
                    'scheduled' &&

                    !requestedTime
                ) {

                    setError(
                        'Please select your requested time'
                    );

                    return;

                }


                if (
                    logInState &&

                    orderType ===
                    'delivery' &&

                    !deliveryQuote
                ) {

                    setError(
                        'Please wait for the delivery charge to be calculated.'
                    );

                    return;

                }


                if (
                    allergyInformation.length >
                    500
                ) {

                    setError(
                        'Allergy information must be 500 characters or fewer'
                    );

                    return;

                }


                if (
                    specialRequests.length >
                    500
                ) {

                    setError(
                        'Special requests must be 500 characters or fewer'
                    );

                    return;

                }


                setCheckoutLoading(
                    true
                );


                const response =
                    await axios.post(

                        'http://localhost:8000/checkout/session',

                        {

                            items:
                                cartItems,

                            orderType,

                            fulfilmentType,

                            requestedTime:

                                fulfilmentType ===
                                    'scheduled'

                                    ? requestedTime

                                    : null,

                            allergyInformation,

                            specialRequests

                        },

                        {
                            withCredentials:
                                true
                        }

                    );


                const checkoutUrl =
                    response
                        .data
                        .checkoutUrl;


                if (
                    !checkoutUrl
                ) {

                    throw new Error(
                        'Stripe checkout URL was not returned'
                    );

                }


                // Do NOT clear the cart here.
                // The customer has not paid yet.
                // Keep the cart until Stripe confirms payment.
                window.location.href =
                    checkoutUrl;

            }

            catch (error) {

                console.error(
                    'Checkout error:',
                    error
                );


                const code =
                    error.response
                        ?.data
                        ?.code;


                if (
                    code ===
                    'DELIVERY_PROFILE_INVALID'
                ) {

                    navigate(

                        '/profile?deliveryRequired=true&returnTo=/takeaway'

                    );

                    return;

                }


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    'Unable to start payment'

                );

            }

            finally {

                setCheckoutLoading(
                    false
                );

            }

        };


    // =====================================
    // SORT CART BY DISH ID
    // =====================================

    const sortedCartItems =
        cartItems
            .map(
                (
                    item,
                    originalIndex
                ) => ({
                    item,
                    originalIndex
                })
            )
            .sort(
                (
                    first,
                    second
                ) => {

                    const firstId =
                        Number(
                            first.item.dishId
                        );

                    const secondId =
                        Number(
                            second.item.dishId
                        );

                    if (
                        Number.isFinite(firstId) &&
                        Number.isFinite(secondId)
                    ) {
                        return firstId - secondId;
                    }

                    return String(
                        first.item.dishId
                    ).localeCompare(
                        String(
                            second.item.dishId
                        ),
                        undefined,
                        {
                            numeric: true
                        }
                    );
                }
            );


    // =====================================
    // DISPLAY TIME
    // =====================================

    const formatTime =
        isoString => {

            return new Date(
                isoString
            )
                .toLocaleTimeString(
                    'en-GB',
                    {
                        hour:
                            '2-digit',

                        minute:
                            '2-digit'
                    }
                );

        };


    return (

        <div className="mt-5">

            <h3>
                Cart Items
            </h3>


            {
                error && (

                    <Alert variant="danger">

                        {error}

                    </Alert>

                )
            }


            {
                cartItems.length ===
                    0

                    ? (

                        <p>
                            Your cart is empty
                        </p>

                    )

                    : (

                        <>

                            {
                                sortedCartItems.map(
                                    ({
                                        item,
                                        originalIndex
                                    }) => (

                                        <div

                                            key={
                                                `${item.dishId}-${item.rice || 'none'}-${originalIndex}`
                                            }

                                            className="border rounded p-3 mb-2"

                                        >

                                            <div>
                                                <strong>
                                                    ID: {item.dishId}
                                                </strong>
                                            </div>

                                            <div>
                                                <strong>
                                                    {item.name}
                                                </strong>
                                            </div>


                                            {
                                                item.rice && (

                                                    <div>
                                                        Rice: {item.rice}
                                                    </div>

                                                )
                                            }


                                            <div className="mt-2">

                                                <Form.Label>
                                                    Quantity
                                                </Form.Label>


                                                <Form.Control

                                                    type="number"

                                                    min="1"

                                                    value={
                                                        item.quantity
                                                    }

                                                    onChange={
                                                        event =>

                                                            handleCartQuantityChange(

                                                                originalIndex,

                                                                event.target.value

                                                            )
                                                    }

                                                />

                                            </div>


                                            <div className="mt-2">

                                                £{

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

                                            </div>


                                            <Button

                                                variant="danger"

                                                className="mt-2"

                                                onClick={
                                                    () =>
                                                        handleRemoveItem(
                                                            originalIndex
                                                        )
                                                }

                                            >

                                                Remove

                                            </Button>

                                        </div>

                                    )
                                )
                            }


                            <hr />


                            <h4>
                                Order Type
                            </h4>


                            <Form.Check

                                type="radio"

                                name="orderType"

                                value="collection"

                                label="Collection"

                                checked={
                                    orderType ===
                                    'collection'
                                }

                                onChange={
                                    handleOrderTypeChange
                                }

                            />


                            <Form.Check

                                type="radio"

                                name="orderType"

                                value="delivery"

                                label="Delivery"

                                checked={
                                    orderType ===
                                    'delivery'
                                }

                                onChange={
                                    handleOrderTypeChange
                                }

                            />


                            {/* =========================
                                AUTOMATIC DELIVERY
                            ========================= */}

                            {
                                orderType ===
                                'delivery' && (

                                    <div className="mt-4">

                                        <h4>
                                            Delivery
                                        </h4>


                                        {
                                            deliveryLoading && (

                                                <p>

                                                    <Spinner
                                                        size="sm"
                                                        animation="border"
                                                    />

                                                    {' '}
                                                    Calculating delivery...

                                                </p>

                                            )
                                        }


                                        {
                                            deliveryQuote && (

                                                <Alert variant="info">

                                                    <div>

                                                        Delivering to:

                                                        {' '}

                                                        {
                                                            deliveryQuote.address
                                                        }

                                                        {' '}

                                                        {
                                                            deliveryQuote.postcode
                                                        }

                                                    </div>


                                                    <div>

                                                        Distance:

                                                        {' '}

                                                        {
                                                            Number(
                                                                deliveryQuote.distanceMiles
                                                            )
                                                                .toFixed(2)
                                                        }

                                                        {' miles'}

                                                    </div>


                                                    <div>

                                                        Delivery fee:

                                                        {' £'}

                                                        {
                                                            Number(
                                                                deliveryQuote.deliveryFee
                                                            )
                                                                .toFixed(2)
                                                        }

                                                    </div>

                                                </Alert>

                                            )
                                        }

                                    </div>

                                )
                            }


                            {/* =========================
                                TIME
                            ========================= */}

                            <hr />


                            <h4>
                                When would you like it?
                            </h4>


                            {
                                orderingInfoLoading

                                    ? (

                                        <p>
                                            Loading available times...
                                        </p>

                                    )

                                    : (

                                        <>

                                            {
                                                orderingInfo &&
                                                !orderingInfo.openNow && (

                                                    <Alert variant="warning">

                                                        China Kitchen is currently closed.

                                                        {' '}

                                                        You can still place a preorder for an available time.

                                                    </Alert>

                                                )
                                            }


                                            <Form.Check

                                                type="radio"

                                                name="fulfilmentType"

                                                label="As soon as possible"

                                                value="asap"

                                                checked={
                                                    fulfilmentType ===
                                                    'asap'
                                                }

                                                disabled={
                                                    !orderingInfo
                                                        ?.asapAvailable
                                                }

                                                onChange={() => {

                                                    setFulfilmentType(
                                                        'asap'
                                                    );

                                                    setRequestedTime(
                                                        ''
                                                    );

                                                }}

                                            />


                                            <Form.Check

                                                type="radio"

                                                name="fulfilmentType"

                                                label="Choose a time"

                                                value="scheduled"

                                                checked={
                                                    fulfilmentType ===
                                                    'scheduled'
                                                }

                                                onChange={() => {

                                                    setFulfilmentType(
                                                        'scheduled'
                                                    );


                                                    setRequestedTime(

                                                        orderingInfo
                                                            ?.timeSlots
                                                        ?.[0] ||
                                                        ''

                                                    );

                                                }}

                                            />


                                            {
                                                fulfilmentType ===
                                                'scheduled' && (

                                                    <Form.Select

                                                        className="mt-2"

                                                        value={
                                                            requestedTime
                                                        }

                                                        onChange={
                                                            event =>
                                                                setRequestedTime(
                                                                    event.target.value
                                                                )
                                                        }

                                                    >

                                                        <option value="">
                                                            Select time
                                                        </option>


                                                        {
                                                            orderingInfo
                                                                ?.timeSlots
                                                                ?.map(
                                                                    slot => (

                                                                        <option

                                                                            key={
                                                                                slot
                                                                            }

                                                                            value={
                                                                                slot
                                                                            }

                                                                        >

                                                                            {
                                                                                formatTime(
                                                                                    slot
                                                                                )
                                                                            }

                                                                        </option>

                                                                    )
                                                                )
                                                        }

                                                    </Form.Select>

                                                )
                                            }

                                        </>

                                    )
                            }


                            {/* =========================
                                ALLERGIES
                            ========================= */}

                            <hr />


                            <Form.Group className="mb-3">

                                <Form.Label>

                                    <strong>
                                        Allergy Information
                                    </strong>

                                </Form.Label>


                                <Form.Control

                                    as="textarea"

                                    rows={3}

                                    maxLength={500}

                                    placeholder="Please tell us about any food allergies or intolerances."

                                    value={
                                        allergyInformation
                                    }

                                    onChange={
                                        event =>
                                            setAllergyInformation(
                                                event.target.value
                                            )
                                    }

                                />


                                <Form.Text>

                                    {
                                        allergyInformation.length
                                    }

                                    /500

                                </Form.Text>


                                <Alert
                                    variant="warning"
                                    className="mt-2"
                                >

                                    Please tell us about any allergies or intolerances before ordering.

                                </Alert>

                            </Form.Group>


                            {/* =========================
                                SPECIAL REQUEST
                            ========================= */}

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    <strong>
                                        Special Requests
                                    </strong>

                                </Form.Label>


                                <Form.Control

                                    as="textarea"

                                    rows={3}

                                    maxLength={500}

                                    placeholder="For example: no onions, sauce separately."

                                    value={
                                        specialRequests
                                    }

                                    onChange={
                                        event =>
                                            setSpecialRequests(
                                                event.target.value
                                            )
                                    }

                                />


                                <Form.Text>

                                    {
                                        specialRequests.length
                                    }

                                    /500

                                </Form.Text>

                            </Form.Group>


                            {/* =========================
                                TOTAL
                            ========================= */}

                            <hr />


                            <p>

                                Food:

                                {' £'}

                                {
                                    Number(

                                        deliveryQuote
                                            ?.subtotal ??

                                        frontendSubtotal

                                    )
                                        .toFixed(2)
                                }

                            </p>


                            {
                                orderType ===
                                'delivery' && (

                                    <p>

                                        Delivery:

                                        {' £'}

                                        {
                                            Number(
                                                deliveryQuote
                                                    ?.deliveryFee ||
                                                0
                                            )
                                                .toFixed(2)
                                        }

                                    </p>

                                )
                            }


                            <h4>

                                Total:

                                {' £'}

                                {
                                    Number(

                                        orderType ===
                                            'delivery'

                                            ? (
                                                deliveryQuote
                                                    ?.total ??
                                                frontendSubtotal
                                            )

                                            : frontendSubtotal

                                    )
                                        .toFixed(2)
                                }

                            </h4>


                            <Button

                                variant="success"

                                className="mt-3 w-100"

                                onClick={
                                    handleCheckout
                                }
                                disabled={
                                    checkoutLoading ||
                                    (
                                        logInState &&
                                        (
                                            orderingInfoLoading ||
                                            deliveryLoading ||
                                            (
                                                fulfilmentType === 'scheduled' &&
                                                !requestedTime
                                            ) ||
                                            (
                                                orderType === 'delivery' &&
                                                !deliveryQuote
                                            )
                                        )
                                    )
                                }

                            >

                                {
                                    checkoutLoading

                                        ? 'Submitting Order...'

                                        : 'Checkout'
                                }

                            </Button>

                        </>

                    )
            }

        </div>

    );

};

export default ShoppingCart;