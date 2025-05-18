// import React from "react";
// import { Table, Button } from "react-bootstrap";

// const ShoppingCart = ({ cartItems, updateCart, removeItem, submitOrder }) => {
//     return (
//         <div>
//             <h3>Shopping Cart</h3>
//             {cartItems.length === 0 ? (
//                 <p>Your cart is empty.</p>
//             ) : (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>Dish Name</th>
//                             <th>Quantity</th>
//                             <th>Rice Option (if any)</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cartItems.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{item.dishName}</td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         value={item.quantity}
//                                         onChange={(e) => updateCart(item.id, e.target.value)}
//                                     />
//                                 </td>
//                                 <td>{item.riceOption || "N/A"}</td>
//                                 <td>
//                                     <Button variant="danger" onClick={() => removeItem(item.id)}>Remove</Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             )}
//             {cartItems.length > 0 && (
//                 <Button variant="success" onClick={submitOrder}>
//                     Submit Order
//                 </Button>
//             )}
//         </div>
//     );
// };

// export default ShoppingCart;


import React from "react";
import { Table, Button } from "react-bootstrap";

const ShoppingCart = ({ cartItems, updateCart, removeItem, submitOrder }) => {
    // Handler to update quantity, ensure number and minimum 1
    const handleQuantityChange = (id, value) => {
        const quantity = Math.max(1, Number(value)); // force minimum 1
        updateCart(id, quantity);
    };

    return (
        <div>
            <h3>Shopping Cart</h3>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Dish Name</th>
                            <th>Quantity</th>
                            <th>Rice Option (if any)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.dishName}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        style={{ width: "60px" }}
                                    />
                                </td>
                                <td>{item.riceOption || "N/A"}</td>
                                <td>
                                    <Button variant="danger" onClick={() => removeItem(item.id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {cartItems.length > 0 && (
                <Button variant="success" onClick={submitOrder}>
                    Submit Order
                </Button>
            )}
        </div>
    );
};

export default ShoppingCart;