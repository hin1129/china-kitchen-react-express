// add button disabled by default 
import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import MixAndMatchSectionChinese from './MixAndMatchSectionChinese'

const categories = [
    {
        categoryName: 'Appetisers',
        items: [
            { id: '1', name: 'Spring Rolls (4)', price: 3.0 },
            { id: '2', name: 'Prawn Toast', price: 3.8 },
        ],
    },
    {
        categoryName: 'Soup',
        items: [
            { id: '26', name: 'Chicken & Sweetcorn Soup', price: 3.2 },
            { id: '27', name: 'Crabmeat & Sweetcorn Soup', price: 3.5 },
        ],
    },
];

const setMealCategory = {
    categoryName: 'Set Meals',
    items: [
        {
            id: 'A',
            name: 'For 1 Person: Sweet & Sour Chicken Balls, Beef with Green Pepper, Egg Fried Rice',
            price: 10.8,
        },
        {
            id: 'B',
            name:
                'For 2 Persons: Satay Chicken, Vegetarian Rolls, Crispy Beef, Sweet & Sour Pork, Chicken with Cashew, Special Fried Rice',
            price: 25.8,
        },
        {
            id: 'C',
            name:
                'For 2 Persons: Mixed Vegetarian Platter, Beef with Ginger, Kong Po Chicken, Stir Fried Vegetables, Special Fried Rice',
            price: 26.8,
        },
    ],
};

const mixAndMatchCategory = {
    categoryName: 'Mix & Match',
    items: [
        { id: '137', name: 'Deep Fried Chicken Katsu with Curry Sauce', price: 6.8 },
        { id: '138', name: 'Sweet & Sour Chicken Hong Kong Style', price: 7.2 },
        { id: '139', name: 'Roast Duck', price: 7.0 },
        { id: '140', name: 'Crispy Shredded Beef', price: 8.2 },
    ],
};

