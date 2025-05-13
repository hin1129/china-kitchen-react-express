import React, { useState } from "react";
import { Table, Form, Button } from "react-bootstrap";

const MixAndMatchSectionChinese = ({ addToCart }) => {
    const [selectedDish, setSelectedDish] = useState({});

    const dishes = [
        { id: 1, name: "Sweet & Sour Chicken", price: 5.99 },
        { id: 2, name: "Beef in Black Bean Sauce", price: 6.49 },
    ];

    const riceOptions = ["Boiled Rice", "Egg Fried Rice"];

    const handleQuantityChange = (id, quantity) => {
        setSelectedDish({ ...selectedDish, [id]: { ...selectedDish[id], quantity } });
    };

    const handleRiceSelect = (id, rice) => {
        setSelectedDish({ ...selectedDish, [id]: { ...selectedDish[id], riceOption: rice } });
    };

    const handleAddToCart = (dish) => {
        if (selectedDish[dish.id]?.quantity > 0 && selectedDish[dish.id]?.riceOption) {
            addToCart({
                id: dish.id,
                dishName: dish.name,
                quantity: selectedDish[dish.id].quantity,
                riceOption: selectedDish[dish.id].riceOption,
            });
        } else {
            alert("Please select quantity and rice option.");
        }
    };

    return (
        <div>
            <h4>Mix & Match Dishes</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Dish Name</th>
                        <th>Price (£)</th>
                        <th>Quantity</th>
                        <th>Rice Option</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes.map((dish) => (
                        <tr key={dish.id}>
                            <td>{dish.name}</td>
                            <td>£{dish.price.toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={selectedDish[dish.id]?.quantity || ""}
                                    onChange={(e) => handleQuantityChange(dish.id, e.target.value)}
                                />
                            </td>
                            <td>
                                <Form.Select
                                    value={selectedDish[dish.id]?.riceOption || ""}
                                    onChange={(e) => handleRiceSelect(dish.id, e.target.value)}
                                >
                                    <option value="">Select Rice</option>
                                    {riceOptions.map((rice, index) => (
                                        <option key={index} value={rice}>
                                            {rice}
                                        </option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleAddToCart(dish)}>
                                    Add to Cart
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MixAndMatchSectionChinese;