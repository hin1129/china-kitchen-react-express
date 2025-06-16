import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Nav } from 'react-bootstrap';
import MixAndMatchSectionChinese from './MixAndMatchSection'
import ShoppingCart from './ShoppingCart';
// import { categories, setMealCategory, mixAndMatchCategory } from '../data/Menu';

const Takeaway = () => {
    // fetch menu from backend
    const [menuData, setMenuData] = useState(null);

    // data from hardcoded frontend file
    // const categories = menuData?.categories || [];
    // const setMealCategory = menuData?.setMealCategory || { categoryName: '', items: [] };
    // const mixAndMatchCategory = menuData?.mixAndMatchCategory || { categoryName: 'Mix & Match', items: [] };

    // retrieve menu data from db
    const categories = menuData?.categories?.filter(
        (category) => category.categoryName !== 'Set Meals' && category.categoryName !== 'Mix & Match'
    ) || [];

    const setMealCategory = {
        categoryName: 'Set Meals',
        items: menuData?.setMeals || []
    };

    const mixAndMatchCategory = {
        categoryName: 'Mix & Match',
        items: menuData?.mixAndMatch || []
    };

    console.log(categories, setMealCategory, mixAndMatchCategory)
    // retrieve menu data from db
    useEffect(() => {
        fetch('http://localhost:8000/takeaway')
            .then((response) => response.json())
            .then((data) => {
                setMenuData(data);
            })
            .catch((error) => {
                console.error('Failed to fetch menu:', error);
            });
    }, []);

    const [quantities, setQuantities] = useState({});
    // for mix & match
    const [riceOptions, setRiceOptions] = useState({});
    // pass data to shopping cart component
    const [cartItems, setCartItems] = useState([]);

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

        setCartItems((prevCart) => {
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

        setCartItems((prevCart) => {
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
                                disabled={quantity === 0}
                            >
                                Add
                            </Button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );

    // Sticky category nav bar
    const categoryLinks = [
        ...categories.map((category) => category.categoryName),
        setMealCategory.categoryName,
        'Mix & Match',
    ];

    // 
    return (
        <Container className="py-5">
            <h2>Menu</h2>
            {/* Sticky Inner Navigation Bar */}
            <Nav
                className="mb-4 sticky-top bg-light py-2 px-3 border rounded"
                style={{ zIndex: 1000, top: '56px' }} // adjust top to match main nav bar height
            >
                {categoryLinks.map((name) => (
                    <Nav.Item key={name} className="me-3" >
                        <Nav.Link href={`#${name.replace(/\s+/g, '')}`} className="text-primary">
                            {name}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>



            <Row>
                {/* <Row className="align-items-start"> */}
                {/* total 12 md, was menu and menu, now menu and shopping cart */}
                <Col md={8} >
                    {categories.map((category) => (
                        //  div id for scroll 
                        <div key={category.categoryName} id={category.categoryName.replace(/\s+/g, '')} className="scroll-anchor-target" >
                            <h3 className="mt-4">{category.categoryName}</h3>

                            <Table striped hover responsive>
                                {renderTableHeader()}
                                {renderTableBody(category)}
                            </Table>
                        </div>
                    ))}

                    {/* total 12 md, was menu and menu, now menu and shopping cart */}
                    {/* div id for scroll */}
                    <div id={setMealCategory.categoryName.replace(/\s+/g, '')} className="scroll-anchor-target" >
                        <h3 className="mt-4">{setMealCategory.categoryName}</h3>

                        <Table striped hover responsive>
                            {renderTableHeader()}
                            {renderTableBody(setMealCategory)}
                        </Table>
                    </div>

                    {/* div id for scroll */}
                    <div id="Mix&Match" className="scroll-anchor-target" >
                        {/* {renderMixAndMatch()} */}
                        {/* pass data as prop to MixAndMatchSectionChinese component */}
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

                {/* custom class to set sticky column */}
                <Col md={4} className="cart-column">
                    {/* {renderCart()} */}
                    {/* pass data as prop to ShoppingCart component */}
                    <ShoppingCart cartItems={cartItems} />
                </Col>
            </Row>
        </Container >
    );
}

export default Takeaway;