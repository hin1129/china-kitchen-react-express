import React from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

// retrieve data from Takeaway
const ShoppingCart = ({ cartItems, setCartItems }) => {

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/order', {
                items: cartItems,
                total: Number(totalPrice.toFixed(2))
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('Token')}`
                }
            })
            console.log(response.data);
            alert('Order submitted successfully!');
            setCartItems([]);
        }
        catch (error) {
            console.error(error.message);
            alert('Order submitted unsuccessfully!');
        }
    }

    return (
        <div className="mt-5">
            <h3>Cart Items</h3>

            {cartItems.length === 0 ? (
                <p>Your cartItems is empty</p>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Dish</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cartItems.map((item, index) => (
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

                    <Button
                        variant="success"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className="mt-3 w-100"
                    >
                        Checkout
                    </Button>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;