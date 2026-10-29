const METRES_PER_MILE = 1609.344;
export const MINIMUM_DELIVERY_ORDER = 15;

// =============================
// NORMALISE POSTCODE
// =============================

const normalisePostcode = postcode => String(postcode || '').replace(/\s+/g, '').toUpperCase();

// =============================
// DELIVERY FEE
// =============================

export const calculateDeliveryFee = distanceMiles => {
    if (
        !Number.isFinite(
            distanceMiles
        ) ||
        distanceMiles < 0
    ) {

        throw new Error(
            'Invalid delivery distance'
        );

    }


    // Example:
    // 0 - 2 miles = £1
    // then £1 per extra mile

    if (
        distanceMiles <=
        2
    ) {

        return 1;

    }


    return (
        1 +
        Math.ceil(
            distanceMiles -
            2
        )
    );

};


// =============================
// POSTIO ADDRESS LOOKUP
// =============================

export const getPostioAddress =
    async udprn => {

        const cleanUdprn =
            String(
                udprn || ''
            ).trim();


        if (
            !/^\d+$/.test(
                cleanUdprn
            )
        ) {

            const error =
                new Error(
                    'Please select a valid delivery address'
                );

            error.statusCode =
                400;

            error.code =
                'DELIVERY_ADDRESS_REQUIRED';

            throw error;

        }


        const apiKey =
            process.env
                .POSTIO_API_KEY;


        if (
            !apiKey
        ) {

            throw new Error(
                'POSTIO_API_KEY is missing'
            );

        }


        const response =
            await fetch(

                `https://api.postio.co.uk/v1/address/udprn/${cleanUdprn}`,

                {
                    method:
                        'GET',

                    headers: {

                        'x-api-key':
                            apiKey

                    }
                }

            );


        const data =
            await response.json();


        if (
            !response.ok
        ) {

            console.error(
                'Postio address lookup error:',
                data
            );


            const error =
                new Error(
                    'Unable to verify delivery address'
                );

            error.statusCode =
                400;

            error.code =
                'DELIVERY_ADDRESS_REQUIRED';

            throw error;

        }


        const result =
            data.results?.[0];


        if (
            !result
        ) {

            const error =
                new Error(
                    'Delivery address was not found'
                );

            error.statusCode =
                400;

            error.code =
                'DELIVERY_ADDRESS_REQUIRED';

            throw error;

        }


        const longitude =
            Number(
                result.longitude
            );


        const latitude =
            Number(
                result.latitude
            );


        if (
            !Number.isFinite(
                longitude
            ) ||
            !Number.isFinite(
                latitude
            )
        ) {

            const error =
                new Error(
                    'Delivery address has no valid coordinates'
                );

            error.statusCode =
                400;

            throw error;

        }


        return {

            udprn:
                Number(
                    result.udprn
                ),

            addressLine1:
                String(
                    result.address_line_1 ||
                    ''
                ).trim(),

            addressLine2:
                String(
                    result.address_line_2 ||
                    ''
                ).trim(),

            city:
                String(
                    result.post_town ||
                    ''
                ).trim(),

            postcode:
                String(
                    result.postcode ||
                    ''
                )
                    .trim()
                    .toUpperCase(),

            longitude,

            latitude

        };

    };



// =============================
// AMAZON DRIVING DISTANCE
// =============================

export const getDrivingDistance =
    async (
        customerLongitude,
        customerLatitude
    ) => {

        const longitude =
            Number(
                customerLongitude
            );


        const latitude =
            Number(
                customerLatitude
            );


        if (
            !Number.isFinite(
                longitude
            ) ||
            !Number.isFinite(
                latitude
            )
        ) {

            throw new Error(
                'Invalid delivery coordinates'
            );

        }


        const region =
            process.env
                .AMAZON_LOCATION_REGION;


        const apiKey =
            process.env
                .AMAZON_LOCATION_ROUTE_API_KEY;


        const restaurantLongitude =
            Number(
                process.env
                    .RESTAURANT_LONGITUDE
            );


        const restaurantLatitude =
            Number(
                process.env
                    .RESTAURANT_LATITUDE
            );


        if (
            !region
        ) {

            throw new Error(
                'AMAZON_LOCATION_REGION is missing'
            );

        }


        if (
            !apiKey
        ) {

            throw new Error(
                'AMAZON_LOCATION_ROUTE_API_KEY is missing'
            );

        }


        if (
            !Number.isFinite(
                restaurantLongitude
            ) ||
            !Number.isFinite(
                restaurantLatitude
            )
        ) {

            throw new Error(
                'Restaurant coordinates are not configured'
            );

        }


        const url =
            `https://routes.geo.${region}.amazonaws.com/v2/routes?key=${encodeURIComponent(
                apiKey
            )}`;


        const body = {

            Origin: [

                restaurantLongitude,

                restaurantLatitude

            ],

            Destination: [

                longitude,

                latitude

            ],

            TravelMode:
                'Car',

            OptimizeRoutingFor:
                'FastestRoute'

        };


        const awsResponse =
            await fetch(

                url,

                {

                    method:
                        'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body:
                        JSON.stringify(
                            body
                        )

                }

            );


        if (
            !awsResponse.ok
        ) {

            const errorText =
                await awsResponse.text();


            console.error(
                'AWS ROUTE ERROR:',
                errorText
            );


            throw new Error(
                'Could not calculate delivery route'
            );

        }


        const data =
            await awsResponse.json();


        const distanceMetres =
            data.Routes
                ?.[0]
                ?.Summary
                ?.Distance;


        if (
            !Number.isFinite(
                distanceMetres
            )
        ) {

            throw new Error(
                'Amazon did not return a route distance'
            );

        }


        const distanceMiles =
            distanceMetres /
            METRES_PER_MILE;


        return Number(

            distanceMiles
                .toFixed(
                    2
                )

        );

    };