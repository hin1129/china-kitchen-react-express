import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Nav } from 'react-bootstrap';
import MixAndMatchSectionChinese from './MixAndMatchSection';
import ShoppingCart from './ShoppingCart';

const Takeaway = ({ logInState, currentUser }) => {
    const [menuData, setMenuData] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [riceOptions, setRiceOptions] = useState({});

    const categories =
        menuData?.categories?.filter(
            (category) =>
                category.categoryName !== 'Set Meals' &&
                category.categoryName !== 'Mix & Match'
        ) || [];

    const setMealCategory = {
        categoryName: 'Set Meals',
        items: menuData?.setMeals || [],
    };

    const mixAndMatchCategory = {
        categoryName: 'Mix & Match',
        items: menuData?.mixAndMatch || [],
    };

    useEffect(() => {
        fetch('http://localhost:8000/takeaway')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load menu');
                }
                return response.json();
            })
            .then((data) => setMenuData(data))
            .catch((error) => console.error('Failed to fetch menu:', error));
    }, []);

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('TakeawayCart');

        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error('Failed to restore cart:', error);
            }
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem('TakeawayCart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const clearCartAfterPaidOrder = () => {
            setCartItems([]);
        };

        window.addEventListener(
            'takeaway-cart-cleared',
            clearCartAfterPaidOrder
        );

        return () => {
            window.removeEventListener(
                'takeaway-cart-cleared',
                clearCartAfterPaidOrder
            );
        };
    }, []);

    const handleQuantityChange = (key, value) => {
        const quantity = Math.max(0, Math.floor(Number(value) || 0));
        setQuantities((previous) => ({ ...previous, [key]: quantity }));
    };

    const handleRiceOptionChange = (key, value) => {
        setRiceOptions((previous) => ({ ...previous, [key]: value }));
    };

    const handleAddToCartOther = (categoryName, item) => {
        const key = `${categoryName}-${item.id}`;
        const quantity = quantities[key] || 0;
        const isOutOfStock = item.inStock === false;

        if (quantity < 1 || isOutOfStock) {
            return;
        }

        setCartItems((previousCart) => {
            const existingIndex = previousCart.findIndex(
                (cartItem) =>
                    cartItem.dishId === item.id &&
                    !cartItem.rice
            );

            if (existingIndex !== -1) {
                return previousCart.map((cartItem, index) =>
                    index === existingIndex
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + quantity,
                        }
                        : cartItem
                );
            }

            return [
                ...previousCart,
                {
                    dishId: item.id,
                    name: item.name,
                    price: Number(item.price),
                    quantity,
                },
            ];
        });

        setQuantities((previous) => ({ ...previous, [key]: 0 }));
    };

    const handleAddToCartMixAndMatch = (item) => {
        const key = `Mix & Match-${item.id}`;
        const quantity = quantities[key] || 0;
        const availableRiceOptions = item.riceOptions || [];
        const defaultRice = availableRiceOptions[0]?.type || '';
        const rice = riceOptions[key] || defaultRice;
        const isOutOfStock = item.inStock === false;

        if (
            quantity < 1 ||
            isOutOfStock ||
            !rice ||
            availableRiceOptions.length === 0
        ) {
            return;
        }

        const selectedRice = availableRiceOptions.find(
            (riceOption) => riceOption.type === rice
        );

        if (!selectedRice) {
            return;
        }

        const displayPrice =
            Number(item.price) + Number(selectedRice.extraCost || 0);

        setCartItems((previousCart) => {
            const existingIndex = previousCart.findIndex(
                (cartItem) =>
                    cartItem.dishId === item.id &&
                    cartItem.rice === rice
            );

            if (existingIndex !== -1) {
                return previousCart.map((cartItem, index) =>
                    index === existingIndex
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + quantity,
                        }
                        : cartItem
                );
            }

            return [
                ...previousCart,
                {
                    dishId: item.id,
                    name: item.name,
                    rice,
                    price: displayPrice,
                    quantity,
                },
            ];
        });

        setQuantities((previous) => ({ ...previous, [key]: 0 }));
        setRiceOptions((previous) => ({ ...previous, [key]: defaultRice }));
    };

    const renderTableHeader = () => (
        <thead>
            <tr>
                <th>ID</th>
                <th>Dish</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Add</th>
            </tr>
        </thead>
    );

    const renderTableBody = (category) => (
        <tbody>
            {category.items.map((item) => {
                const quantityKey = `${category.categoryName}-${item.id}`;
                const quantity = quantities[quantityKey] || 0;
                const isOutOfStock = item.inStock === false;

                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                            {item.name}
                            {isOutOfStock && (
                                <span style={{ color: 'red' }}> (Out of stock)</span>
                            )}
                        </td>
                        <td>£{Number(item.price).toFixed(2)}</td>
                        <td style={{ maxWidth: '80px' }}>
                            <Form.Control
                                type="number"
                                value={quantity}
                                min="0"
                                onChange={(event) =>
                                    handleQuantityChange(quantityKey, event.target.value)
                                }
                                style={{ width: '100%', minWidth: '50px' }}
                                disabled={isOutOfStock}
                            />
                        </td>
                        <td>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    handleAddToCartOther(category.categoryName, item)
                                }
                                disabled={quantity === 0 || isOutOfStock}
                            >
                                Add
                            </Button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );

    if (!menuData) {
        return <div className="container py-5">Loading menu...</div>;
    }

    const categoryLinks = [
        ...categories.map((category) => category.categoryName),
        setMealCategory.categoryName,
        'Mix & Match',
    ];

    return (
        <Container className="py-5">
            <h2>Menu</h2>

            <Nav
                className="mb-4 sticky-top bg-light py-2 px-3 border rounded"
                style={{ zIndex: 1000, top: '56px' }}
            >
                {categoryLinks.map((name) => (
                    <Nav.Item key={name} className="me-3">
                        <Nav.Link
                            href={`#${name.replace(/\s+/g, '')}`}
                            className="text-primary"
                        >
                            {name}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            <Row>
                <Col md={8}>
                    {categories.map((category) => (
                        <div
                            key={category.categoryName}
                            id={category.categoryName.replace(/\s+/g, '')}
                            className="scroll-anchor-target"
                        >
                            <h3 className="mt-4">{category.categoryName}</h3>
                            <Table striped hover responsive>
                                {renderTableHeader()}
                                {renderTableBody(category)}
                            </Table>
                        </div>
                    ))}

                    <div
                        id={setMealCategory.categoryName.replace(/\s+/g, '')}
                        className="scroll-anchor-target"
                    >
                        <h3 className="mt-4">{setMealCategory.categoryName}</h3>
                        <Table striped hover responsive>
                            {renderTableHeader()}
                            {renderTableBody(setMealCategory)}
                        </Table>
                    </div>

                    <div id="Mix&Match" className="scroll-anchor-target">
                        <MixAndMatchSectionChinese
                            items={mixAndMatchCategory.items}
                            quantities={quantities}
                            riceOptions={riceOptions}
                            handleQuantityChange={handleQuantityChange}
                            handleRiceOptionChange={handleRiceOptionChange}
                            handleAddToCartMixAndMatch={handleAddToCartMixAndMatch}
                        />
                    </div>
                </Col>

                <Col md={4} className="cart-column">
                    <ShoppingCart
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        logInState={logInState}
                        currentUser={currentUser}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Takeaway;
