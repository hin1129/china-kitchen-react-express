import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';

const Profile = () => {

    const navigate = useNavigate();

    const location = useLocation();

    // const addressNowStarted = useRef(false);


    const query =
        new URLSearchParams(
            location.search
        );


    const deliveryRequired =
        query.get(
            'deliveryRequired'
        ) === 'true';


    const returnTo =
        query.get(
            'returnTo'
        );


    const [
        user,
        setUser
    ] = useState({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
        deliveryUdprn: null,
    });


    const [
        loading,
        setLoading
    ] = useState(
        true
    );


    const [
        saving,
        setSaving
    ] = useState(
        false
    );


    const [
        errors,
        setErrors
    ] = useState({});


    const [
        message,
        setMessage
    ] = useState('');

    const [
        addressSearch,
        setAddressSearch
    ] = useState('');

    const [
        addressSuggestions,
        setAddressSuggestions
    ] = useState([]);

    const [
        addressSearching,
        setAddressSearching
    ] = useState(false);

    const [
        addressSelecting,
        setAddressSelecting
    ] = useState(false);


    // =====================================
    // GET PROFILE
    // =====================================

    useEffect(() => {

        const fetchProfile =
            async () => {

                try {

                    const response =
                        await axios.get(
                            'http://localhost:8000/profile',
                            {
                                withCredentials:
                                    true
                            }
                        );


                    const userData =
                        response.data.userData;


                    setUser({

                        fullName:
                            userData.fullName || '',

                        username:
                            userData.username || '',

                        email:
                            userData.email || '',

                        phoneNumber:
                            userData.phoneNumber || '',

                        addressLine1:
                            userData.addressLine1 || '',

                        addressLine2:
                            userData.addressLine2 || '',

                        city:
                            userData.city || '',

                        postcode:
                            userData.postcode || ''

                    });

                }

                catch (error) {

                    console.error(
                        'Get profile error:',
                        error
                    );


                    setMessage(
                        error.response
                            ?.data
                            ?.message ||
                        'Failed to load profile'
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            };


        fetchProfile();

    }, []);


    // =====================================
    // NORMAL INPUT CHANGE
    // =====================================

    const handleChange =
        event => {

            const {
                name,
                value
            } =
                event.target;


            setUser(
                previous => ({
                    ...previous,
                    [name]:
                        value
                })
            );


            setErrors(
                previous => ({
                    ...previous,
                    [name]:
                        ''
                })
            );

        };



    // =====================================
    // POSTIO ADDRESS SEARCH
    // =====================================

    useEffect(() => {

        const query =
            addressSearch.trim();

        if (query.length < 3) {

            setAddressSuggestions([]);
            setAddressSearching(false);

            return;
        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        setAddressSearching(true);

                        const response =
                            await axios.get(
                                'http://localhost:8000/address/search',
                                {
                                    params: {
                                        q: query
                                    }
                                }
                            );


                        setAddressSuggestions(
                            response.data.results || []
                        );

                    }
                    catch (error) {

                        console.error(
                            'Postio address search error:',
                            error
                        );

                        setAddressSuggestions([]);

                    }
                    finally {

                        setAddressSearching(false);

                    }

                },

                500
            );


        return () =>
            clearTimeout(timer);

    }, [addressSearch]);


    // =====================================
    // SELECT POSTIO ADDRESS
    // =====================================

    const handleAddressSelect = async suggestion => {
        try {

            setAddressSelecting(true);
            setMessage('');

            const response = await axios.get(`http://localhost:8000/address/${suggestion.udprn}`);

            const address = response.data.address;

            setUser(
                previous => ({
                    ...previous,

                    addressLine1:
                        address.addressLine1 || '',

                    addressLine2:
                        address.addressLine2 || '',

                    city:
                        address.city || '',

                    postcode:
                        String(
                            address.postcode || ''
                        ).toUpperCase(),

                    deliveryUdprn:
                        address.udprn || null
                })
            );


            setAddressSearch(suggestion.suggestion);

            setAddressSuggestions([]);


            setErrors(
                previous => ({
                    ...previous,

                    addressLine1: '',
                    city: '',
                    postcode: ''
                })
            );


            setMessage('Address selected from Royal Mail PAF.');

        }
        catch (error) {

            console.error('Postio address selection error:', error);

            setMessage('Unable to retrieve that address. You can still enter it manually.');

        }
        finally {
            setAddressSelecting(false);
        }
    };


    // =====================================
    // VALIDATION
    // =====================================

    const validateForm =
        () => {

            const newErrors = {};


            const fullName =
                String(
                    user.fullName || ''
                ).trim();


            const username =
                String(
                    user.username || ''
                ).trim();


            const phoneNumber =
                String(
                    user.phoneNumber || ''
                ).trim();


            const addressLine1 =
                String(
                    user.addressLine1 || ''
                ).trim();


            const city =
                String(
                    user.city || ''
                ).trim();


            const postcode =
                String(
                    user.postcode || ''
                ).trim();


            if (
                !fullName
            ) {

                newErrors.fullName =
                    'Full name is required';

            }


            if (
                !username
            ) {

                newErrors.username =
                    'Username is required';

            }

            else if (
                username.length <
                3
            ) {

                newErrors.username =
                    'Username must contain at least 3 characters';

            }


            if (
                deliveryRequired
            ) {

                if (
                    !phoneNumber
                ) {

                    newErrors.phoneNumber =
                        'Phone number is required';

                }


                if (
                    !addressLine1
                ) {

                    newErrors.addressLine1 =
                        'Address line 1 is required';

                }


                if (
                    !city
                ) {

                    newErrors.city =
                        'City is required';

                }


                if (
                    !postcode
                ) {

                    newErrors.postcode =
                        'Postcode is required';

                }

            }


            setErrors(
                newErrors
            );


            return (
                Object.keys(
                    newErrors
                ).length ===
                0
            );

        };


    // =====================================
    // SAVE PROFILE
    // =====================================

    const handleSaveProfile =
        async () => {

            setMessage('');


            if (
                !validateForm()
            ) {
                return;
            }


            setSaving(
                true
            );


            try {

                const requestBody = {

                    fullName:
                        String(
                            user.fullName || ''
                        ).trim(),

                    username:
                        String(
                            user.username || ''
                        ).trim(),

                    phoneNumber:
                        String(
                            user.phoneNumber || ''
                        ).trim()

                };


                const hasAddress =
                    Boolean(
                        String(
                            user.addressLine1 || ''
                        ).trim() ||
                        String(
                            user.city || ''
                        ).trim() ||
                        String(
                            user.postcode || ''
                        ).trim()
                    );


                if (
                    hasAddress
                ) {

                    requestBody.deliveryAddress = {

                        addressLine1:
                            String(
                                user.addressLine1 || ''
                            ).trim(),

                        addressLine2:
                            String(
                                user.addressLine2 || ''
                            ).trim(),

                        city:
                            String(
                                user.city || ''
                            ).trim(),

                        postcode:
                            String(
                                user.postcode || ''
                            )
                                .trim()
                                .toUpperCase(),
                        udprn:
                            user.deliveryUdprn

                    };

                }


                const response =
                    await axios.put(

                        'http://localhost:8000/profile',

                        requestBody,

                        {
                            withCredentials:
                                true
                        }

                    );


                const updatedUser =
                    response.data.userData;


                setUser({

                    fullName:
                        updatedUser.fullName || '',

                    username:
                        updatedUser.username || '',

                    email:
                        updatedUser.email || '',

                    phoneNumber:
                        updatedUser.phoneNumber || '',

                    addressLine1:
                        updatedUser.addressLine1 || '',

                    addressLine2:
                        updatedUser.addressLine2 || '',

                    city:
                        updatedUser.city || '',

                    postcode:
                        updatedUser.postcode || ''

                });


                setMessage(
                    'Profile updated successfully'
                );


                if (
                    deliveryRequired &&
                    returnTo
                ) {

                    navigate(
                        returnTo
                    );

                }

            }

            catch (error) {

                console.error(
                    'Profile save error:',
                    error
                );


                const backendErrors =
                    error.response
                        ?.data
                        ?.errors;


                if (
                    Array.isArray(
                        backendErrors
                    ) &&
                    backendErrors.length >
                    0
                ) {

                    setMessage(
                        backendErrors.join(
                            '. '
                        )
                    );

                }

                else {

                    setMessage(
                        error.response
                            ?.data
                            ?.message ||
                        'Failed to update profile'
                    );

                }

            }

            finally {

                setSaving(
                    false
                );

            }

        };


    if (
        loading
    ) {

        return (

            <div className="container mt-4">

                <Spinner
                    animation="border"
                />

                {' '}

                Loading profile...

            </div>

        );

    }


    return (

        <div className="container mt-4">

            <h2>
                Profile
            </h2>


            {
                deliveryRequired && (

                    <Alert variant="warning">

                        <strong>
                            Delivery details required
                        </strong>

                        <br />

                        Complete your phone number
                        and delivery address before
                        returning to checkout.

                    </Alert>

                )
            }


            {
                message && (

                    <Alert variant="info">
                        {message}
                    </Alert>

                )
            }


            <h4 className="mt-4">
                Personal Details
            </h4>


            <Form.Group className="mb-3">

                <Form.Label>
                    Full Name
                </Form.Label>

                <Form.Control
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.fullName}
                </Form.Control.Feedback>

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Username
                </Form.Label>

                <Form.Control
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.username}
                </Form.Control.Feedback>

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Email
                </Form.Label>

                <Form.Control
                    type="email"
                    value={user.email}
                    disabled
                />

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Phone Number
                </Form.Label>

                <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="e.g. 07700 900123"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.phoneNumber}
                </Form.Control.Feedback>

            </Form.Group>


            <hr />


            <h4>
                Delivery Address
            </h4>


            <p>
                Start typing your address or postcode.
                Select the Royal Mail result when it appears.
                Manual entry remains available as a fallback.
            </p>

            <Form.Group className="mb-3">

                <Form.Label>
                    Find Address
                </Form.Label>

                <Form.Control
                    type="text"
                    placeholder="Start typing address or postcode"
                    autoComplete="off"
                    value={addressSearch}
                    onChange={
                        event =>
                            setAddressSearch(
                                event.target.value
                            )
                    }
                    disabled={addressSelecting}
                />


                {
                    addressSearching && (

                        <div className="mt-2">

                            <Spinner
                                size="sm"
                                animation="border"
                            />

                            {' '}

                            Searching addresses...

                        </div>

                    )
                }


                {
                    addressSuggestions.length > 0 && (

                        <div className="border rounded mt-1">

                            {
                                addressSuggestions.map(
                                    suggestion => (

                                        <Button
                                            key={suggestion.udprn}
                                            type="button"
                                            variant="light"
                                            className="w-100 text-start border-0 rounded-0"
                                            onClick={
                                                () =>
                                                    handleAddressSelect(
                                                        suggestion
                                                    )
                                            }
                                        >
                                            {suggestion.suggestion}
                                        </Button>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Address Line 1
                </Form.Label>

                <Form.Control
                    id="profile-address-line-1"
                    type="text"
                    name="addressLine1"
                    value={user.addressLine1}
                    onChange={handleChange}
                    isInvalid={!!errors.addressLine1}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.addressLine1}
                </Form.Control.Feedback>

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Address Line 2
                </Form.Label>

                <Form.Control
                    id="profile-address-line-2"
                    type="text"
                    name="addressLine2"
                    value={user.addressLine2}
                    onChange={handleChange}
                />

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    City
                </Form.Label>

                <Form.Control
                    id="profile-city"
                    type="text"
                    name="city"
                    value={user.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.city}
                </Form.Control.Feedback>

            </Form.Group>


            <Form.Group className="mb-3">

                <Form.Label>
                    Postcode
                </Form.Label>

                <Form.Control
                    id="profile-postcode"
                    type="text"
                    name="postcode"
                    value={user.postcode}
                    onChange={handleChange}
                    isInvalid={!!errors.postcode}
                />

                <Form.Control.Feedback
                    type="invalid"
                >
                    {errors.postcode}
                </Form.Control.Feedback>

            </Form.Group>


            <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={saving}
                className="mb-5"
            >

                {
                    saving
                        ? 'Saving...'
                        : 'Save Profile'
                }

            </Button>

        </div>

    );

};


export default Profile;