const METRES_PER_MILE =
    1609.344;


export const MINIMUM_DELIVERY_ORDER =
    15;


// =============================
// NORMALISE POSTCODE
// =============================

const normalisePostcode =
    postcode =>

        String(
            postcode || ''
        )
            .replace(
                /\s+/g,
                ''
            )
            .toUpperCase();


// =============================
// DELIVERY FEE
// =============================

export const calculateDeliveryFee =
    distanceMiles => {

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
// AMAZON GEOCODE
//
// AddressNow / Royal Mail owns
// the postal address.
//
// Amazon only turns that address
// into coordinates for routing.
// =============================

export const geocodeDeliveryAddress =
    async (
        address,
        postcode
    ) => {

        const cleanAddress =
            String(
                address || ''
            ).trim();


        const cleanPostcode =
            String(
                postcode || ''
            )
                .trim()
                .toUpperCase();


        if (
            !cleanAddress ||
            !cleanPostcode
        ) {

            const error =
                new Error(
                    'Delivery address and postcode are required'
                );


            error.statusCode =
                400;


            throw error;

        }


        const region =
            process.env
                .AMAZON_LOCATION_REGION;


        const apiKey =
            process.env
                .AMAZON_LOCATION_PLACE_API_KEY;


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
                'AMAZON_LOCATION_PLACE_API_KEY is missing'
            );

        }


        // Amazon Places V2 Geocode endpoint
        const url =
            `https://places.geo.${region}.amazonaws.com/v2/geocode?key=${encodeURIComponent(
                apiKey
            )}`;


        const requestBody = {

            QueryText:
                `${cleanAddress}, ${cleanPostcode}, United Kingdom`,

            MaxResults:
                10,

            Filter: {

                IncludeCountries: [
                    'GB'
                ]

            }

        };


        console.log(
            'AWS GEOCODE QUERY:',
            requestBody.QueryText
        );


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
                            requestBody
                        )

                }

            );


        // =============================
        // AWS ERROR
        // =============================

        if (
            !awsResponse.ok
        ) {

            const errorText =
                await awsResponse.text();


            console.error(
                'AWS GEOCODE HTTP STATUS:',
                awsResponse.status
            );


            console.error(
                'AWS GEOCODE ERROR:',
                errorText
            );


            const error =
                new Error(
                    'Could not locate delivery address for routing'
                );


            error.statusCode =
                400;


            throw error;

        }


        const data =
            await awsResponse.json();


        console.log(
            'AWS GEOCODE RESPONSE:',
            data
        );


        const results =
            data.ResultItems ||
            [];


        if (
            results.length ===
            0
        ) {

            const error =
                new Error(
                    'Amazon could not find this delivery location'
                );


            error.statusCode =
                400;


            throw error;

        }


        const wantedPostcode =
            normalisePostcode(
                cleanPostcode
            );


        // First try to find an exact
        // postcode match.
        let selectedResult =
            results.find(

                result =>

                    normalisePostcode(
                        result.Address
                            ?.PostalCode
                    ) ===
                    wantedPostcode

            );


        // If AWS's postcode metadata
        // is imperfect, use its first
        // geocode result instead.
        //
        // We DO NOT replace the Royal
        // Mail address with AWS's text.
        if (
            !selectedResult
        ) {

            selectedResult =
                results[0];

        }


        const longitude =
            selectedResult
                ?.Position
            ?.[0];


        const latitude =
            selectedResult
                ?.Position
            ?.[1];


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
                    'Amazon did not return valid delivery coordinates'
                );


            error.statusCode =
                400;


            throw error;

        }


        return {

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