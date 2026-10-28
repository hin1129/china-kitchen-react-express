// import React, { useState } from "react";
// import { Table, Button } from "react-bootstrap";
// import axios from "axios";

// // retrieve data from Takeaway
// const ShoppingCart = ({ cartItems, setCartItems }) => {
//     // delivery options
//     const [orderType, setOrderType] = useState("collection")

//     const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     const handleCheckout = async () => {
//         try {
//             const response = await axios.post('http://localhost:8000/order', {
//                 items: cartItems,
//                 subtotal: Number(totalPrice.toFixed(2)),
//                 orderType
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('Token')}`
//                 }
//             })
//             console.log(response.data);
//             alert('Order submitted successfully!');
//             setCartItems([]);
//         }
//         catch (error) {
//             console.error(error.message);
//             alert('Order submitted unsuccessfully!');
//         }
//     }

//     return (
//         <div className="mt-5">
//             <h3>Cart Items</h3>

//             {cartItems.length === 0 ? (
//                 <p>Your cartItems is empty</p>
//             ) : (
//                 <>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Dish</th>
//                                 <th>Quantity</th>
//                                 <th>Price</th>
//                                 <th>Subtotal</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {cartItems.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.dishId}</td>
//                                     <td>{item.name}</td>
//                                     <td>{item.quantity}</td>
//                                     <td>£{item.price.toFixed(2)}</td>
//                                     <td>£{(item.price * item.quantity).toFixed(2)}</td>
//                                 </tr>
//                             ))}

//                             <tr>
//                                 <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
//                                 <td style={{ fontWeight: 'bold' }}>£{totalPrice.toFixed(2)}</td>
//                             </tr>
//                         </tbody>
//                     </Table>

//                     <div className="mb-3">
//                         <label>
//                             <input
//                                 type="radio"
//                                 name="orderType"
//                                 value="collection"
//                                 checked={orderType === "collection"}
//                                 onChange={(e) => setOrderType(e.target.value)}
//                             />
//                             Collection
//                         </label>

//                         <label style={{ marginLeft: "50px" }}>
//                             <input
//                                 type="radio"
//                                 name="orderType"
//                                 value="delivery"
//                                 checked={orderType === "delivery"}
//                                 onChange={(e) => setOrderType(e.target.value)}
//                             />
//                             Delivery
//                         </label>
//                     </div>

//                     <Button
//                         variant="success"
//                         onClick={handleCheckout}
//                         disabled={cartItems.length === 0}
//                         className="mt-3 w-100"
//                     >
//                         Checkout
//                     </Button>
//                 </>
//             )
//             }
//         </div >
//     );
// };

// export default ShoppingCart;



import React, {
    useEffect,
    useRef,
    useState
} from 'react';

import axios
    from 'axios';

import {
    useNavigate
} from 'react-router-dom';

import {
    Alert,
    Button,
    Form,
    Spinner
} from 'react-bootstrap';


const ShoppingCart = ({
    cartItems,
    setCartItems,
    logInState
}) => {

    const navigate =
        useNavigate();


    const addressNowStarted =
        useRef(false);


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
    // GUEST DETAILS
    // =====================================

    const [
        guestDetails,
        setGuestDetails
    ] =
        useState({

            fullName:
                '',

            email:
                '',

            phoneNumber:
                '',

            deliveryAddress: {

                addressLine1:
                    '',

                addressLine2:
                    '',

                city:
                    '',

                postcode:
                    ''

            }

        });


    // =====================================
    // GUEST INPUT
    // =====================================

    const handleGuestChange =
        event => {

            const {
                name,
                value
            } =
                event.target;


            setGuestDetails(
                previous => ({

                    ...previous,

                    [name]:
                        value

                })
            );

        };


    const handleGuestAddressChange =
        event => {

            const {
                name,
                value
            } =
                event.target;


            setGuestDetails(
                previous => ({

                    ...previous,

                    deliveryAddress: {

                        ...previous
                            .deliveryAddress,

                        [name]:
                            value

                    }

                })
            );


            setDeliveryQuote(
                null
            );

        };


    // =====================================
    // ADDRESSNOW FOR GUEST
    // =====================================

    useEffect(() => {

        if (
            logInState ||
            addressNowStarted.current
        ) {

            return;

        }


        if (
            !window.pca
        ) {

            return;

        }


        const searchElement =
            document.getElementById(
                'guest-address-search'
            );


        if (
            !searchElement
        ) {

            return;

        }


        addressNowStarted.current =
            true;


        const fields = [

            {
                element:
                    'guest-address-search',

                field:
                    '',

                mode:
                    window.pca
                        .fieldMode
                        .SEARCH
            },

            {
                element:
                    'guest-address-line-1',

                field:
                    'Line1',

                mode:
                    window.pca
                        .fieldMode
                        .POPULATE
            },

            {
                element:
                    'guest-address-line-2',

                field:
                    'Line2',

                mode:
                    window.pca
                        .fieldMode
                        .POPULATE
            },

            {
                element:
                    'guest-city',

                field:
                    'City',

                mode:
                    window.pca
                        .fieldMode
                        .POPULATE
            },

            {
                element:
                    'guest-postcode',

                field:
                    'PostalCode',

                mode:
                    window.pca
                        .fieldMode
                        .POPULATE
            }

        ];


        const options = {

            key:
                process.env
                    .REACT_APP_ADDRESSNOW_KEY,

            countries: {

                codesList:
                    'GBR'

            },

            manualEntry:
                true

        };


        const control =
            new window.pca.Address(

                fields,

                options

            );


        control.listen(

            'populate',

            address => {

                setGuestDetails(
                    previous => ({

                        ...previous,

                        deliveryAddress: {

                            addressLine1:
                                address.Line1 ||
                                '',

                            addressLine2:
                                address.Line2 ||
                                '',

                            city:
                                address.City ||
                                '',

                            postcode:
                                String(
                                    address.PostalCode ||
                                    ''
                                )
                                    .toUpperCase()

                        }

                    })
                );


                setDeliveryQuote(
                    null
                );

            }

        );

    }, [
        logInState
    ]);


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
            'delivery'
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


        // For guests, wait until
        // address has been entered.
        if (
            !logInState &&
            (
                !guestDetails
                    .deliveryAddress
                    .addressLine1 ||

                !guestDetails
                    .deliveryAddress
                    .city ||

                !guestDetails
                    .deliveryAddress
                    .postcode
            )
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
                                        cartItems,

                                    guestDetails:
                                        logInState
                                            ? undefined
                                            : guestDetails

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

        logInState,

        guestDetails

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

                        'http://localhost:8000/order',

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

                            specialRequests,

                            guestDetails:

                                logInState

                                    ? undefined

                                    : guestDetails

                        },

                        {
                            withCredentials:
                                true
                        }

                    );


                const order =
                    response
                        .data
                        .order;


                setCartItems(
                    []
                );


                localStorage.removeItem(
                    'TakeawayCart'
                );


                navigate(

                    `/order-confirmation/${order._id}`,

                    {
                        state: {
                            order
                        }
                    }

                );

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

                    'Order could not be submitted'

                );

            }

            finally {

                setCheckoutLoading(
                    false
                );

            }

        };


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
                                cartItems.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div

                                            key={
                                                `${item.dishId}-${item.rice || 'none'}-${index}`
                                            }

                                            className="border rounded p-3 mb-2"

                                        >

                                            <strong>
                                                {item.name}
                                            </strong>


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

                                                                index,

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
                                                            index
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
                                GUEST DETAILS
                            ========================= */}

                            {
                                !logInState && (

                                    <div className="mt-4">

                                        <h4>
                                            Your Details
                                        </h4>


                                        <Form.Group className="mb-3">

                                            <Form.Label>
                                                Full Name
                                            </Form.Label>

                                            <Form.Control

                                                name="fullName"

                                                value={
                                                    guestDetails.fullName
                                                }

                                                onChange={
                                                    handleGuestChange
                                                }

                                            />

                                        </Form.Group>


                                        <Form.Group className="mb-3">

                                            <Form.Label>
                                                Email
                                            </Form.Label>

                                            <Form.Control

                                                type="email"

                                                name="email"

                                                value={
                                                    guestDetails.email
                                                }

                                                onChange={
                                                    handleGuestChange
                                                }

                                            />

                                        </Form.Group>


                                        <Form.Group className="mb-3">

                                            <Form.Label>
                                                Phone Number
                                            </Form.Label>

                                            <Form.Control

                                                name="phoneNumber"

                                                value={
                                                    guestDetails.phoneNumber
                                                }

                                                onChange={
                                                    handleGuestChange
                                                }

                                            />

                                        </Form.Group>


                                        {
                                            orderType ===
                                            'delivery' && (

                                                <>

                                                    <h5>
                                                        Delivery Address
                                                    </h5>


                                                    <Form.Group className="mb-3">

                                                        <Form.Label>
                                                            Find Address
                                                        </Form.Label>

                                                        <Form.Control
                                                            id="guest-address-search"
                                                        />

                                                    </Form.Group>


                                                    <Form.Group className="mb-3">

                                                        <Form.Label>
                                                            Address Line 1
                                                        </Form.Label>

                                                        <Form.Control

                                                            id="guest-address-line-1"

                                                            name="addressLine1"

                                                            value={
                                                                guestDetails
                                                                    .deliveryAddress
                                                                    .addressLine1
                                                            }

                                                            onChange={
                                                                handleGuestAddressChange
                                                            }

                                                        />

                                                    </Form.Group>


                                                    <Form.Group className="mb-3">

                                                        <Form.Label>
                                                            Address Line 2
                                                        </Form.Label>

                                                        <Form.Control

                                                            id="guest-address-line-2"

                                                            name="addressLine2"

                                                            value={
                                                                guestDetails
                                                                    .deliveryAddress
                                                                    .addressLine2
                                                            }

                                                            onChange={
                                                                handleGuestAddressChange
                                                            }

                                                        />

                                                    </Form.Group>


                                                    <Form.Group className="mb-3">

                                                        <Form.Label>
                                                            City
                                                        </Form.Label>

                                                        <Form.Control

                                                            id="guest-city"

                                                            name="city"

                                                            value={
                                                                guestDetails
                                                                    .deliveryAddress
                                                                    .city
                                                            }

                                                            onChange={
                                                                handleGuestAddressChange
                                                            }

                                                        />

                                                    </Form.Group>


                                                    <Form.Group className="mb-3">

                                                        <Form.Label>
                                                            Postcode
                                                        </Form.Label>

                                                        <Form.Control

                                                            id="guest-postcode"

                                                            name="postcode"

                                                            value={
                                                                guestDetails
                                                                    .deliveryAddress
                                                                    .postcode
                                                            }

                                                            onChange={
                                                                handleGuestAddressChange
                                                            }

                                                        />

                                                    </Form.Group>

                                                </>

                                            )
                                        }

                                    </div>

                                )
                            }


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

                                    orderingInfoLoading ||

                                    deliveryLoading ||

                                    (
                                        fulfilmentType ===
                                        'scheduled' &&

                                        !requestedTime
                                    ) ||

                                    (
                                        orderType ===
                                        'delivery' &&

                                        !deliveryQuote
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