const TakeawayChinese = () => {
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [riceOptions, setRiceOptions] = useState({});

    const handleQuantityChange = (key, value) => {
        setQuantities((prev) => ({ ...prev, [key]: Number(value) }));
    };

    const handleRiceOptionChange = (key, value) => {
        setRiceOptions((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddToCartOther = (categoryName, item) => {
        const key = `${categoryName}-${item.id}`;
        const qty = quantities[key] || 0;
        if (qty === 0) return;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (cartItem) =>
                    cartItem.dishId === item.id &&
                    cartItem.rice === undefined
            );
            if (existingIndex !== -1) {
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += qty;
                return newCart;
            }
            return [
                ...prevCart,
                {
                    dishId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: qty,
                },
            ];
        });

        setQuantities((prev) => ({ ...prev, [key]: 0 }));
    };

    const handleAddToCartMixAndMatch = (item) => {
        const key = `Mix & Match-${item.id}`;
        const qty = quantities[key] || 0;
        const rice = riceOptions[key] || 'Boiled Rice';

        if (qty === 0) return;

        const riceCost = rice === 'Egg Fried Rice' ? 0.2 : 0.0;
        const unitPrice = item.price + riceCost;
        const fullName = `${item.name} + ${rice}`;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (cartItem) =>
                    cartItem.dishId === item.id &&
                    cartItem.rice === rice
            );

            if (existingIndex !== -1) {
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += qty;
                return newCart;
            }

            return [
                ...prevCart,
                {
                    dishId: item.id,
                    name: fullName,
                    rice,
                    price: unitPrice,
                    quantity: qty,
                },
            ];
        });

        setQuantities((prev) => ({ ...prev, [key]: 0 }));
        setRiceOptions((prev) => ({ ...prev, [key]: 'Boiled Rice' }));
    };

    const renderTableHeader = () => (
        <thead>
            <tr>
                <th>ID</th>
                <th>Dish</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Add</th>
            </tr>
        </thead>
    );

    const renderTableBody = (category) => (
        <tbody>
            {category.items.map((item) => {
                const quantityKey = `${category.categoryName}-${item.id}`;
                const quantity = quantities[quantityKey] || 0;

                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>£{item.price.toFixed(2)}</td>
                        <td style={{ maxWidth: '80px' }}>
                            <Form.Control
                                type="number"
                                value={quantity}
                                min="0"
                                onChange={(e) => handleQuantityChange(quantityKey, e.target.value)}
                                style={{ width: '100%', minWidth: '50px' }}
                            />
                        </td>
                        <td>
                            <Button
                                variant="primary"
                                onClick={() => handleAddToCartOther(category.categoryName, item)}
                            >
                                Add
                            </Button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );

    // MixAndMatchSectionChinese component
    // const renderMixAndMatch = () => (
    //     <Table striped hover responsive>
    //         <thead>
    //             <tr>
    //                 <th>ID</th>
    //                 <th>Dish</th>
    //                 <th>Base Price</th>
    //                 <th>Rice</th>
    //                 <th>Qty</th>
    //                 <th>Add</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {mixAndMatchCategory.items.map((item) => {
    //                 const key = `Mix & Match-${item.id}`;
    //                 const quantity = quantities[key] || 0;
    //                 const rice = riceOptions[key] || 'Boiled Rice';

    //                 return (
    //                     <tr key={item.id}>
    //                         <td>{item.id}</td>
    //                         <td>{item.name}</td>
    //                         <td>£{item.price.toFixed(2)}</td>
    //                         <td>
    //                             <Form.Select
    //                                 value={rice}
    //                                 onChange={(e) => handleRiceOptionChange(key, e.target.value)}
    //                             >
    //                                 <option value="Boiled Rice">Boiled Rice</option>
    //                                 <option value="Egg Fried Rice">Egg Fried Rice (+£0.20)</option>
    //                             </Form.Select>
    //                         </td>
    //                         <td style={{ minWidth: '70px', maxWidth: '80px' }}>
    //                             <Form.Control
    //                                 type="number"
    //                                 value={quantity}
    //                                 min="0"
    //                                 onChange={(e) => handleQuantityChange(key, e.target.value)}
    //                             />
    //                         </td>
    //                         <td>
    //                             <Button variant="success" onClick={() => handleAddToCartMixAndMatch(item)}>
    //                                 Add
    //                             </Button>
    //                         </td>
    //                     </tr>
    //                 );
    //             })}
    //         </tbody>
    //     </Table>
    // );

    const renderCart = () => {
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="mt-5">
                <h3>Cart</h3>
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Dish</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.dishId}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>£{item.price.toFixed(2)}</td>
                                    <td>£{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                                <td style={{ fontWeight: 'bold' }}>£{totalPrice.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </div>
        );
    };

    return (
        <Container className="py-5">
            <h2>Menu</h2>
            <Row className="align-items-start">
                {/* total 12 md, was menu and menu, now menu and shopping cart */}
                <Col md={8}>
                    {categories.map((category) => (
                        <div key={category.categoryName}>
                            <h3 className="mt-4">{category.categoryName}</h3>
                            <Table striped hover responsive>
                                {renderTableHeader()}
                                {renderTableBody(category)}
                            </Table>
                        </div>
                    ))}



                    {/* total 12 md, was menu and menu, now menu and shopping cart */}
                    <div>
                        <h3 className="mt-4">{setMealCategory.categoryName}</h3>
                        <Table striped hover responsive>
                            {renderTableHeader()}
                            {renderTableBody(setMealCategory)}
                        </Table>
                    </div>

                    <div>
                        {/* {renderMixAndMatch()} */}
                        <MixAndMatchSectionChinese
                            items={mixAndMatchCategory.items}
                            quantities={quantities}
                            riceOptions={riceOptions}
                            onQtyChange={handleQuantityChange}
                            onRiceChange={handleRiceOptionChange}
                            onAdd={handleAddToCartMixAndMatch}
                        />
                    </div>
                </Col>

                <Col md={4} className="cart-column">
                    {renderCart()}
                </Col>
            </Row>
        </Container>
    );
}

export default TakeawayChinese;