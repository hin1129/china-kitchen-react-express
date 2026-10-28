import express from 'express'

const router = express.Router();

router.get('/address/test', async (req, res) => {
    try {
        const response = await fetch(
            'https://api.postio.co.uk/v1/connect',
            {
                method: 'GET',
                headers: {
                    'x-api-key': process.env.POSTIO_API_KEY
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Postio connection failed',
                postio: data
            });
        }

        return res.status(200).json({
            message: 'Postio connection successful',
            postio: data
        });
    }
    catch (error) {
        console.error('Postio test error:', error);

        return res.status(500).json({
            message: 'Unable to connect to Postio'
        });
    }
});


router.get('/address/search', async (req, res) => {
    try {
        const query = req.query.q?.trim();

        if (!query) {
            return res.status(400).json({
                message: 'Address search is required'
            });
        }

        if (query.length > 200) {
            return res.status(400).json({
                message: 'Address search is too long'
            });
        }

        const url = new URL(
            'https://api.postio.co.uk/v1/address/search'
        );

        url.searchParams.set('q', query);
        url.searchParams.set('max_results', '100');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.POSTIO_API_KEY
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Postio search error:', data);

            return res.status(response.status).json({
                message: 'Address search failed'
            });
        }

        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Address search error:', error);

        return res.status(500).json({
            message: 'Unable to search for address'
        });
    }
});
router.get('/address/:udprn', async (req, res) => {
    try {
        const { udprn } = req.params;

        if (!/^\d+$/.test(udprn)) {
            return res.status(400).json({
                message: 'Invalid address reference'
            });
        }

        const response = await fetch(
            `https://api.postio.co.uk/v1/address/udprn/${udprn}`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': process.env.POSTIO_API_KEY
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Postio address lookup error:', data);

            return res.status(response.status).json({
                message: 'Unable to retrieve address'
            });
        }

        const address = data.results?.[0];

        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }

        return res.status(200).json({
            address: {
                addressLine1: address.address_line_1 || '',
                addressLine2: address.address_line_2 || '',
                city: address.post_town || '',
                postcode: address.postcode || '',
                latitude: address.latitude,
                longitude: address.longitude,
                udprn: address.udprn
            }
        });
    }
    catch (error) {
        console.error('Address lookup error:', error);

        return res.status(500).json({
            message: 'Unable to retrieve address'
        });
    }
});

export { router };