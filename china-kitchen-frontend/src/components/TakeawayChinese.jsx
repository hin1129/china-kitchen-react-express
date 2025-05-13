import React, { useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import MixAndMatchSectionChinese from './MixAndMatchSectionChinese';

const TakeawayChinese = () => {
    // Mix & Match Dishes
    const dishItems = [
        { id: 137, name: "Deep Fried Chicken Katsu with Curry Sauce" },
        { id: 138, name: "Sweet & Sour Chicken Hong Kong Style" },
        { id: 139, name: "Roast Duck" },
        { id: 140, name: "Roast Duck" },
    ];

    // Rice Options
    const riceItems = [
        { id: 'A', name: "Boiled Rice" },
        { id: 'B', name: "Egg Fried Rice" },
    ];

    // Set Meals
    const setMealCategory = {
        categoryName: "Set Meals",
        items: [
            { id: "A", name: "For 1 Person: Sweet & Sour Chicken Balls, Beef with Green Pepper, Egg Fried Rice", price: 10.80 },
            { id: "B", name: "For 2 Persons: Satay Chicken, Vegetarian Rolls, Crispy Beef, Sweet & Sour Pork, Chicken with Cashew, Special Fried Rice", price: 25.80 },
            { id: "C", name: "For 2 Persons: Mixed Vegetarian Platter, Beef with Ginger, Kong Po Chicken, Stir Fried Vegetables, Special Fried Rice", price: 26.80 },
        ],
    };

    // Appetisers & Soups
    const otherCategories = [
        {
            categoryName: "Appetisers",
            items: [
                { id: 101, name: "Spring Rolls (2 pcs)", price: 3.50 },
                { id: 102, name: "Satay Chicken on Skewers (4 pcs)", price: 5.50 },
            ],
        },
        {
            categoryName: "Soups",
            items: [
                { id: 201, name: "Hot & Sour Soup", price: 4.00 },
                { id: 202, name: "Chicken & Sweetcorn Soup", price: 3.80 },
            ],
        },
    ];

    const [selectedMixAndMatch, setSelectedMixAndMatch] = useState([]);

    // Handle dish quantity selection
    const handleDishQuantitySelect = (quantity, dishId) => {
        setSelectedMixAndMatch((prev) => {
            const existingDish = prev.find((item) => item.dishId === dishId);

            if (quantity > 0) {
                if (existingDish) {
                    // Preserve existing rice selections, filling missing spots with ''
                    const newRiceSelections = [
                        ...existingDish.riceSelections.slice(0, quantity),
                        ...Array(Math.max(0, quantity - existingDish.riceSelections.length)).fill('')
                    ];

                    return prev.map((item) =>
                        item.dishId === dishId ? { ...item, quantity, riceSelections: newRiceSelections } : item
                    );
                } else {
                    return [...prev, { dishId, quantity, riceSelections: Array(quantity).fill('') }];
                }
            } else {
                return prev.filter((item) => item.dishId !== dishId);
            }
        });
    };

    // Handle selecting rice for each portion
    const handleRiceItemSelectForDishItem = (dishId, portionIndex, riceType) => {
        setSelectedMixAndMatch((prev) =>
            prev.map((item) =>
                item.dishId === dishId
                    ? {
                        ...item,
                        riceSelections: item.riceSelections.map((rice, index) =>
                            index === portionIndex ? riceType : rice
                        ),
                    }
                    : item
            )
        );
    };

    // Render Table Header
    const renderTableHeader = (category) => (
        <thead key={category.categoryName}>
            <tr>
                <th>Dish Number</th>
                <th>Dish Name</th>
                <th>Price (£)</th>
                <th>Quantity</th>
            </tr>
        </thead>
    );

    // Render Table Body
    const renderTableBody = (category) => (
        <tbody>
            {category.items.map((item) => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>
                        <input
                            type="number"
                            min="0"
                            defaultValue="0"
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    );

    return (
        <Container>
            <Row>
                {/* Other Categories (Appetisers, Soups) */}
                <Col>
                    {otherCategories.map(category => (
                        <Table key={category.categoryName} striped hover responsive>
                            {renderTableHeader(category)}
                            {renderTableBody(category)}
                        </Table>
                    ))}
                </Col>

                <Col>
                    <h3>Mix & Match</h3>
                    <MixAndMatchSectionChinese
                        selectedMixAndMatch={selectedMixAndMatch}
                        dishItems={dishItems}
                        riceItems={riceItems}
                        handleDishQuantitySelect={handleDishQuantitySelect}
                        handleRiceItemSelectForDishItem={handleRiceItemSelectForDishItem}
                    />

                    <h3>{setMealCategory.categoryName}</h3>
                    <Table striped hover responsive>
                        {renderTableHeader(setMealCategory)}
                        {renderTableBody(setMealCategory)}
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default TakeawayChinese;